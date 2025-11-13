# TaskSystemCore EIRL - Sistema de Gestión de Tickets

Sistema completo de gestión de tickets de soporte técnico estilo Zoho, desarrollado para TaskSystemCore EIRL.

## 🚀 Características

- ✅ Autenticación y autorización con JWT
- ✅ Sistema de roles (Admin, Director TI, Equipo TI, Cliente)
- ✅ **Creación de tickets con formulario completo**
- ✅ Gestión de clientes y agentes
- ✅ Dashboard con métricas en tiempo real
- ✅ Sistema de comentarios en tickets
- ✅ Flujo de trabajo de tickets (Open → Pending → Assigned → In Progress → Resolved → Closed)
- ✅ Interfaz moderna y responsiva con TailwindCSS
- ✅ Base de datos PostgreSQL con Drizzle ORM

## 📋 Inicio Rápido

### Opción 1: Guía Detallada (Recomendado)

Para instrucciones completas de instalación y configuración, consulta:
**[GUIA_INSTALACION.md](./GUIA_INSTALACION.md)**

### Opción 2: Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd SYSTEM-CORE-EIRL---TAKS-MANAGEMENT

# 2. Configurar Backend
cd backend
npm install
cp env.example.txt .env
# Editar .env con tus credenciales de PostgreSQL
npm run db:push      # Crear tablas
npm run db:seed      # Poblar datos de ejemplo
npm run dev          # Iniciar servidor

# 3. Configurar Frontend (en otra terminal)
cd frontend
npm install
npm run dev          # Iniciar aplicación
```

## 🏗️ Estructura del Proyecto

```
SYSTEM-CORE-EIRL---TAKS-MANAGEMENT/
├── frontend/                 # Aplicación React + Vite + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── ui/         # Componentes UI (Button, Dialog, etc.)
│   │   │   └── Layout/     # Componentes de layout
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # API client
│   │   ├── context/        # Context API (Auth)
│   │   └── types/          # Tipos TypeScript
│   └── package.json
├── backend/                 # API Express + TypeScript
│   ├── src/
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de la API
│   │   ├── middleware/     # Auth y validaciones
│   │   ├── db/            # Configuración BD y esquemas
│   │   └── types/         # Tipos TypeScript
│   └── package.json
├── GUIA_INSTALACION.md     # Guía completa de instalación
├── IMPLEMENTACION_NUEVO_TICKET.md  # Documentación de la feature
└── README.md               # Este archivo
```

## 🎯 Funcionalidades Principales

### ✨ Nuevo: Creación de Tickets

- Formulario modal intuitivo
- Selección de cliente
- Campos: Asunto, Descripción, Prioridad, Tipo, Fuente
- Validación en tiempo real
- Creación instantánea con actualización de lista

### 👥 Gestión de Usuarios y Roles

- **Admin**: Control total del sistema
- **Director TI**: Revisión y asignación de tickets
- **Equipo TI**: Resolución de tickets asignados
- **Cliente**: Creación y seguimiento de tickets

### 📊 Dashboard

- Métricas en tiempo real
- Estadísticas de tickets
- Indicadores de rendimiento

### 🎫 Gestión de Tickets

- Lista completa de tickets
- Filtros y búsqueda
- Vista detallada de tickets
- Sistema de prioridades
- Seguimiento de estados

## 🛠️ Tecnologías

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **React Router** - Navegación
- **Lucide React** - Iconos

### Backend
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **Drizzle ORM** - ORM para PostgreSQL
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas

### Base de Datos
- **PostgreSQL** - Base de datos relacional
- **Drizzle Kit** - Migraciones

## 📚 Documentación Adicional

- [Guía de Instalación](./GUIA_INSTALACION.md) - Instrucciones detalladas de setup
- [Implementación Nuevo Ticket](./IMPLEMENTACION_NUEVO_TICKET.md) - Documentación técnica de la feature
- [API Documentation](./backend/API.md) - Endpoints y uso de la API
- [Database Schema](./backend/README_DB.md) - Estructura de la base de datos

## 🔐 Usuarios de Prueba

Al ejecutar los seeders, se crean estos usuarios:

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@tasksystemcore.com | admin123 |
| Director TI | director@tasksystemcore.com | director123 |
| Equipo TI | agent@tasksystemcore.com | agent123 |
| Cliente | client@acme.com | client123 |

## 🚦 Scripts Disponibles

### Backend

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar TypeScript
npm start            # Producción
npm run db:push      # Aplicar esquema a la BD
npm run db:seed      # Poblar con datos de ejemplo
npm run db:studio    # Abrir Drizzle Studio
```

### Frontend

```bash
npm run dev          # Desarrollo
npm run build        # Compilar para producción
npm run preview      # Vista previa de producción
```

## 📝 Cómo Crear un Ticket

1. Inicia sesión en la aplicación
2. Ve a la sección "Tickets"
3. Haz clic en "Nuevo Ticket"
4. Completa el formulario:
   - Selecciona un cliente
   - Ingresa el asunto
   - Describe el problema
   - Ajusta prioridad, tipo y fuente
5. Haz clic en "Crear Ticket"
6. ¡Listo! El ticket aparecerá en la lista

## 🔄 Flujo de un Ticket

```
Cliente → Open
    ↓
Director TI Revisa → Pending_Director
    ↓
Director TI Asigna → Assigned
    ↓
Equipo TI Trabaja → In Progress
    ↓
Equipo TI Resuelve → Resolved
    ↓
Cierre → Closed
```

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté ejecutándose
psql -U postgres -h localhost

# Verificar credenciales en backend/.env
DBCONNECTION=postgresql://user:password@localhost:5432/tasksystemcore
```

### Puerto en uso
```bash
# Backend (cambiar en .env)
PORT=5001

# Frontend (Vite asignará automáticamente otro puerto)
```

### Error 401 Unauthorized
- Cierra sesión y vuelve a iniciar sesión
- Verifica que el token no haya expirado

## 🤝 Contribuir

1. Fork del proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

© 2024 TaskSystemCore EIRL. Todos los derechos reservados.

## 📞 Soporte

Para problemas o preguntas:
- Revisa la [Guía de Instalación](./GUIA_INSTALACION.md)
- Consulta los logs del backend y frontend
- Verifica la consola del navegador (F12)

---

Desarrollado con ❤️ por TaskSystemCore EIRL

