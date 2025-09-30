"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expertOrchestrator = void 0;
const expertBase_1 = require("./expertBase");
const generative_ai_1 = require("@google/generative-ai");
exports.expertOrchestrator = (0, expertBase_1.createExpert)({
    name: 'AI Orchestrator',
    systemPrompt: `Eres un asistente experto en diagramas UML y generación de código.

Tu trabajo es:
1. Entender la intención del usuario
2. Determinar qué acción realizar
3. Proporcionar respuestas claras y útiles
4. Sugerir próximos pasos

ACCIONES DISPONIBLES:
- "generate": Generar nuevo diagrama UML desde cero
- "modify": Modificar/editar diagrama existente (agregar, eliminar, cambiar elementos)
- "export": Exportar a formato (Mermaid, imagen, código)
- "analyze": Analizar diagrama actual
- "chat": Conversación general / preguntas
- "help": Ayuda sobre cómo usar el sistema

RESPONDE EN FORMATO JSON:
{
  "action": "generate" | "modify" | "export" | "analyze" | "chat" | "help",
  "intent": "descripción clara de la intención",
  "response": "respuesta al usuario",
  "suggestions": ["sugerencia 1", "sugerencia 2"],
  "nextSteps": ["paso 1", "paso 2"],
  "needsMoreInfo": false
}

EJEMPLOS:

Usuario: "Crea un diagrama de biblioteca"
→ {"action": "generate", "intent": "crear diagrama de sistema de biblioteca", "response": "Voy a generar un diagrama UML para un sistema de biblioteca..."}

Usuario: "Agrega una clase Usuario"
→ {"action": "modify", "intent": "agregar clase Usuario al diagrama existente", "response": "Agregando clase Usuario al diagrama..."}

Usuario: "Elimina la clase X"
→ {"action": "modify", "intent": "eliminar clase X del diagrama", "response": "Eliminando clase X del diagrama..."}

Usuario: "Exporta esto a Mermaid"
→ {"action": "export", "intent": "exportar diagrama a formato Mermaid", "response": "Exportando el diagrama actual a código Mermaid..."}

Usuario: "¿Cómo agrego una relación?"
→ {"action": "help", "intent": "ayuda sobre agregar relaciones", "response": "Para agregar una relación: 1. Selecciona la herramienta de relación..."}

IMPORTANTE:
- Detecta el idioma del usuario (español/inglés)
- Responde en el mismo idioma
- Sé claro y conciso
- Ofrece sugerencias útiles`,
    async process(input) {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        if (!GEMINI_API_KEY) {
            // Fallback sin IA
            return fallbackResponse(input.query);
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        });
        try {
            const contextInfo = input.context?.currentDiagram
                ? `\n\nCONTEXTO: El usuario tiene un diagrama actual con ${input.context.currentDiagram.classes?.length || 0} clases.`
                : '';
            const fullPrompt = `${this.systemPrompt}

CONSULTA DEL USUARIO:
"${input.query}"${contextInfo}

Analiza y responde en JSON:`;
            const result = await model.generateContent(fullPrompt);
            const response = result.response;
            let text = response.text();
            // Limpiar respuesta
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            // Parsear JSON
            const aiResponse = JSON.parse(text);
            return {
                action: aiResponse.action || 'chat',
                intent: aiResponse.intent || 'conversación general',
                result: aiResponse.response || aiResponse.result,
                suggestions: aiResponse.suggestions || [],
                nextSteps: aiResponse.nextSteps || [],
                needsMoreInfo: aiResponse.needsMoreInfo || false
            };
        }
        catch (error) {
            console.error('Error en orchestrator:', error);
            return fallbackResponse(input.query);
        }
    }
});
// Respuestas predefinidas sin IA (fuera del createExpert)
function fallbackResponse(query) {
    const lowerQuery = query.toLowerCase();
    // Detectar modificaciones primero
    if (lowerQuery.includes('agrega') || lowerQuery.includes('añade') || lowerQuery.includes('crea clase') ||
        lowerQuery.includes('elimina') || lowerQuery.includes('borra') || lowerQuery.includes('modifica') ||
        lowerQuery.includes('cambia') || lowerQuery.includes('edita')) {
        return {
            action: 'modify',
            intent: 'modificar diagrama existente',
            result: 'Voy a modificar el diagrama según tu solicitud.',
            suggestions: [
                'Agrega atributos',
                'Crea relaciones',
                'Refactoriza el diseño'
            ],
            needsMoreInfo: false
        };
    }
    // Detectar generación de nuevo diagrama
    if (lowerQuery.includes('crear') || lowerQuery.includes('generar') || lowerQuery.includes('nuevo diagrama')) {
        return {
            action: 'generate',
            intent: 'generar nuevo diagrama',
            result: 'Puedo ayudarte a generar un diagrama UML. ¿Qué tipo de sistema quieres modelar?',
            suggestions: [
                'Sistema de biblioteca',
                'Sistema de usuarios y productos',
                'Sistema académico'
            ],
            needsMoreInfo: true
        };
    }
    if (lowerQuery.includes('exportar') || lowerQuery.includes('mermaid')) {
        return {
            action: 'export',
            intent: 'exportar diagrama',
            result: 'Para exportar tu diagrama, usa el botón "Exportar a Mermaid" en el panel de acciones rápidas.',
            suggestions: ['Exportar como PNG', 'Generar código Spring Boot'],
            needsMoreInfo: false
        };
    }
    if (lowerQuery.includes('backend') || lowerQuery.includes('spring') || lowerQuery.includes('código')) {
        return {
            action: 'export',
            intent: 'generar código backend',
            result: 'Puedo generar un proyecto Spring Boot completo desde tu diagrama. Haz clic en "Generar Backend" cuando estés listo.',
            suggestions: ['Ver documentación del generador', 'Probar con diagrama de ejemplo'],
            needsMoreInfo: false
        };
    }
    if (lowerQuery.includes('cómo') || lowerQuery.includes('ayuda') || lowerQuery.includes('help')) {
        return {
            action: 'help',
            intent: 'solicitar ayuda',
            result: 'Estoy aquí para ayudarte. Puedo:\n- Generar diagramas UML desde texto\n- Exportar a Mermaid\n- Generar código Spring Boot\n- Responder preguntas sobre UML',
            suggestions: [
                '¿Cómo crear una clase?',
                '¿Cómo agregar relaciones?',
                '¿Cómo generar código?'
            ],
            needsMoreInfo: false
        };
    }
    // Respuesta genérica
    return {
        action: 'chat',
        intent: 'conversación general',
        result: 'Entiendo. ¿En qué puedo ayudarte con tu diagrama UML?',
        suggestions: [
            'Generar nuevo diagrama',
            'Exportar a Mermaid',
            'Generar backend'
        ],
        needsMoreInfo: false
    };
}
