# 📝 COMANDOS Y CONFIGURACIÓN EXACTA PARA RENDER

## 🎯 CONFIGURACIÓN EXACTA DEL SERVICIO

### En Render Dashboard:

#### 1. General
```
Name: diagramador-backend
Region: Oregon (o el más cercano a ti)
Branch: main
```

#### 2. Build & Deploy
```
Root Directory: backen_exa1
Runtime: Docker
Dockerfile Path: ./Dockerfile.prod
Docker Build Context Directory: .
```

#### 3. Plan
```
Instance Type: Free (o Starter si quieres mejor rendimiento)
```

#### 4. Environment Variables (OPCIONAL - ya están en Dockerfile)
Si quieres sobrescribir:
```
DATABASE_URL = postgresql://diagramador_108y_user:q4gNGN2VXK13CS7UVM6pRarxSzClGubc@dpg-d3ds3dodl3ps73c5guj0-a/diagramador_108y
PORT = 4000
NODE_ENV = production
JWT_SECRET = tu_clave_secreta_super_segura_2024
GEMINI_API_KEY = AIzaSyBzVhU-30JcNgJu0Xy5JkdKBGICbMUtbng
```

---

## 🏗️ LO QUE HACE EL DOCKERFILE

1. **Build Stage:**
   - Instala Node.js 18
   - Copia dependencias y código
   - Compila TypeScript a JavaScript
   - Genera cliente de Prisma

2. **Production Stage:**
   - Copia solo archivos necesarios
   - Configura variables de entorno
   - Ejecuta migraciones de Prisma
   - Inicia el servidor

---

## 🔗 URL RESULTANTE

Después del deploy, tu backend estará en:
```
https://diagramador-backend.onrender.com
```

O el nombre que le hayas puesto:
```
https://[TU-NOMBRE].onrender.com
```

---

## 📋 CHECKLIST DE DEPLOY

- [ ] Subir cambios a GitHub/GitLab
- [ ] Ir a Render Dashboard
- [ ] Crear nuevo Web Service
- [ ] Configurar según arriba
- [ ] Esperar a que compile (5-10 min primera vez)
- [ ] Verificar logs para confirmar éxito
- [ ] Probar endpoints
- [ ] Actualizar frontend con nueva URL

---

## 🎬 COMANDOS QUE SE EJECUTAN

Durante el deploy:
```bash
# Build
npm ci
npx prisma generate
npm run build

# Start
npx prisma migrate deploy
node dist/server.js
```

---

## ✅ VERIFICACIÓN RÁPIDA

Después del deploy, ejecuta:

```bash
# Windows PowerShell
Invoke-WebRequest -Uri https://diagramador-backend.onrender.com/api/usuarios

# Linux/Mac/Git Bash
curl https://diagramador-backend.onrender.com/api/usuarios
```

Si ves datos o un array vacío `[]`, ¡funciona! 🎉
