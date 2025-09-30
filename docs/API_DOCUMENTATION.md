# 📚 Documentación de APIs

## 🌐 **Base URL**
```
http://localhost:4000
```

## 🔐 **Autenticación**
Todas las APIs requieren token JWT en el header:
```
Authorization: Bearer <token>
```

## 📋 **Índice de APIs**

### **🔐 Autenticación**
- [POST /auth/register](#post-authregister)
- [POST /auth/login](#post-authlogin)

### **👥 Usuarios**
- [GET /api/usuarios](#get-apiusuarios)
- [POST /api/usuarios](#post-apiusuarios)

### **🏠 Salas Colaborativas**
- [GET /api/salas](#get-apisalas)
- [POST /api/salas](#post-apisalas)
- [GET /api/salas/:idSala](#get-apisalasidsala)
- [PUT /api/salas/:idSala](#put-apisalasidsala)
- [GET /api/salas/:idSala/usuarios](#get-apisalasidsalausuarios)
- [GET /api/salas/:idSala/host/:idUsuario](#get-apisalasidsalahostidusuario)

### **🤖 IA y Generación**
- [POST /api/ai](#post-apiai)
- [POST /api/ai/audit-code](#post-apiaiaudit-code)
- [POST /api/ai/uml-to-springboot](#post-apiaiuml-to-springboot)
- [POST /api/ai/springboot-template-zip](#post-apiaispringboot-template-zip)

---

## 🔐 **Autenticación**

### **POST /auth/register**
Registra un nuevo usuario en el sistema.

**Request:**
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

**Request:**
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

---

## 👥 **Usuarios**

### **GET /api/usuarios**
Obtiene todos los usuarios del sistema.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid-del-usuario",
    "ci": "12345678",
    "nombre": "Juan Pérez",
    "apellidos": "García",
    "correo": "juan@ejemplo.com"
  }
]
```

### **POST /api/usuarios**
Crea un nuevo usuario (admin only).

**Request:**
```json
{
  "ci": "87654321",
  "nombre": "María",
  "apellidos": "López",
  "correo": "maria@ejemplo.com",
  "contrasena": "password123"
}
```

**Response (201):**
```json
{
  "id": "uuid-del-usuario",
  "ci": "87654321",
  "nombre": "María",
  "apellidos": "López",
  "correo": "maria@ejemplo.com"
}
```

---

## 🏠 **Salas Colaborativas**

### **GET /api/salas**
Obtiene todas las salas con información de host y usuarios.

**Response (200):**
```json
[
  {
    "id": "sala-uuid",
    "nombre": "Proyecto E-commerce",
    "capacidad": 10,
    "descripcion": "Diagrama de clases para tienda online",
    "esPrivada": false,
    "diagrama": {
      "nodes": [/* nodos del diagrama */],
      "edges": [/* conexiones del diagrama */]
    },
    "host": {
      "id": "user-uuid",
      "ci": "12345678",
      "nombre": "Juan Pérez",
      "correo": "juan@ejemplo.com"
    },
    "usuarios": [
      {
        "usuario": {
          "id": "user-uuid",
          "ci": "87654321",
          "nombre": "María García",
          "correo": "maria@ejemplo.com"
        }
      }
    ]
  }
]
```

### **POST /api/salas**
Crea una nueva sala colaborativa.

**Request:**
```json
{
  "nombre": "Mi Proyecto",
  "capacidad": 5,
  "descripcion": "Diagrama de clases",
  "esPrivada": false,
  "idHost": "user-uuid"
}
```

**Response (201):**
```json
{
  "id": "sala-uuid",
  "nombre": "Mi Proyecto",
  "capacidad": 5,
  "descripcion": "Diagrama de clases",
  "esPrivada": false,
  "diagrama": null,
  "idHost": "user-uuid"
}
```

### **GET /api/salas/:idSala**
Obtiene una sala específica por ID.

**Response (200):**
```json
{
  "id": "sala-uuid",
  "nombre": "Mi Proyecto",
  "capacidad": 5,
  "descripcion": "Diagrama de clases",
  "esPrivada": false,
  "diagrama": {
    "nodes": [/* nodos del diagrama */],
    "edges": [/* conexiones del diagrama */]
  },
  "idHost": "user-uuid"
}
```

### **PUT /api/salas/:idSala**
Actualiza el diagrama de una sala.

**Request:**
```json
{
  "data": {
    "nodes": [
      {
        "id": "node-1",
        "type": "class",
        "name": "User",
        "attributes": [
          {"name": "id", "type": "Long"},
          {"name": "email", "type": "String"}
        ]
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "node-1",
        "target": "node-2",
        "type": "association"
      }
    ]
  }
}
```

**Response (200):**
```json
{
  "id": "sala-uuid",
  "nombre": "Mi Proyecto",
  "capacidad": 5,
  "descripcion": "Diagrama de clases",
  "esPrivada": false,
  "diagrama": {
    "nodes": [/* nodos actualizados */],
    "edges": [/* conexiones actualizadas */]
  },
  "idHost": "user-uuid"
}
```

### **GET /api/salas/:idSala/usuarios**
Obtiene usuarios en una sala específica.

**Response (200):**
```json
[
  {
    "idUsuario": "user-uuid",
    "ciUsuario": "12345678",
    "nombreUsuario": "Juan Pérez",
    "correoUsuario": "juan@ejemplo.com",
    "rol": "host"
  }
]
```

### **GET /api/salas/:idSala/host/:idUsuario**
Verifica si un usuario es host de la sala.

**Response (200):**
```json
{
  "ishost": true
}
```

---

## 🤖 **IA y Generación**

### **POST /api/ai**
Genera contenido usando IA (Gemini).

**Request:**
```json
{
  "prompt": "Escribe un párrafo sobre la importancia de la colaboración en proyectos de software."
}
```

**Response (200):**
```json
{
  "generatedText": "La colaboración en proyectos de software es fundamental para el éxito..."
}
```

**Errores:**
- `400`: Prompt faltante
- `500`: Error de IA

### **APIs de Flutter y GrapesJS eliminadas - solo Spring Boot**

### **POST /api/ai/audit-code**
Audita código para detectar problemas y sugerir mejoras.

**Request:**
```json
{
  "code": "function processData(data) {\n  if (!data) return null;\n  return data.map(item => item.value);\n}",
  "context": "Función para procesar datos",
  "focusAreas": ["seguridad", "tipos TypeScript"]
}
```

**Response (200):**
```json
{
  "auditResult": "ANÁLISIS DE CÓDIGO\n\nPROBLEMAS DETECTADOS:\n1. Falta validación de tipos\n2. No hay manejo de errores\n\nSUGERENCIAS:\n1. Agregar tipos TypeScript\n2. Implementar try-catch"
}
```

### **POST /api/ai/uml-to-springboot**
Genera código Spring Boot desde diagrama UML (con IA).

**Request:**
```json
{
  "umlDiagram": {
    "classes": [
      {
        "id": "class-1",
        "name": "User",
        "attributes": [
          {"name": "id", "type": "Long", "isRequired": true},
          {"name": "email", "type": "String", "isRequired": true}
        ]
      }
    ],
    "relationships": []
  },
  "config": {
    "packageName": "com.example.app"
  }
}
```

**Response (200):**
```json
{
  "springBootCode": "package com.example.app;\n\n@Entity\npublic class User {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    \n    @Column(nullable = false)\n    private String email;\n    \n    // getters, setters, constructors\n}"
}
```

### **POST /api/ai/springboot-template-zip**
Genera aplicación Spring Boot completa como ZIP (con plantillas).

**Request:**
```json
{
  "umlDiagram": {
    "classes": [
      {
        "id": "class-1",
        "name": "User",
        "attributes": [
          {"name": "id", "type": "Long", "isRequired": true},
          {"name": "email", "type": "String", "isRequired": true},
          {"name": "password", "type": "String", "isRequired": true}
        ]
      },
      {
        "id": "class-2",
        "name": "Product",
        "attributes": [
          {"name": "id", "type": "Long", "isRequired": true},
          {"name": "name", "type": "String", "isRequired": true},
          {"name": "price", "type": "BigDecimal", "isRequired": true}
        ]
      }
    ],
    "relationships": [
      {
        "type": "one-to-many",
        "sourceClass": "User",
        "targetClass": "Product"
      }
    ],
    "metadata": {
      "projectName": "EcommerceApp",
      "packageName": "com.ecommerce.app"
    }
  },
  "config": {
    "databaseType": "h2",
    "includeSecurity": true,
    "includeCache": true,
    "includeTests": true
  }
}
```

**Response:**
- **Content-Type**: `application/zip`
- **Content-Disposition**: `attachment; filename=EcommerceApp_template_1234567890.zip`
- **Body**: Archivo ZIP binario

---

## 🔌 **Socket.IO Events**

### **Conexión:**
```javascript
const socket = io('http://localhost:4000');
```

### **Eventos del Cliente:**

#### **join-room**
```javascript
socket.emit('join-room', 'sala-uuid');
```

#### **leave-room**
```javascript
socket.emit('leave-room', 'sala-uuid');
```

#### **diagram-update**
```javascript
socket.emit('diagram-update', {
  nodes: [/* nodos del diagrama */],
  edges: [/* conexiones del diagrama */],
  userInfo: {
    userName: 'Juan Pérez',
    userId: 'user-uuid'
  }
}, 'sala-uuid');
```

#### **user-update**
```javascript
socket.emit('user-update', {
  userId: 'user-uuid',
  userName: 'Juan Pérez',
  status: 'editing',
  cursor: { x: 100, y: 200 }
}, 'sala-uuid');
```

#### **requestPageData**
```javascript
socket.emit('requestPageData', 'sala-uuid', socket.id);
```

### **Eventos del Servidor:**

#### **user-joined**
```javascript
socket.on('user-joined', (data) => {
  console.log(data.message); // "Usuario socket-id se ha unido."
});
```

#### **user-left**
```javascript
socket.on('user-left', (data) => {
  console.log(data.message); // "Usuario socket-id ha salido."
});
```

#### **diagram-update**
```javascript
socket.on('diagram-update', (data) => {
  // Actualizar diagrama en la UI
  updateDiagram(data);
});
```

#### **user-update**
```javascript
socket.on('user-update', (data) => {
  // Actualizar estado de usuarios en la UI
  updateUserStatus(data);
});
```

#### **diagram-loaded**
```javascript
socket.on('diagram-loaded', (diagramData) => {
  // Cargar diagrama existente al unirse a la sala
  loadExistingDiagram(diagramData);
});
```

---

## 📊 **Códigos de Estado HTTP**

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: email duplicado) |
| 429 | Too Many Requests - Límite de rate |
| 500 | Internal Server Error - Error del servidor |

---

## 🧪 **Colección de Postman**

### **Importar Colección:**
```json
{
  "info": {
    "name": "Backend API",
    "description": "Colección completa de APIs del backend"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"correo\": \"test@ejemplo.com\",\n  \"contrasena\": \"password123\",\n  \"nombre\": \"Usuario Test\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"correo\": \"test@ejemplo.com\",\n  \"contrasena\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4000"
    }
  ]
}
```

---

## 🔧 **Variables de Entorno**

```env
# Base de datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/database

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura

# IA
GEMINI_API_KEY=tu_clave_de_gemini
GEMINI_MODEL=gemini-1.5-flash-latest

# Servidor
PORT=4000
NODE_ENV=development
```

---

## 🚀 **Ejemplos de Uso**

### **JavaScript/Fetch:**
```javascript
// Login
const loginResponse = await fetch('http://localhost:4000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    correo: 'usuario@ejemplo.com',
    contrasena: 'password123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.token;

// Crear sala
const salaResponse = await fetch('http://localhost:4000/api/salas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    nombre: 'Mi Proyecto',
    capacidad: 5,
    descripcion: 'Diagrama de clases',
    esPrivada: false,
    idHost: loginData.data.id
  })
});

const sala = await salaResponse.json();
```

### **Axios:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000'
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (correo, contrasena) => {
  const response = await api.post('/auth/login', { correo, contrasena });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

// Crear sala
const createSala = async (salaData) => {
  const response = await api.post('/api/salas', salaData);
  return response.data;
};
```

### **React Hook:**
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const useAPI = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (correo, contrasena) => {
    const response = await axios.post('/auth/login', { correo, contrasena });
    setToken(response.data.token);
    localStorage.setItem('token', response.data.token);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return { login, logout, token };
};
```
