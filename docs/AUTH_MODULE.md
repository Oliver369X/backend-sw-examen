# 🔐 Módulo de Autenticación

## 📋 **Descripción**
Módulo completo de autenticación y gestión de usuarios con JWT, bcrypt y Prisma.

## 🏗️ **Arquitectura**

### **Archivos del Módulo:**
```
src/
├── controllers/authController.ts    # Lógica de autenticación
├── routes/authRoutes.ts            # Rutas de autenticación
├── prisma/schema.prisma            # Modelo Usuario
└── test/auth.test.ts               # Tests del módulo
```

### **Modelo de Datos:**
```prisma
model Usuario {
  id          String    @id @default(uuid()) 
  ci          String?   @unique 
  nombre      String
  apellidos   String?
  correo      String    @unique
  contrasena  String
  salas       UsuarioSala[]  @relation("UsuarioSalaUsuario")
  salasHost   Sala[]         @relation("UsuarioSalas")
}
```

## 🔌 **APIs Disponibles**

### **POST /auth/register**
Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "correo": "usuario@ejemplo.com",
  "contrasena": "password123",
  "nombre": "Juan Pérez"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "uuid-del-usuario",
    "nombre": "Juan Pérez",
    "correo": "usuario@ejemplo.com",
    "ci": null
  }
}
```

**Errores:**
- `400`: Campos faltantes
- `409`: Email ya registrado
- `500`: Error interno

### **POST /auth/login**
Autentica un usuario existente.

**Request Body:**
```json
{
  "correo": "usuario@ejemplo.com",
  "contrasena": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "uuid-del-usuario",
    "nombre": "Juan Pérez",
    "correo": "usuario@ejemplo.com",
    "ci": null
  }
}
```

**Errores:**
- `400`: Campos faltantes
- `401`: Credenciales inválidas
- `500`: Error interno

## 🔒 **Seguridad**

### **JWT Token:**
- **Algoritmo**: HS256
- **Expiración**: 1 hora
- **Payload**: `{ userId, correo }`
- **Secret**: Variable de entorno `JWT_SECRET`

### **Hash de Contraseñas:**
- **Algoritmo**: bcrypt
- **Salt Rounds**: 10
- **Almacenamiento**: Hash en base de datos

### **Validaciones:**
- Email único en sistema
- Contraseña hasheada antes de guardar
- Validación de campos requeridos
- Sanitización de inputs

## 🧪 **Tests**

### **Casos de Prueba:**
1. ✅ Registro exitoso de usuario
2. ✅ Registro con campos faltantes (400)
3. ✅ Registro con email duplicado (409)
4. ✅ Login exitoso
5. ✅ Login con credenciales inválidas (401)
6. ✅ Login con campos faltantes (400)

### **Ejecutar Tests:**
```bash
npm test -- --testPathPattern=auth.test.ts
```

## 📊 **Métricas de Rendimiento**

- **Tiempo de registro**: ~200ms
- **Tiempo de login**: ~150ms
- **Hash bcrypt**: ~100ms
- **Verificación JWT**: ~5ms

## 🔧 **Configuración**

### **Variables de Entorno:**
```env
JWT_SECRET=tu_clave_secreta_muy_segura
DATABASE_URL=postgresql://usuario:password@localhost:5432/database
```

### **Dependencias:**
- `bcryptjs`: Hash de contraseñas
- `jsonwebtoken`: Generación de tokens JWT
- `@prisma/client`: ORM para base de datos

## 🚀 **Uso en Frontend**

### **Registro:**
```javascript
const response = await fetch('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    correo: 'usuario@ejemplo.com',
    contrasena: 'password123',
    nombre: 'Juan Pérez'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.token);
  // Usuario registrado y autenticado
}
```

### **Login:**
```javascript
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    correo: 'usuario@ejemplo.com',
    contrasena: 'password123'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.token);
  // Usuario autenticado
}
```

### **Verificar Token:**
```javascript
const token = localStorage.getItem('token');
if (token) {
  // Usuario autenticado
  // Usar token en headers: Authorization: Bearer ${token}
}
```

## ⚠️ **Limitaciones**

1. **Tokens no renovables**: Expiran en 1 hora
2. **Sin refresh tokens**: Requiere login nuevamente
3. **Sin 2FA**: Solo email/contraseña
4. **Sin validación de email**: No requiere verificación
5. **Sin recuperación de contraseña**: No implementado

## 🔄 **Próximas Mejoras**

- [ ] Refresh tokens
- [ ] Verificación de email
- [ ] Recuperación de contraseña
- [ ] 2FA con TOTP
- [ ] Rate limiting
- [ ] Logs de seguridad

