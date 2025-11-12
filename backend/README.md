# TaskSystemCore EIRL - Backend

API backend desarrollada con Express y TypeScript para sistema de gestión de tickets estilo Zoho.

## Características

- ✅ Autenticación JWT
- ✅ Sistema de roles (Admin, Agent, Client, Manager)
- ✅ CRUD completo para Tickets, Clientes, Agentes
- ✅ Sistema de comentarios en tickets
- ✅ Dashboard con métricas
- ✅ Seeders con datos de ejemplo
- ✅ Middleware de autenticación y autorización

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:5000`

## Build

```bash
npm run build
```

## Producción

```bash
npm start
```

## Variables de Entorno

Crea un archivo `.env` con las siguientes variables:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
```

## Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/    # Controladores de las rutas
│   ├── models/         # Modelos de datos
│   ├── routes/         # Definición de rutas
│   ├── middleware/     # Middleware (auth, etc.)
│   ├── types/          # Tipos TypeScript
│   ├── data/           # Seeders y datos iniciales
│   └── index.ts        # Punto de entrada
├── package.json
└── tsconfig.json
```

## Endpoints Principales

- `/api/auth` - Autenticación (login, register, profile)
- `/api/tickets` - Gestión de tickets
- `/api/clients` - Gestión de clientes
- `/api/agents` - Gestión de agentes
- `/api/comments` - Comentarios en tickets
- `/api/dashboard` - Métricas del dashboard

Ver `API.md` para documentación completa de la API.

## Usuarios de Prueba (Seeders)

Al iniciar el servidor en desarrollo, se crean automáticamente:

### Admin
- Email: `admin@tasksystemcore.com`
- Password: `admin123`

### Agent
- Email: `leslie@tasksystemcore.com`
- Password: `agent123`

### Client
- Email: `jane@acme.com`
- Password: `client123`

## Modelos de Datos

- **User**: Usuarios del sistema con roles
- **Ticket**: Tickets de soporte
- **Client**: Información de clientes
- **Agent**: Información de agentes
- **Comment**: Comentarios en tickets
- **Tag**: Etiquetas para tickets
- **Queue**: Colas de tickets
- **SLA**: Acuerdos de nivel de servicio

## Tecnologías

- Express.js
- TypeScript
- JWT para autenticación
- bcrypt para encriptación de passwords
- UUID para generación de IDs

