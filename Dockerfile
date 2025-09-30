# Dockerfile para Backend Node.js + TypeScript
FROM node:18-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    postgresql-client

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

# Instalar dependencias del sistema para producción
RUN apk add --no-cache \
    postgresql-client \
    dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/package*.json ./

# Cambiar propietario de archivos
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer puerto
EXPOSE 4000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=4000

# Comando de inicio
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]

