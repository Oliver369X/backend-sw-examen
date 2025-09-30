# ⚡ QUICK START - DESPLEGAR EN 2 MINUTOS

## 🎯 PASOS RÁPIDOS

### 1️⃣ SUBE TU CÓDIGO
```bash
git add .
git commit -m "Deploy: Backend configurado para producción"
git push origin main
```

### 2️⃣ VE A RENDER
👉 https://dashboard.render.com

### 3️⃣ CREA EL SERVICIO

**Opción A: Con Blueprint (2 clicks)**
- Click "New +" → "Blueprint"
- Selecciona tu repo
- Click "Apply"
- ✅ ¡Listo!

**Opción B: Manual (5 clicks)**
- Click "New +" → "Web Service"
- Selecciona tu repo
- En "Root Directory" pon: `backen_exa1`
- En "Dockerfile Path" pon: `./Dockerfile.prod`
- Click "Create Web Service"
- ✅ ¡Listo!

### 4️⃣ ESPERA 5-10 MINUTOS
Render compilará automáticamente y desplegará.

### 5️⃣ VERIFICA QUE FUNCIONE
Abre en tu navegador:
```
https://[tu-servicio].onrender.com/
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "API Diagramador UML funcionando correctamente",
  ...
}
```

---

## 🔗 TU API ESTARÁ EN:
```
https://diagramador-backend.onrender.com
```
(o el nombre que le hayas puesto)

---

## ⚙️ YA CONFIGURADO

✅ Base de datos PostgreSQL conectada  
✅ Migraciones automáticas  
✅ Variables de entorno hardcodeadas  
✅ CORS habilitado  
✅ Socket.IO configurado  
✅ Health checks listos  

---

## 🎯 ENDPOINTS PRINCIPALES

```
GET  /              → Status general
GET  /health        → Health check
POST /auth/login    → Login
GET  /api/usuarios  → Usuarios
GET  /api/salas     → Salas
POST /api/ai/generate-diagram → Generar con IA
```

---

## 📱 ACTUALIZA TU FRONTEND

En tu frontend, cambia la URL del API:

```javascript
// Antes
const API_URL = 'http://localhost:4000';

// Después
const API_URL = 'https://[tu-servicio].onrender.com';
```

---

## ❓ SI ALGO FALLA

1. **Revisa los logs** en Render Dashboard → Logs
2. **Verifica la base de datos** esté activa
3. **Prueba health check**: `[tu-url]/health`

---

## 📚 MÁS INFO

- Ver **README_DEPLOY.md** para guía completa
- Ver **RESUMEN_DEPLOY.md** para detalles técnicos
- Ver **COMANDOS_RENDER.md** para configuración exacta

---

## ✅ CHECKLIST

- [ ] Código subido a repositorio
- [ ] Servicio creado en Render
- [ ] Build completado (5-10 min)
- [ ] Health check funciona
- [ ] Frontend actualizado con nueva URL
- [ ] ✨ ¡Todo funcionando!

---

**¡ESO ES TODO! 🚀**
