# Backend SW Examen (TypeScript + Express + Prisma)

## Descripción
Backend para el proyecto SWFrontEndExamen2-master, desarrollado en TypeScript usando Express y Prisma ORM con PostgreSQL. Este backend se enfoca en la gestión de usuarios, salas y la colaboración en tiempo real, con énfasis en la autenticación y el registro simplificado de usuarios.

## Estructura de Carpetas
```
backen/
├── prisma/           # Esquema de Prisma (schema.prisma)
├── src/
│   ├── controllers/  # Lógica de negocio (controladores)
│   ├── routes/       # Definición de rutas
│   ├── prisma.ts     # Conexión a Prisma Client
│   ├── app.ts        # Configuración de Express
│   └── server.ts     # Inicio del servidor
├── package.json      # Dependencias y scripts
├── tsconfig.json     # Configuración de TypeScript
└── README.md         # Documentación
```

## Instalación y Uso
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Configura la base de datos en `.env`:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/tu_basededatos"
   ```
3. Genera el cliente de Prisma y ejecuta migraciones:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Ejecuta el servidor en desarrollo:
   ```bash
   npm run dev
   ```

## Endpoints principales
- **Usuarios:** `/api/usuarios`
  - `GET /`  → Lista todos los usuarios
  - `POST /` → Crea un usuario (el registro inicial solo requiere correo y contraseña, sin `ci` ni `telefono`)
- **Autenticación:**
  - `POST /auth/login` → Inicio de sesión de usuarios.
  - `POST /auth/register` → Registro de nuevos usuarios.
- **Salas:** `/api/salas`
  - `GET /`  → Lista todas las salas
  - `POST /` → Crea una sala

## Notas
- El modelo de datos está definido en `prisma/schema.prisma`.
- El backend está listo para integrar sockets (`socket.io`) en el futuro.
- Para producción, compila con `npm run build` y ejecuta con `npm start`.

## Expertos de IA (`src/experts/`)

Este backend incluye un sistema de "expertos" basados en IA (actualmente usando Gemini de Google) para realizar tareas complejas de generación y transformación de código.

### 1. `expertGrapesToFlutter.ts`
- **Propósito**: Convierte una estructura de componentes JSON de GrapesJS en código Dart para un widget de Flutter.
- **Entrada**:
    - `grapesJsonString`: String JSON que representa el diseño de una página de GrapesJS.
    - `imagePrompt` (opcional): Un objeto con `mimeType` y `data` (imagen en base64) que puede ser usado por el modelo multimodal como referencia visual para la generación del UI.
- **Salida**: Código Dart para un widget de Flutter.
- **Características**:
    - Mapea componentes HTML y CSS a widgets y estilos de Flutter.
    - Intenta mantener la fidelidad visual con el diseño original de GrapesJS y la imagen de referencia (si se proporciona).
    - **Generación de Nombres de Widget Dinámicos**: Se espera que el modelo genere nombres de clase de widget descriptivos y únicos (ej. `HomePageWidget`, `ProductDetailWidget`) basados en el contenido del JSON, en lugar de nombres genéricos.
    - El modelo de IA subyacente es configurable mediante la variable de entorno `GEMINI_FLUTTER_MODEL` (por defecto `gemini-1.5-flash-latest`).

### 2. `expertFlutterAppGen.ts`
- **Propósito**: Genera una aplicación Flutter completa (estructura de proyecto y archivos) a partir de múltiples diseños de página de GrapesJS.
- **Entrada**: Un objeto con:
    - `pages`: Un array de objetos `GrapesPage`, donde cada objeto contiene:
        - `name`: Nombre de la página (ej: "HomePage"). Este nombre se usa para generar el nombre del archivo (`.dart`) y el nombre del widget (ej. `HomePageWidget`).
        - `json`: El JSON string de GrapesJS para esa página.
    - `disableImageReview` (opcional, booleano): Si es `true`, se omite la revisión y el comentario automático de widgets de imagen en el código generado para las páginas. Por defecto es `false` (la revisión está activa).
- **Salida**: Un buffer conteniendo un archivo ZIP con el proyecto Flutter generado.
- **Características**:
    - Utiliza `expertGrapesToFlutter` para generar el código Dart de cada página individual. El nombre del widget generado por `expertGrapesToFlutter` debe coincidir con el esperado por `expertFlutterAppGen` (basado en `page.name`).
    - **Revisión de Código de Página (Opcional)**:
        - Por defecto (`disableImageReview: false`), comenta automáticamente el uso de widgets de imagen (`Image.network`, `Image.asset`, etc.) en el código generado para cada página, añadiendo un `TODO` para que el desarrollador revise y habilite manualmente la gestión de imágenes.
        - Si `disableImageReview: true`, este paso de revisión se omite.
    - Copia una plantilla base de proyecto Flutter.
    - Crea archivos `.dart` para cada página en un directorio `lib/pages/`.
    - **Navegación mejorada**:
        - Actualiza `lib/main.dart` para incluir importaciones de todas las páginas generadas.
        - Configura un sistema de rutas nombradas en `MaterialApp`. La primera página en la lista de entrada se establece como la ruta inicial (`/`).
        - La pantalla de inicio (`MyHomePage`) muestra botones para navegar a cada página generada usando `Navigator.pushNamed`.
    - Empaqueta la aplicación completa en un archivo ZIP.

### 3. `expertAuditor.ts`
- **Propósito**: Audita código TypeScript/JavaScript y Flutter/Dart para detectar errores, problemas de seguridad y oportunidades de mejora.
- **Entrada**: Un objeto con:
    - `code`: String con el código a auditar.
    - `context` (opcional): String con contexto adicional sobre el código.
    - `focusAreas` (opcional): Array de strings con áreas específicas a revisar (ej: ['seguridad', 'rendimiento', 'tipos TypeScript', 'errores Flutter']).
- **Salida**: String con un análisis estructurado del código.
- **Características**:
    - **Análisis completo**: Detecta errores críticos, advertencias, problemas de seguridad y rendimiento.
    - **Detección específica de errores Flutter**: Identifica errores comunes como:
        - Tipos nullable (Color? vs Color)
        - Parámetros requeridos faltantes
        - Estructura incorrecta de widgets
        - Imports faltantes
        - Incompatibilidades de tipos
        - Problemas con constructores const
    - **Correcciones automáticas**: Proporciona código corregido para errores específicos de Flutter.
    - **Áreas de enfoque**: Permite especificar áreas específicas para el análisis (seguridad, rendimiento, manejo de errores, errores Flutter, etc.).
    - **Formato estructurado**: Proporciona un análisis organizado con:
        - Resumen ejecutivo
        - Problemas críticos
        - Advertencias
        - Sugerencias de mejora
        - Problemas de seguridad
        - Problemas de rendimiento
        - Correcciones automáticas (nuevo)
        - Recomendaciones prioritarias
    - **Integración con IA**: Utiliza Gemini para proporcionar análisis inteligente y contextual del código.
    - **Corrección de errores comunes**: Automáticamente corrige errores como `Colors.grey[500]` → `Colors.grey[500]!` para resolver problemas de tipos nullable.


