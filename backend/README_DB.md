# Configuración de Base de Datos con Drizzle ORM

## Configuración

1. **Variables de Entorno**

   Crea un archivo `.env` en la raíz del backend con:

   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-secret-key-change-in-production
   DBCONNECTION=postgresql://user:password@localhost:5432/tasksystemcore
   ```

   O alternativamente puedes usar:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/tasksystemcore
   ```

2. **Instalación de Dependencias**

   ```bash
   npm install
   ```

## Comandos Disponibles

### Generar Migraciones
```bash
npm run db:generate
```
Genera las migraciones basadas en el esquema definido en `src/db/schema.ts`.

### Aplicar Migraciones
```bash
npm run db:migrate
```
Aplica las migraciones a la base de datos.

### Push del Esquema (Desarrollo)
```bash
npm run db:push
```
Sincroniza el esquema directamente con la base de datos (útil en desarrollo).

### Drizzle Studio
```bash
npm run db:studio
```
Abre Drizzle Studio, una interfaz visual para explorar y editar la base de datos.

### Seed de Datos
```bash
npm run db:seed
```
Ejecuta el seed para poblar la base de datos con datos de ejemplo.

## Estructura

- `src/db/index.ts` - Configuración de la conexión a la base de datos
- `src/db/schema.ts` - Esquema de la base de datos definido con Drizzle
- `src/db/seed.ts` - Script de seed para poblar la base de datos
- `drizzle.config.ts` - Configuración de Drizzle Kit

## Modelos Actualizados

Todos los modelos ahora usan Drizzle ORM:
- `UserModel` - Usuarios del sistema
- `ClientModel` - Clientes
- `AgentModel` - Agentes
- `TicketModel` - Tickets
- `CommentModel` - Comentarios

## Seed de Datos

El seed crea automáticamente:
- 1 Usuario Administrador
- 3 Usuarios Agentes
- 3 Usuarios Clientes
- 3 Clientes
- 3 Agentes
- 5 Tickets
- 5 Comentarios

### Credenciales de Prueba

- **Admin**: `admin@tasksystemcore.com` / `admin123`
- **Agente**: `leslie@tasksystemcore.com` / `agent123`
- **Cliente**: `jane@acme.com` / `client123`

## Notas

- El seed se ejecuta automáticamente al iniciar el servidor en modo desarrollo
- Asegúrate de que PostgreSQL esté corriendo antes de iniciar el servidor
- La conexión usa un pool de conexiones para mejor rendimiento

