#!/bin/sh
# Script de inicio para producción

echo "🚀 Iniciando aplicación en modo producción..."

# Ejecutar migraciones de Prisma
echo "📦 Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

# Verificar que las migraciones fueron exitosas
if [ $? -eq 0 ]; then
    echo "✅ Migraciones aplicadas correctamente"
else
    echo "❌ Error al aplicar migraciones"
    exit 1
fi

# Iniciar el servidor
echo "🌐 Iniciando servidor..."
node dist/server.js
