# 🚀 Instrucciones de Despliegue en Render

## Configuración Completa para Producción

### Base de Datos PostgreSQL
- **URL de Conexión**: `postgresql://diagramador_108y_user:q4gNGN2VXK13CS7UVM6pRarxSzClGubc@dpg-d3ds3dodl3ps73c5guj0-a/diagramador_108y`
- **Provider**: Render PostgreSQL

### Archivos Configurados

1. **`.env.production`** - Variables de entorno de producción (hardcodeadas)
2. **`Dockerfile.prod`** - Dockerfile optimizado para Render
3. **`render.yaml`** - Configuración para auto-deploy en Render
4. **`.dockerignore`** - Archivos excluidos del build

### Pasos para Desplegar en Render

#### Opción 1: Usando render.yaml (Recomendado)

1. **Conecta tu repositorio a Render**
   - Ve a https://dashboard.render.com
   - Click en "New +" → "Blueprint"
   - Conecta tu repositorio de GitHub/GitLab
   - Render detectará automáticamente el `render.yaml`

2. **Render automáticamente:**
   - Creará el servicio web
   - Configurará las variables de entorno
   - Ejecutará las migraciones de Prisma
   - Desplegará la aplicación

#### Opción 2: Manual

1. **Crear Web Service en Render**
   - Ve a https://dashboard.render.com
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio

2. **Configuración del Servicio:**
   ```
   Name: diagramador-backend
   Region: Oregon (o el más cercano)
   Branch: main
   Runtime: Docker
   Docker Command: (dejar vacío, usa CMD del Dockerfile)
   Dockerfile Path: ./Dockerfile.prod
   Instance Type: Free
   ```

3. **Variables de Entorno:**
   Agrega las siguientes variables en la sección "Environment":
   ```
   DATABASE_URL=postgresql://diagramador_108y_user:q4gNGN2VXK13CS7UVM6pRarxSzClGubc@dpg-d3ds3dodl3ps73c5guj0-a/diagramador_108y
   PORT=4000
   NODE_ENV=production
   JWT_SECRET=tu_clave_secreta_super_segura_2024
   GEMINI_API_KEY=AIzaSyBzVhU-30JcNgJu0Xy5JkdKBGICbMUtbng
   ```

4. **Deploy**
   - Click en "Create Web Service"
   - Render automáticamente compilará y desplegará

### Verificación del Despliegue

Una vez desplegado, tu backend estará disponible en:
```
https://diagramador-backend.onrender.com
```

Puedes verificar los endpoints:
- `GET /api/usuarios` - Lista de usuarios
- `GET /api/salas` - Lista de salas
- `POST /auth/login` - Autenticación
- `POST /api/ai/generate-diagram` - Generar diagrama con IA

### Migraciones de Base de Datos

Las migraciones se ejecutan automáticamente en el inicio gracias al comando:
```bash
npx prisma migrate deploy && node dist/server.js
```

### Logs y Monitoreo

Para ver los logs:
1. Ve a tu servicio en Render Dashboard
2. Click en la pestaña "Logs"
3. Verás el output en tiempo real

### Troubleshooting

**Error de conexión a la base de datos:**
- Verifica que la URL de DATABASE_URL esté correcta
- Asegúrate de que la base de datos esté activa

**Error en migraciones:**
- Las migraciones están en `prisma/migrations/`
- Se aplicarán automáticamente con `prisma migrate deploy`

**Puerto no disponible:**
- Render asigna automáticamente el puerto
- La variable `PORT` se usa internamente

### Actualizar el Despliegue

Cualquier push a la rama principal (`main`) activará automáticamente un nuevo deploy si configuraste auto-deploy.

### Conexión desde el Frontend

Actualiza tu frontend para apuntar a:
```javascript
const API_URL = 'https://diagramador-backend.onrender.com';
```

---

## 📝 Notas Adicionales

- El plan Free de Render puede tener un tiempo de inicio lento después de inactividad
- Considera upgradearlo a un plan de pago para mejor rendimiento
- Las credenciales están hardcodeadas en `.env.production` para facilitar el despliegue
- En producción real, usa las variables de entorno de Render en lugar de hardcodear

## ✅ Checklist de Despliegue

- [x] Base de datos PostgreSQL configurada
- [x] Variables de entorno definidas
- [x] Dockerfile de producción creado
- [x] Migraciones configuradas
- [x] Scripts de inicio actualizados
- [ ] Repositorio conectado a Render
- [ ] Servicio web creado en Render
- [ ] Primera compilación exitosa
- [ ] Endpoints verificados
- [ ] Frontend actualizado con nueva URL
