# 🚀 Referencia Rápida - Sistema de Gestión de Tickets

## Inicio Rápido

### 1. Backend
```bash
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev
```
**URL**: `http://localhost:5000`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
**URL**: `http://localhost:5173`

---

## 🔐 Usuarios de Prueba

| Usuario | Email | Password |
|---------|-------|----------|
| **Admin** | admin@tasksystemcore.com | admin123 |
| **Director TI** | director@tasksystemcore.com | director123 |
| **Agente TI** | agent@tasksystemcore.com | agent123 |
| **Cliente** | client@acme.com | client123 |

---

## 📝 Crear un Ticket (3 pasos)

1. **Login** → Usa cualquier usuario de prueba
2. **Ir a Tickets** → Menú lateral
3. **Nuevo Ticket** → Botón azul superior derecho

### Formulario de Ticket
- ✅ **Cliente*** (requerido) - Selector dropdown
- ✅ **Asunto*** (requerido) - Título descriptivo
- ✅ **Descripción*** (requerido) - Detalles del problema
- 📊 **Prioridad** - Baja | Media | Alta | Urgente
- 🏷️ **Tipo** - General | Técnico | Consulta | Incidente | Solicitud
- 📍 **Fuente** - Portal | Email | Teléfono | Chat

---

## 🔄 Estados de Ticket

```
Open → Pending_Director → Assigned → In Progress → Resolved → Closed
```

---

## 📂 Estructura de Archivos

```
├── backend/
│   ├── src/
│   │   ├── controllers/ticketController.ts  # Lógica de tickets
│   │   ├── models/Ticket.ts                # Modelo de datos
│   │   ├── routes/ticketRoutes.ts          # Rutas API
│   │   └── db/schema.ts                    # Esquema BD
│   └── .env                                # Configuración
├── frontend/
│   ├── src/
│   │   ├── pages/Tickets.tsx               # Vista de tickets
│   │   ├── components/ui/                  # Componentes UI
│   │   └── services/api.ts                 # Cliente API
└── README.md
```

---

## 🛠️ Comandos Útiles

### Backend
```bash
npm run dev          # Desarrollo
npm run db:push      # Aplicar esquema
npm run db:seed      # Datos de prueba
npm run db:studio    # Ver base de datos
```

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Producción
```

### Base de Datos (psql)
```bash
psql -U postgres -d tasksystemcore
```

---

## 🔌 Endpoints API

### Autenticación
```
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/profile
```

### Tickets
```
GET    /api/tickets          # Listar todos
GET    /api/tickets/:id      # Ver uno
POST   /api/tickets          # Crear
PUT    /api/tickets/:id      # Actualizar
DELETE /api/tickets/:id      # Eliminar
```

### Clientes
```
GET    /api/clients          # Listar todos
POST   /api/clients          # Crear
```

---

## 🐛 Solución Rápida de Problemas

### ❌ Error: "Cannot connect to database"
```bash
# Verificar PostgreSQL
psql -U postgres
# Verificar .env
DBCONNECTION=postgresql://postgres:postgres@localhost:5432/tasksystemcore
```

### ❌ Error: "Port 5000 already in use"
```bash
# Cambiar puerto en backend/.env
PORT=5001
```

### ❌ Error: "401 Unauthorized"
```bash
# Cerrar sesión y volver a iniciar sesión
```

### ❌ Error: "Cannot find module"
```bash
# Reinstalar dependencias
npm install
```

---

## 📊 Variables de Entorno (backend/.env)

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=tu-clave-secreta-cambiar-en-produccion
DBCONNECTION=postgresql://postgres:postgres@localhost:5432/tasksystemcore
```

---

## 🧪 Probar la API con cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tasksystemcore.com","password":"admin123"}'
```

### Crear Ticket
```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "subject":"Test Ticket",
    "description":"Este es un ticket de prueba",
    "clientId":"uuid-del-cliente",
    "priority":"medium",
    "type":"General",
    "source":"portal"
  }'
```

### Listar Tickets
```bash
curl http://localhost:5000/api/tickets \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 📚 Documentación Completa

- **Instalación**: [GUIA_INSTALACION.md](./GUIA_INSTALACION.md)
- **Feature**: [IMPLEMENTACION_NUEVO_TICKET.md](./IMPLEMENTACION_NUEVO_TICKET.md)
- **API**: [backend/API.md](./backend/API.md)
- **Base de Datos**: [backend/README_DB.md](./backend/README_DB.md)

---

## ⚡ Atajos de Teclado (Sugeridos)

| Acción | Atajo |
|--------|-------|
| Nuevo Ticket | `Ctrl + N` |
| Buscar Tickets | `Ctrl + K` |
| Ver Dashboard | `Ctrl + D` |

*(No implementados aún - sugerencia para mejora futura)*

---

## 🎯 Flujo Completo de Trabajo

1. **Cliente crea ticket**
   - Login → Tickets → Nuevo Ticket
   - Completa formulario → Crear

2. **Director TI revisa**
   - Login como Director TI
   - Ve ticket en "Open"
   - Revisa y cambia a "Pending_Director"

3. **Director TI asigna**
   - Selecciona agente del equipo TI
   - Cambia estado a "Assigned"

4. **Agente TI resuelve**
   - Login como Agente TI
   - Ve tickets asignados
   - Trabaja y cambia a "In Progress"
   - Resuelve y marca como "Resolved"

5. **Cierre**
   - Director o Admin cierra el ticket
   - Estado final: "Closed"

---

## 🔑 Tips y Consejos

### Performance
- ✅ Usa índices en la base de datos
- ✅ Implementa paginación para muchos tickets
- ✅ Cachea datos estáticos

### Seguridad
- 🔒 Cambia `JWT_SECRET` en producción
- 🔒 Usa HTTPS en producción
- 🔒 Valida todos los inputs
- 🔒 Implementa rate limiting

### UX
- 💡 Agrega notificaciones push
- 💡 Implementa búsqueda en tiempo real
- 💡 Añade drag & drop para prioridades

---

## 📞 Ayuda Rápida

### Logs del Backend
```bash
cd backend
npm run dev
# Los logs aparecerán en la terminal
```

### Logs del Frontend
```bash
# Abre la consola del navegador
F12 → Console
```

### Ver Base de Datos
```bash
cd backend
npm run db:studio
# Abre https://local.drizzle.studio
```

---

**¿Necesitas más ayuda?** Consulta [GUIA_INSTALACION.md](./GUIA_INSTALACION.md) para detalles completos.
