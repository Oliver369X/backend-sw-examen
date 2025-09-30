"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expertAuditor = void 0;
const expertBase_1 = require("./expertBase");
const generative_ai_1 = require("@google/generative-ai");
exports.expertAuditor = (0, expertBase_1.createExpert)({
    name: 'Code Auditor',
    systemPrompt: `Eres un experto auditor de código especializado en detectar errores, problemas de seguridad, y oportunidades de mejora en código TypeScript/JavaScript y Flutter/Dart, especialmente en el contexto de generación de aplicaciones Flutter.

Tu función principal es analizar código y proporcionar:
1. **Errores críticos**: Problemas que causarán fallos en tiempo de ejecución
2. **Advertencias**: Problemas que podrían causar comportamientos inesperados
3. **Sugerencias de mejora**: Optimizaciones y mejores prácticas
4. **Problemas de seguridad**: Vulnerabilidades potenciales
5. **Problemas de rendimiento**: Código que podría ser ineficiente
6. **Correcciones automáticas**: Código corregido para errores comunes

Áreas específicas que debes revisar:
- Manejo de errores y excepciones
- Validación de entrada de datos
- Gestión de recursos (archivos, memoria)
- Seguridad en el manejo de archivos
- Patrones de código y mejores prácticas
- Posibles memory leaks
- Problemas de concurrencia
- Validación de tipos TypeScript
- Errores específicos de Flutter/Dart:
  * Nullable types (Color? vs Color)
  * Missing required parameters
  * Incorrect widget structure
  * Missing imports
  * Type mismatches
  * Const constructor issues

Proporciona un análisis estructurado con:
- Resumen ejecutivo
- Lista detallada de problemas encontrados
- Sugerencias de corrección
- Código corregido cuando sea posible
- Priorización de problemas (crítico, alto, medio, bajo)

Para errores de Flutter específicos, proporciona el código corregido completo.`,
    async process({ code, context = '', focusAreas = [] }) {
        try {
            const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
            if (!GEMINI_API_KEY) {
                throw new Error('GEMINI_API_KEY no está configurada');
            }
            const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
            const ai = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
            const model = ai.getGenerativeModel({ model: GEMINI_MODEL });
            const focusAreasText = focusAreas.length > 0
                ? `\n\nÁreas específicas a revisar: ${focusAreas.join(', ')}`
                : '';
            const prompt = `Analiza el siguiente código y proporciona una auditoría completa de seguridad, errores y mejores prácticas. Si es código Flutter/Dart, presta especial atención a errores de tipos nullable y otros errores comunes de Flutter.

${context ? `Contexto: ${context}` : ''}${focusAreasText}

Código a auditar:
\`\`\`dart
${code}
\`\`\`

Proporciona tu análisis en el siguiente formato:

## RESUMEN EJECUTIVO
[Breve resumen de los problemas principales encontrados]

## PROBLEMAS CRÍTICOS
[Lista de errores que causarán fallos en tiempo de ejecución]

## ADVERTENCIAS
[Problemas que podrían causar comportamientos inesperados]

## SUGERENCIAS DE MEJORA
[Optimizaciones y mejores prácticas recomendadas]

## PROBLEMAS DE SEGURIDAD
[Vulnerabilidades potenciales identificadas]

## PROBLEMAS DE RENDIMIENTO
[Código que podría ser ineficiente]

## CORRECCIONES AUTOMÁTICAS
[Si encuentras errores específicos de Flutter como Color? vs Color, proporciona el código corregido completo]

## RECOMENDACIONES PRIORITARIAS
[Lista ordenada por prioridad de las correcciones más importantes]

Asegúrate de ser específico y proporcionar ejemplos de código cuando sea apropiado. Si encuentras errores de tipos nullable en Flutter, proporciona el código corregido completo.`;
            const result = await model.generateContent(prompt);
            const response = result.response;
            return response.text();
        }
        catch (error) {
            console.error('Error en el auditor de código:', error);
            return `Error al realizar la auditoría: ${error.message}`;
        }
    }
});
