"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expertDiagramGenerator = void 0;
const expertBase_1 = require("./expertBase");
const generative_ai_1 = require("@google/generative-ai");
exports.expertDiagramGenerator = (0, expertBase_1.createExpert)({
    name: 'UML Diagram Generator',
    systemPrompt: `Eres un experto en generar diagramas UML de clases a partir de descripciones en lenguaje natural.

Tu tarea es convertir descripciones de texto en un diagrama UML estructurado en formato JSON.

IMPORTANTE:
- Genera SOLO diagramas de clases UML
- Incluye atributos con tipos de datos (String, Integer, Long, Double, Boolean, Date)
- Incluye métodos con parámetros y tipos de retorno
- Usa visibilidad: public (+), private (-), protected (#)
- Formato de atributos: "- nombre: Tipo"
- Formato de métodos: "+ nombreMetodo(param: Tipo): TipoRetorno"
- Crea relaciones lógicas entre clases (herencia, asociación)
- Usa IDs únicos para cada elemento

FORMATO DE SALIDA (JSON):
{
  "classes": [
    {
      "id": "class-1",
      "name": "NombreClase",
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 150,
      "attributes": [
        "- id: Long",
        "- nombre: String",
        "+ email: String"
      ],
      "methods": [
        "+ getNombre(): String",
        "+ setNombre(nombre: String): void",
        "+ validar(): Boolean"
      ],
      "stereotypes": []
    }
  ],
  "interfaces": [],
  "relationships": [
    {
      "id": "rel-1",
      "type": "inheritance",
      "from": "class-2",
      "to": "class-1",
      "fromMultiplicity": "",
      "toMultiplicity": "",
      "label": "",
      "points": []
    }
  ],
  "notes": [],
  "packages": []
}

TIPOS DE RELACIONES:
- "inheritance" - Herencia (A extiende B)
- "association" - Asociación simple
- "composition" - Composición (parte-todo fuerte)
- "aggregation" - Agregación (parte-todo débil)
- "realization" - Realización de interfaz

REGLAS:
1. Genera clases lógicas basadas en el dominio
2. Agrega atributos relevantes con tipos apropiados
3. Incluye métodos getters, setters y de negocio
4. Posiciona clases en X,Y para evitar solapamiento
5. Crea relaciones coherentes

RESPONDE SOLO CON EL JSON, SIN EXPLICACIONES ADICIONALES.`,
    async process(input) {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        if (!GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY no configurada');
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            }
        });
        try {
            const fullPrompt = `${this.systemPrompt}

DESCRIPCIÓN DEL USUARIO:
"${input.prompt}"

Genera el diagrama UML en formato JSON:`;
            const result = await model.generateContent(fullPrompt);
            const response = result.response;
            let text = response.text();
            // Limpiar la respuesta (remover markdown, etc.)
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            // Parsear JSON
            const diagramData = JSON.parse(text);
            // Validar estructura básica
            if (!diagramData.classes) {
                diagramData.classes = [];
            }
            if (!diagramData.interfaces) {
                diagramData.interfaces = [];
            }
            if (!diagramData.relationships) {
                diagramData.relationships = [];
            }
            if (!diagramData.notes) {
                diagramData.notes = [];
            }
            if (!diagramData.packages) {
                diagramData.packages = [];
            }
            console.log('Diagrama generado exitosamente:', {
                classes: diagramData.classes.length,
                relationships: diagramData.relationships.length
            });
            return {
                diagramData,
                explanation: `Diagrama generado con ${diagramData.classes.length} clases y ${diagramData.relationships.length} relaciones.`
            };
        }
        catch (error) {
            console.error('Error generando diagrama:', error);
            throw new Error(`Error al generar diagrama: ${error.message}`);
        }
    }
});
