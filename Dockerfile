# Usa la imagen oficial de Node.js
FROM node:18-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json (para optimizar caché de Docker)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente de Angular
COPY . .

# Exponer el puerto de desarrollo de Angular (4200)
EXPOSE 4200

# Iniciar la aplicación en modo desarrollo (con --poll para detectar cambios en Windows/WSL2)
CMD ["npm", "start"]