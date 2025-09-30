"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expertDiagramEditor = void 0;
const expertBase_1 = require("./expertBase");
const generative_ai_1 = require("@google/generative-ai");
exports.expertDiagramEditor = (0, expertBase_1.createExpert)({
    name: 'Diagram Editor AI',
    systemPrompt: `Eres un experto en EDITAR y MODIFICAR diagramas UML de clases.

Tu trabajo es:
1. ANALIZAR el diagrama actual
2. INTERPRETAR la instrucción del usuario
3. MODIFICAR el diagrama según lo solicitado
4. DEVOLVER el diagrama actualizado

CAPACIDADES:
✅ Agregar nuevas clases, interfaces, relaciones
✅ Modificar clases existentes (atributos, métodos)
✅ Eliminar elementos del diagrama
✅ Reorganizar y mejorar el diseño
✅ Refactorizar el modelo de datos
✅ Agregar patrones de diseño
✅ Optimizar relaciones entre clases

FORMATO DE ATRIBUTOS:
- "- nombreAtributo: TipoNombre"
- Tipos válidos: String, Integer, Long, Double, Boolean, Date, List<Tipo>
- Visibilidad: + (public), - (private), # (protected)

FORMATO DE MÉTODOS:
- "+ nombreMetodo(param: Tipo): TipoRetorno"
- Ejemplo: "+ calcularTotal(): Double"

TIPOS DE RELACIONES:
- "inheritance" - Herencia (extends)
- "association" - Asociación simple
- "composition" - Composición (parte-todo fuerte)
- "aggregation" - Agregación (parte-todo débil)
- "realization" - Realización de interfaz

INSTRUCCIONES COMUNES:
- "Agrega una clase Usuario" → Crear nueva clase
- "Elimina la clase X" → Remover clase y sus relaciones
- "Agrega atributo email a Usuario" → Modificar clase existente
- "Crea relación entre A y B" → Agregar relación
- "Refactoriza el diagrama" → Mejorar estructura completa

REGLAS IMPORTANTES:
1. PRESERVA los IDs de elementos existentes que NO se modifican
2. GENERA nuevos IDs únicos para elementos nuevos (formato: "class-{timestamp}")
3. Al eliminar elementos, ELIMINA también sus relaciones
4. Al modificar, MANTÉN la estructura de coordenadas X,Y si no se solicita reposicionamiento
5. Si la instrucción no es clara, HAZ la mejor interpretación posible

RESPUESTA EN FORMATO JSON:
{
  "modifiedDiagram": {
    "classes": [...],
    "interfaces": [...],
    "relationships": [...],
    "notes": [...],
    "packages": [...]
  },
  "changes": {
    "added": ["descripción de elementos agregados"],
    "modified": ["descripción de elementos modificados"],
    "removed": ["descripción de elementos eliminados"]
  },
  "explanation": "Explicación clara de los cambios realizados",
  "success": true
}

IMPORTANTE: Responde SOLO con JSON válido, sin markdown ni explicaciones adicionales.`,
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
            // Serializar el diagrama actual
            const currentDiagramStr = JSON.stringify(input.currentDiagram, null, 2);
            // Información de contexto
            const contextInfo = input.context?.selectedElements?.length
                ? `\nELEMENTOS SELECCIONADOS: ${input.context.selectedElements.join(', ')}`
                : '';
            const fullPrompt = `${this.systemPrompt}

DIAGRAMA ACTUAL:
${currentDiagramStr}
${contextInfo}

INSTRUCCIÓN DEL USUARIO:
"${input.instruction}"

Modifica el diagrama según la instrucción y responde en JSON:`;
            const result = await model.generateContent(fullPrompt);
            const response = result.response;
            let text = response.text();
            // Limpiar la respuesta
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            // Parsear JSON
            const aiResponse = JSON.parse(text);
            // Validar estructura
            if (!aiResponse.modifiedDiagram) {
                throw new Error('Respuesta inválida: falta modifiedDiagram');
            }
            // Asegurar estructura completa
            const modifiedDiagram = {
                classes: aiResponse.modifiedDiagram.classes || input.currentDiagram.classes,
                interfaces: aiResponse.modifiedDiagram.interfaces || input.currentDiagram.interfaces,
                relationships: aiResponse.modifiedDiagram.relationships || input.currentDiagram.relationships,
                notes: aiResponse.modifiedDiagram.notes || input.currentDiagram.notes,
                packages: aiResponse.modifiedDiagram.packages || input.currentDiagram.packages,
            };
            console.log('Diagrama editado exitosamente:', {
                classesAntes: input.currentDiagram.classes.length,
                classesDespues: modifiedDiagram.classes.length,
                cambios: aiResponse.changes
            });
            return {
                modifiedDiagram,
                changes: aiResponse.changes || { added: [], modified: [], removed: [] },
                explanation: aiResponse.explanation || 'Diagrama modificado según la instrucción.',
                success: true
            };
        }
        catch (error) {
            console.error('Error editando diagrama:', error);
            // En caso de error, devolver diagrama sin cambios
            return {
                modifiedDiagram: input.currentDiagram,
                changes: { added: [], modified: [], removed: [] },
                explanation: `Error al procesar la instrucción: ${error.message}`,
                success: false
            };
        }
    }
});
