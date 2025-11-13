# Dockerfile para el backend (opcional - solo si quieres containerizar la app)
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 5000

# Comando por defecto
CMD ["npm", "run", "dev"]

