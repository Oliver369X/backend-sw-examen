# 🚀 GUÍA RÁPIDA DE DESPLIEGUE - RENDER

## ✅ Todo está listo para desplegar

### 📋 Archivos configurados:

1. ✅ **Dockerfile.prod** - Dockerfile optimizado con variables hardcodeadas
2. ✅ **render.yaml** - Configuración automática para Render
3. ✅ **package.json** - Scripts de producción agregados
4. ✅ **start-prod.sh** - Script de inicio con migraciones

### 🔑 Variables Hardcodeadas en Dockerfile.prod:

```bash
DATABASE_URL=postgresql://diagramador_108y_user:q4gNGN2VXK13CS7UVM6pRarxSzClGubc@dpg-d3ds3dodl3ps73c5guj0-a/diagramador_108y
PORT=4000
NODE_ENV=production
JWT_SECRET=tu_clave_secreta_super_segura_2024
GEMINI_API_KEY=AIzaSyBzVhU-30JcNgJu0Xy5JkdKBGICbMUtbng
```

---

## 🚀 OPCIÓN 1: Despliegue con render.yaml (MÁS FÁCIL)

1. Ve a: https://dashboard.render.com
2. Click en **"New +"** → **"Blueprint"**
3. Conecta tu repositorio
4. Render detectará `render.yaml` automáticamente
5. Click en **"Apply"**
6. ¡Listo! 🎉

---

## 🚀 OPCIÓN 2: Despliegue Manual

### Paso 1: Crear Web Service

1. Ve a: https://dashboard.render.com
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio

### Paso 2: Configuración

```
Name: diagramador-backend
Region: Oregon
Branch: main (o tu rama principal)
Root Directory: backen_exa1
Runtime: Docker
Dockerfile Path: ./Dockerfile.prod
Instance Type: Free (o el que prefieras)
```

### Paso 3: Variables de Entorno (OPCIONAL)

Las variables ya están en el Dockerfile, pero puedes sobrescribirlas:

```
DATABASE_URL=postgresql://diagramador_108y_user:q4gNGN2VXK13CS7UVM6pRarxSzClGubc@dpg-d3ds3dodl3ps73c5guj0-a/diagramador_108y
PORT=4000
NODE_ENV=production
```

### Paso 4: Deploy

Click en **"Create Web Service"** y espera a que compile.

---

## 🔍 Verificar Despliegue

Tu API estará en: `https://diagramador-backend.onrender.com`

### Endpoints de prueba:

```bash
# Health check
curl https://diagramador-backend.onrender.com/

# Listar usuarios
curl https://diagramador-backend.onrender.com/api/usuarios

# Listar salas
curl https://diagramador-backend.onrender.com/api/salas
```

---

## 🔄 Migraciones Automáticas

El servidor ejecuta automáticamente:
```bash
npx prisma migrate deploy && node dist/server.js
```

Esto aplica todas las migraciones antes de iniciar.

---

## 📝 IMPORTANTE - Actualizar Frontend

Después del despliegue, actualiza la URL del backend en tu frontend:

```javascript
// Cambiar de:
const API_URL = 'http://localhost:4000';

// A:
const API_URL = 'https://diagramador-backend.onrender.com';
```

---

## 🐛 Troubleshooting

### Error de conexión a BD:
- Verifica que la URL de la base de datos sea correcta
- Asegúrate de que la BD esté activa en Render

### Error de compilación:
- Revisa los logs en Render Dashboard
- Verifica que todas las dependencias estén en `package.json`

### Migraciones fallan:
- Las migraciones están en `prisma/migrations/`
- Se aplican con `prisma migrate deploy`

---

## 📊 Monitoreo

1. Ve a tu servicio en Render Dashboard
2. Click en **"Logs"** para ver output en tiempo real
3. Click en **"Metrics"** para ver uso de recursos

---

## 🔄 Actualizar Despliegue

Cualquier push a tu rama principal activará un nuevo deploy automático.

---

## ✨ ¡TODO LISTO!

Solo necesitas:
1. Subir estos cambios a tu repositorio
2. Crear el servicio en Render
3. ¡Disfrutar de tu API en producción! 🎉
