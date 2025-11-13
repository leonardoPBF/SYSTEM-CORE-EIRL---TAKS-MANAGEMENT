# Docker Setup para TaskSystemCore

## Configuración de PostgreSQL con Docker

### Opción 1: Solo PostgreSQL (Recomendado para desarrollo)

#### 1. Iniciar PostgreSQL

```bash
cd backend
docker-compose up -d
```

O usando el archivo específico para desarrollo:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### 2. Verificar que está corriendo

```bash
docker ps
```

Deberías ver el contenedor `tasksystemcore-postgres` corriendo.

#### 3. Configurar el .env

Copia el archivo `.env.docker` a `.env` o actualiza tu `.env` con:

```env
DBCONNECTION=postgresql://tasksystemcore:tasksystemcore123@localhost:5432/tasksystemcore
```

#### 4. Crear las tablas

```bash
npm run db:push
```

#### 5. Sembrar la base de datos

```bash
npm run db:seed
```

O simplemente inicia el servidor (el seed se ejecutará automáticamente):

```bash
npm run dev
```

### Opción 2: PostgreSQL + Backend (Todo en Docker)

```bash
docker-compose -f docker-compose.full.yml up -d
```

Esto iniciará tanto PostgreSQL como el backend en contenedores.

## Comandos Útiles

### Ver logs de PostgreSQL

```bash
docker-compose logs -f postgres
```

### Detener PostgreSQL

```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ Esto borra los datos)

```bash
docker-compose down -v
```

### Reiniciar PostgreSQL

```bash
docker-compose restart postgres
```

### Acceder a PostgreSQL desde el contenedor

```bash
docker exec -it tasksystemcore-postgres psql -U tasksystemcore -d tasksystemcore
```

### Ver el estado de los contenedores

```bash
docker-compose ps
```

### Reconstruir los contenedores

```bash
docker-compose up -d --build
```

## Credenciales por Defecto

- **Usuario**: `tasksystemcore`
- **Contraseña**: `tasksystemcore123`
- **Base de datos**: `tasksystemcore`
- **Puerto**: `5432`

## Cambiar Credenciales

Si quieres cambiar las credenciales, edita `docker-compose.yml`:

```yaml
environment:
  POSTGRES_USER: tu_usuario
  POSTGRES_PASSWORD: tu_contraseña
  POSTGRES_DB: tu_base_de_datos
```

Y actualiza tu `.env` con las nuevas credenciales.

## Persistencia de Datos

Los datos se guardan en un volumen de Docker llamado `postgres_data`. Esto significa que aunque detengas el contenedor, los datos se mantendrán.

Para eliminar todos los datos:

```bash
docker-compose down -v
```

## Solución de Problemas

### Error: Puerto 5432 ya en uso

Si ya tienes PostgreSQL corriendo localmente, puedes cambiar el puerto en `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Usa 5433 en tu máquina, 5432 en el contenedor
```

Y actualiza tu `.env`:

```env
DBCONNECTION=postgresql://tasksystemcore:tasksystemcore123@localhost:5433/tasksystemcore
```

### Error: Contenedor no inicia

Verifica los logs:

```bash
docker-compose logs postgres
```

### Reiniciar desde cero

```bash
# Detener y eliminar contenedores y volúmenes
docker-compose down -v

# Iniciar de nuevo
docker-compose up -d

# Esperar a que PostgreSQL esté listo
sleep 5

# Crear tablas
npm run db:push

# Sembrar datos
npm run db:seed
```

## Backup y Restore

### Backup

```bash
docker exec tasksystemcore-postgres pg_dump -U tasksystemcore tasksystemcore > backup.sql
```

### Restore

```bash
docker exec -i tasksystemcore-postgres psql -U tasksystemcore -d tasksystemcore < backup.sql
```

## Producción

Para producción, considera:

1. Cambiar las credenciales por defecto
2. Usar variables de entorno para credenciales sensibles
3. Configurar SSL para PostgreSQL
4. Usar un volumen nombrado persistente
5. Configurar backups automáticos

Ejemplo con variables de entorno:

```yaml
environment:
  POSTGRES_USER: ${POSTGRES_USER:-tasksystemcore}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-tasksystemcore123}
  POSTGRES_DB: ${POSTGRES_DB:-tasksystemcore}
```

