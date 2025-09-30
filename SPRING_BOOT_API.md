# API para Generación de Spring Boot desde UML

Este documento describe los nuevos endpoints agregados al backend para generar código Spring Boot a partir de diagramas UML.

## Nuevos Endpoints

### 1. Generar Código Spring Boot Individual
**POST** `/api/ai/uml-to-springboot`

Genera código Java para Spring Boot a partir de un diagrama UML.

**Body:**
```json
{
  "umlDiagram": {
    "classes": [
      {
        "id": "user_001",
        "name": "User",
        "attributes": [
          {
            "name": "id",
            "type": "Long",
            "visibility": "private",
            "isRequired": true
          },
          {
            "name": "email",
            "type": "String",
            "visibility": "private",
            "isRequired": true
          }
        ],
        "methods": [
          {
            "name": "getEmail",
            "returnType": "String",
            "parameters": [],
            "visibility": "public"
          }
        ],
        "position": { "x": 100, "y": 100 }
      }
    ],
    "relationships": [
      {
        "id": "rel_001",
        "type": "one-to-many",
        "sourceClassId": "user_001",
        "targetClassId": "post_001",
        "cardinality": "1:N",
        "name": "authored"
      }
    ],
    "metadata": {
      "projectName": "BlogApp",
      "packageName": "com.example.blog",
      "version": "1.0.0"
    }
  },
  "config": {
    "packageName": "com.example.blog",
    "projectName": "BlogApp",
    "databaseType": "h2",
    "includeSwagger": true,
    "includeSecurity": false
  }
}
```

**Response:**
```json
{
  "springBootCode": "package com.example.blog;\n\n@Entity\n@Table(name = \"users\")\npublic class User {\n    // ... código generado\n}"
}
```

### 2. Generar Aplicación Spring Boot Completa (ZIP)
**POST** `/api/ai/springboot-app-zip`

Genera un proyecto Spring Boot completo empaquetado en un archivo ZIP.

**Body:** Mismo que el endpoint anterior.

**Response:** Archivo ZIP descargable con la estructura completa del proyecto Maven.

## Estructura del Diagrama UML

### Clases
```typescript
interface UMLClass {
  id: string;                    // ID único de la clase
  name: string;                  // Nombre de la clase
  attributes: UMLAttribute[];    // Lista de atributos
  methods?: UMLMethod[];         // Lista de métodos (opcional)
  position?: { x: number; y: number }; // Posición en el diagrama
  stereotype?: string;           // Estereotipo UML (opcional)
}
```

### Atributos
```typescript
interface UMLAttribute {
  name: string;                  // Nombre del atributo
  type: string;                  // Tipo de dato (String, Long, Integer, etc.)
  visibility: 'private' | 'public' | 'protected';
  isRequired?: boolean;          // Si es requerido (para validaciones)
  defaultValue?: string;         // Valor por defecto
}
```

### Métodos
```typescript
interface UMLMethod {
  name: string;                  // Nombre del método
  returnType: string;            // Tipo de retorno
  parameters: UMLParameter[];    // Lista de parámetros
  visibility: 'private' | 'public' | 'protected';
}
```

### Relaciones
```typescript
interface UMLRelationship {
  id: string;                    // ID único de la relación
  type: 'association' | 'inheritance' | 'composition' | 'aggregation' | 
        'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  sourceClassId: string;         // ID de la clase origen
  targetClassId: string;         // ID de la clase destino
  cardinality?: '1:1' | '1:N' | 'N:1' | 'N:M'; // Cardinalidad
  name?: string;                 // Nombre de la relación
}
```

## Configuración de Generación

```typescript
interface GenerationConfig {
  packageName?: string;          // Paquete Java (ej: com.example.app)
  projectName?: string;          // Nombre del proyecto
  databaseType?: 'h2' | 'postgresql' | 'mysql'; // Tipo de base de datos
  includeSwagger?: boolean;      // Incluir documentación Swagger
  includeSecurity?: boolean;     // Incluir Spring Security
}
```

## Tipos de Datos Soportados

Los siguientes tipos UML se mapean automáticamente a tipos Java:

| Tipo UML | Tipo Java |
|----------|-----------|
| String   | String    |
| Integer  | Integer   |
| Long     | Long      |
| Double   | Double    |
| Float    | Float     |
| Boolean  | Boolean   |
| Date     | LocalDateTime |
| BigDecimal | BigDecimal |

## Mapeo de Relaciones a JPA

| Relación UML | Anotación JPA |
|--------------|---------------|
| one-to-one   | @OneToOne     |
| one-to-many  | @OneToMany / @ManyToOne |
| many-to-many | @ManyToMany   |
| inheritance  | @Inheritance  |
| composition  | @OneToOne con cascade |
| aggregation  | @ManyToOne sin cascade |

## Estructura del Proyecto Generado

```
project-name/
├── pom.xml
├── src/main/java/com/example/
│   ├── Application.java          # Clase principal
│   ├── entity/
│   │   ├── User.java            # Entidades JPA
│   │   └── Post.java
│   ├── repository/
│   │   ├── UserRepository.java  # Repositorios
│   │   └── PostRepository.java
│   ├── service/
│   │   ├── UserService.java     # Servicios
│   │   └── PostService.java
│   └── controller/
│       ├── UserController.java  # Controladores REST
│       └── PostController.java
└── src/main/resources/
    └── application.properties   # Configuración
```

## Ejemplo de Uso desde Frontend

```javascript
// Ejemplo de llamada desde el frontend
const generateSpringBoot = async (umlDiagram) => {
  try {
    const response = await fetch('/api/ai/springboot-app-zip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        umlDiagram,
        config: {
          packageName: 'com.example.blog',
          projectName: 'BlogApp',
          databaseType: 'h2',
          includeSwagger: true
        }
      })
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blog-app.zip';
      a.click();
    }
  } catch (error) {
    console.error('Error generating Spring Boot app:', error);
  }
};
```

## Notas de Desarrollo

- El sistema usa Gemini AI para generar el código Java
- Se incluye validación automática del diagrama UML
- El código generado sigue las mejores prácticas de Spring Boot
- Se incluye configuración automática de base de datos H2 para desarrollo
- Las relaciones bidireccionales se manejan automáticamente
- Se incluyen validaciones JPA básicas (@NotNull, @NotBlank, etc.)

