# Configuración de Base de Datos Local

## Pasos para configurar la base de datos local

### 1. Instalar PostgreSQL

Asegúrate de tener PostgreSQL instalado y corriendo en tu máquina local.

### 2. Crear la Base de Datos

```sql
CREATE DATABASE tasksystemcore;
```

O usando psql:
```bash
psql -U postgres
CREATE DATABASE tasksystemcore;
\q
```

### 3. Configurar el archivo .env

Crea o actualiza el archivo `.env` en la raíz del backend:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
DBCONNECTION=postgresql://usuario:contraseña@localhost:5432/tasksystemcore
```

**Ejemplo para usuario por defecto:**
```env
DBCONNECTION=postgresql://postgres:postgres@localhost:5432/tasksystemcore
```

**Ejemplo sin contraseña:**
```env
DBCONNECTION=postgresql://postgres@localhost:5432/tasksystemcore
```

### 4. Crear las Tablas

Ejecuta uno de estos comandos para crear las tablas:

```bash
npm run db:push
```

Este comando sincronizará el esquema con la base de datos y creará todas las tablas necesarias.

### 5. Sembrar la Base de Datos

El seed se ejecutará automáticamente al iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

O ejecútalo manualmente:

```bash
npm run db:seed
```

## Solución de Problemas

### Error: ECONNREFUSED

**Problema:** No se puede conectar a PostgreSQL.

**Soluciones:**
1. Verifica que PostgreSQL esté corriendo:
   ```bash
   # Windows
   services.msc (busca PostgreSQL)
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Verifica el puerto (por defecto es 5432)

3. Verifica las credenciales en `.env`

### Error: La base de datos no existe

**Solución:** Crea la base de datos primero:
```sql
CREATE DATABASE tasksystemcore;
```

### Error: Las tablas no existen

**Solución:** Ejecuta:
```bash
npm run db:push
```

### Verificar Conexión

Puedes verificar la conexión manualmente:

```bash
psql -U postgres -d tasksystemcore
```

## Comandos Útiles

- `npm run db:push` - Sincroniza el esquema con la BD (crea/actualiza tablas)
- `npm run db:generate` - Genera archivos de migración
- `npm run db:migrate` - Aplica migraciones
- `npm run db:studio` - Abre Drizzle Studio (interfaz visual)
- `npm run db:seed` - Ejecuta el seed manualmente

## Estructura de la Base de Datos

Las siguientes tablas se crearán automáticamente:

- `users` - Usuarios del sistema
- `clients` - Clientes
- `agents` - Agentes de soporte
- `tickets` - Tickets de soporte
- `comments` - Comentarios en tickets

## Credenciales de Prueba

Después del seed, puedes usar:

- **Admin**: `admin@tasksystemcore.com` / `admin123`
- **Agente**: `leslie@tasksystemcore.com` / `agent123`
- **Cliente**: `jane@acme.com` / `client123`

