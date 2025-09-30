"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expertUMLToSpringBoot = void 0;
const expertBase_1 = require("./expertBase");
const generative_ai_1 = require("@google/generative-ai");
exports.expertUMLToSpringBoot = (0, expertBase_1.createExpert)({
    name: 'UML to Spring Boot Generator',
    systemPrompt: `Eres un experto desarrollador Java especializado en Spring Boot y JPA. Tu tarea es convertir un diagrama UML de clases en código Spring Boot completo y funcional.

**Instrucciones Clave:**
1. **Entrada:** Recibirás un diagrama UML con clases, atributos y relaciones.
2. **Salida:** Debes generar código Java para Spring Boot incluyendo:
   - Entidades JPA (@Entity)
   - Repositorios (@Repository)
   - Servicios (@Service)
   - Controladores REST (@RestController)
   - Configuración básica (application.properties)
   - Archivo pom.xml

**Mapeo de Relaciones UML a JPA:**
- **association/one-to-many**: @OneToMany y @ManyToOne
- **association/one-to-one**: @OneToOne
- **association/many-to-many**: @ManyToMany
- **inheritance**: @Inheritance(strategy = InheritanceType.JOINED)
- **composition**: @OneToOne con cascade = CascadeType.ALL
- **aggregation**: @ManyToOne o @OneToMany sin cascade

**Convenciones de Código:**
- Usar anotaciones JPA apropiadas (@Entity, @Id, @GeneratedValue, @Column, etc.)
- Nombres de tablas en snake_case
- Atributos privados con getters/setters
- Constructor sin argumentos (requerido por JPA)
- Manejo de relaciones bidireccionales
- Validaciones básicas (@NotNull, @NotBlank, etc.)

**Estructura del Proyecto:**
src/main/java/com/example/
├── entity/
├── repository/
├── service/
├── controller/
└── config/

**Ejemplo de Entidad:**
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    @NotBlank
    private String email;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Post> posts = new ArrayList<>();
    
    // Constructors, getters, setters...
}

**Configuración de Base de Datos:**
- Usar H2 para desarrollo por defecto
- Incluir configuración para PostgreSQL/MySQL
- Habilitar JPA auto-ddl para desarrollo

Genera código limpio, funcional y siguiendo las mejores prácticas de Spring Boot.`,
    async process(input) {
        const { umlDiagram, config } = input;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            console.error('ERROR: Gemini API key no configurada');
            throw new Error('Gemini API key no configurada');
        }
        if (!umlDiagram || !umlDiagram.classes || umlDiagram.classes.length === 0) {
            console.error('ERROR: El diagrama UML no tiene clases válidas.');
            return { error: "El diagrama UML proporcionado no tiene clases válidas." };
        }
        try {
            const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
            const generationConfig = {
                temperature: 0.3,
                maxOutputTokens: 8192,
            };
            const safetySettings = [
                { category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE },
                { category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE },
                { category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE },
                { category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE },
            ];
            const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';
            console.log(`expertUMLToSpringBoot: Usando el modelo Gemini: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName, generationConfig, safetySettings });
            // Preparar el prompt con el diagrama UML y configuración
            const prompt = `${this.systemPrompt}

**DIAGRAMA UML:**
${JSON.stringify(umlDiagram, null, 2)}

**CONFIGURACIÓN:**
${JSON.stringify(config || {}, null, 2)}

Genera el proyecto Spring Boot completo. Devuelve solo el código Java, archivos de configuración y pom.xml sin explicaciones adicionales.`;
            const result = await model.generateContent(prompt);
            const response = result.response;
            let generatedCode = response.text();
            console.log('Código Spring Boot generado por Gemini');
            // Limpiar el código generado
            generatedCode = generatedCode.replace(/^```java\s*([\s\S]*?)\s*```$/gm, '$1').trim();
            generatedCode = generatedCode.replace(/^```\s*([\s\S]*?)\s*```$/gm, '$1').trim();
            if (!generatedCode) {
                return { error: "Gemini no generó código Spring Boot válido." };
            }
            return { springBootCode: generatedCode };
        }
        catch (error) {
            console.error('Error al generar código Spring Boot con Gemini:', error);
            return { error: `Error interno al generar código Spring Boot: ${error.message || error}` };
        }
    }
});
