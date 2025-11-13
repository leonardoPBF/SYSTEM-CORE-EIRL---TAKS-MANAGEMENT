-- Script de Verificación de Base de Datos
-- TaskSystemCore EIRL - Sistema de Gestión de Tickets

-- ============================================
-- 1. VERIFICAR ESTRUCTURA DE TABLAS
-- ============================================

-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ============================================
-- 2. VERIFICAR TABLA USERS
-- ============================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Ver usuarios existentes
SELECT id, name, email, role, is_active
FROM users;

-- ============================================
-- 3. VERIFICAR TABLA CLIENTS
-- ============================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'clients'
ORDER BY ordinal_position;

-- Ver clientes existentes
SELECT c.id, u.name, c.company, c.status, c.segment
FROM clients c
JOIN users u ON c.user_id = u.id;

-- ============================================
-- 4. VERIFICAR TABLA AGENTS
-- ============================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'agents'
ORDER BY ordinal_position;

-- Ver agentes existentes
SELECT a.id, u.name, u.email, a.role, a.status, a.max_tickets
FROM agents a
JOIN users u ON a.user_id = u.id;

-- ============================================
-- 5. VERIFICAR TABLA TICKETS
-- ============================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tickets'
ORDER BY ordinal_position;

-- Ver tickets existentes
SELECT 
    t.id,
    t.ticket_number,
    t.subject,
    t.priority,
    t.status,
    t.type,
    t.source,
    c.company as client_company,
    u.name as created_by_name,
    t.created_at
FROM tickets t
JOIN clients c ON t.client_id = c.id
JOIN users u ON t.created_by = u.id
ORDER BY t.created_at DESC;

-- ============================================
-- 6. VERIFICAR TABLA COMMENTS
-- ============================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;

-- Ver comentarios existentes
SELECT 
    co.id,
    t.ticket_number,
    u.name as author,
    co.content,
    co.is_internal,
    co.created_at
FROM comments co
JOIN tickets t ON co.ticket_id = t.id
JOIN users u ON co.user_id = u.id
ORDER BY co.created_at DESC;

-- ============================================
-- 7. VERIFICAR ENUMS
-- ============================================

-- User roles
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
    SELECT oid 
    FROM pg_type 
    WHERE typname = 'user_role'
);

-- Ticket status
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
    SELECT oid 
    FROM pg_type 
    WHERE typname = 'ticket_status'
);

-- Ticket priority
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
    SELECT oid 
    FROM pg_type 
    WHERE typname = 'ticket_priority'
);

-- Ticket source
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
    SELECT oid 
    FROM pg_type 
    WHERE typname = 'ticket_source'
);

-- Agent status
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
    SELECT oid 
    FROM pg_type 
    WHERE typname = 'agent_status'
);

-- ============================================
-- 8. ESTADÍSTICAS DEL SISTEMA
-- ============================================

-- Resumen general
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM clients) as total_clients,
    (SELECT COUNT(*) FROM agents) as total_agents,
    (SELECT COUNT(*) FROM tickets) as total_tickets,
    (SELECT COUNT(*) FROM comments) as total_comments;

-- Tickets por estado
SELECT status, COUNT(*) as count
FROM tickets
GROUP BY status
ORDER BY count DESC;

-- Tickets por prioridad
SELECT priority, COUNT(*) as count
FROM tickets
GROUP BY priority
ORDER BY count DESC;

-- Tickets por cliente
SELECT 
    c.company,
    COUNT(t.id) as ticket_count
FROM clients c
LEFT JOIN tickets t ON c.id = t.client_id
GROUP BY c.id, c.company
ORDER BY ticket_count DESC;

-- Tickets por agente asignado
SELECT 
    COALESCE(u.name, 'Sin Asignar') as agent_name,
    COUNT(t.id) as ticket_count
FROM tickets t
LEFT JOIN agents a ON t.assigned_to = a.id
LEFT JOIN users u ON a.user_id = u.id
GROUP BY u.name
ORDER BY ticket_count DESC;

-- ============================================
-- 9. VERIFICAR RELACIONES Y CONSTRAINTS
-- ============================================

-- Ver foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ============================================
-- 10. DATOS DE PRUEBA (Para insertar si no existen)
-- ============================================

-- NOTA: Estos comandos solo deben ejecutarse si la base de datos está vacía
-- El sistema usa seeders en el backend para poblar datos iniciales

/*
-- Ejemplo de creación de usuario admin (si no existe)
INSERT INTO users (email, password, name, role, is_active)
SELECT 
    'admin@tasksystemcore.com',
    '$2b$10$abcdefghijklmnopqrstuvwxyz', -- Hash de bcrypt para 'admin123'
    'Administrator',
    'admin',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@tasksystemcore.com'
);
*/

-- ============================================
-- 11. LIMPIAR DATOS (¡CUIDADO! Solo para desarrollo)
-- ============================================

/*
-- ADVERTENCIA: Estos comandos eliminarán TODOS los datos
-- Solo usar en ambiente de desarrollo

-- Eliminar en orden debido a foreign keys
DELETE FROM comments;
DELETE FROM tickets;
DELETE FROM agents;
DELETE FROM clients;
DELETE FROM users;

-- Reiniciar secuencias si es necesario
-- ALTER SEQUENCE ... RESTART WITH 1;
*/

-- ============================================
-- QUERIES ÚTILES PARA DEBUGGING
-- ============================================

-- Ver último ticket creado
SELECT * FROM tickets ORDER BY created_at DESC LIMIT 1;

-- Ver tickets abiertos
SELECT ticket_number, subject, priority, created_at
FROM tickets
WHERE status = 'open'
ORDER BY created_at DESC;

-- Ver tickets sin asignar
SELECT ticket_number, subject, priority, created_at
FROM tickets
WHERE assigned_to IS NULL
ORDER BY created_at DESC;

-- Ver tickets de un cliente específico
-- SELECT * FROM tickets WHERE client_id = 'uuid-del-cliente';

-- Ver actividad reciente (últimos 10 tickets)
SELECT 
    t.ticket_number,
    t.subject,
    t.status,
    c.company,
    t.created_at,
    t.updated_at
FROM tickets t
JOIN clients c ON t.client_id = c.id
ORDER BY t.updated_at DESC
LIMIT 10;
