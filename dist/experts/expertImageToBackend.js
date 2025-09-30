"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expertImageToBackend = void 0;
const expertBase_1 = require("./expertBase");
const generative_ai_1 = require("@google/generative-ai");
exports.expertImageToBackend = (0, expertBase_1.createExpert)({
    name: 'Image to Backend Analyzer',
    systemPrompt: `Eres un experto en analizar imágenes de diagramas UML de clases y convertirlas en estructura JSON precisa.

TAREA:
1. Lee CUIDADOSAMENTE toda la imagen
2. Identifica CADA clase con su nombre exacto
3. Extrae TODOS los atributos (campos/variables) de cada clase
4. Extrae TODOS los métodos (funciones) de cada clase
5. Detecta TODAS las relaciones entre clases
6. Genera JSON estructurado EXACTO

REGLAS DE ANÁLISIS:
📦 CLASES:
- Nombre de clase: Primera línea de cada caja
- Atributos: Líneas con formato "visibilidad nombre: Tipo"
  * Visibilidad: + (public), - (private), # (protected)
  * Ejemplos: "- name: String", "+ age: int", "# email: String"
- Métodos: Líneas con paréntesis "()"
  * Formato: "visibilidad nombre(params): TipoRetorno"
  * Ejemplos: "+ getName(): String", "- setAge(age: int): void"

🔗 RELACIONES:
- Herencia/extends: Flecha con triángulo vacío (────▷)
- Implementación/implements: Flecha punteada (┄┄┄▷) 
- Asociación: Línea simple (────)
- Composición: Diamante relleno (◆────)
- Agregación: Diamante vacío (◇────)

📊 MULTIPLICIDAD:
- Lee los números cerca de las líneas: "1", "*", "0..1", "1..*"
- Coloca multiplicidad en los campos correspondientes

🎯 FORMATO JSON EXACTO:
{
  "classes": [
    {
      "id": "class-person",
      "name": "Person",
      "x": 100,
      "y": 100,
      "width": 250,
      "height": 180,
      "attributes": [
        "- name: String",
        "- age: int",
        "+ email: String"
      ],
      "methods": [
        "+ getName(): String",
        "+ setName(name: String): void",
        "+ getAge(): int",
        "+ setAge(age: int): void"
      ],
      "stereotypes": [],
      "visibility": "public"
    }
  ],
  "interfaces": [
    {
      "id": "interface-enrollable",
      "name": "Enrollable",
      "x": 400,
      "y": 300,
      "width": 200,
      "height": 100,
      "methods": [
        "+ enroll(): boolean",
        "+ withdraw(): boolean"
      ]
    }
  ],
  "relationships": [
    {
      "id": "rel-extends",
      "type": "inheritance",
      "from": "class-student",
      "to": "class-person",
      "fromMultiplicity": "",
      "toMultiplicity": "",
      "label": "extends"
    },
    {
      "id": "rel-implements",
      "type": "realization",
      "from": "class-student",
      "to": "interface-enrollable",
      "label": "implements"
    },
    {
      "id": "rel-enrolls",
      "type": "association",
      "from": "class-student",
      "to": "class-course",
      "fromMultiplicity": "*",
      "toMultiplicity": "*",
      "label": "enrolls in"
    }
  ],
  "notes": [],
  "packages": []
}

IMPORTANTE:
✅ Lee TODO el texto visible en la imagen
✅ Mantén los nombres EXACTOS de clases, atributos y métodos
✅ Separa correctamente atributos (sin paréntesis) de métodos (con paréntesis)
✅ Detecta el tipo de cada relación correctamente
✅ Incluye multiplicidades si están visibles
✅ Si hay interfaces (<<interface>>), créalas en el array "interfaces"
✅ Si hay notas de texto, agrégalas al array "notes"

❌ NO inventes información que no esté en la imagen
❌ NO combines atributos con métodos
❌ NO uses tipos genéricos si el diagrama especifica tipos concretos

RESPONDE ÚNICAMENTE CON JSON VÁLIDO, SIN MARKDOWN NI EXPLICACIONES.`,
    async process(input) {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY no configurada');
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
        // Gemini 2.5 Flash soporta multimodal (visión)
        const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 1,
                maxOutputTokens: 8192,
            }
        });
        try {
            // Preparar la imagen
            const imageParts = [
                {
                    inlineData: {
                        data: input.imageBase64.replace(/^data:image\/\w+;base64,/, ''),
                        mimeType: input.mimeType || 'image/png'
                    }
                }
            ];
            const prompt = `${this.systemPrompt}

Analiza esta imagen de diagrama UML y genera el JSON estructurado:`;
            const result = await model.generateContent([prompt, ...imageParts]);
            const response = result.response;
            let text = response.text();
            console.log('Respuesta de Gemini Vision:', text);
            // Limpiar respuesta
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            // Parsear JSON
            const parsedData = JSON.parse(text);
            // Validar y normalizar (mantener formato string para el canvas)
            const diagramData = {
                classes: parsedData.classes || [],
                interfaces: parsedData.interfaces || [],
                relationships: parsedData.relationships || [],
                notes: parsedData.notes || [],
                packages: parsedData.packages || []
            };
            console.log('📊 Diagrama analizado desde imagen:', {
                classes: diagramData.classes.length,
                relationships: diagramData.relationships.length,
                ejemploAtributos: diagramData.classes[0]?.attributes?.slice(0, 2)
            });
            return {
                diagramData,
                description: `Diagrama analizado: ${diagramData.classes.length} clases, ${diagramData.relationships.length} relaciones`,
                confidence: 0.85
            };
        }
        catch (error) {
            console.error('Error analizando imagen:', error);
            // Fallback: respuesta básica
            return {
                diagramData: {
                    classes: [],
                    interfaces: [],
                    relationships: [],
                    notes: [{
                            id: 'note-1',
                            x: 100,
                            y: 100,
                            width: 200,
                            height: 100,
                            content: 'No se pudo analizar la imagen automáticamente. Por favor, dibuja el diagrama manualmente.'
                        }],
                    packages: []
                },
                description: `Error al analizar imagen: ${error.message}`,
                confidence: 0
            };
        }
    }
});
