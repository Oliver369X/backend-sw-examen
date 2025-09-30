"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSpringBootFromImage = exports.editDiagramWithAI = exports.analyzeImageToBackend = exports.convertMermaid = exports.orchestrateAIRequest = exports.generateDiagramFromText = exports.generateSpringBootWithTemplates = exports.generateSpringBootFromUML = exports.auditCode = exports.generateAIContent = void 0;
const generative_ai_1 = require("@google/generative-ai");
// Importar el nuevo experto
const expertAuditor_1 = require("../experts/expertAuditor"); // Importar el experto auditor
const expertUMLToSpringBoot_1 = require("../experts/expertUMLToSpringBoot");
// import { expertSpringBootAppGen } from '../experts/expertSpringBootAppGen'; // Eliminado - usar plantillas
const expertSpringBootTemplate_1 = require("../experts/expertSpringBootTemplate");
const expertDiagramGenerator_1 = require("../experts/expertDiagramGenerator");
const expertOrchestrator_1 = require("../experts/expertOrchestrator");
const expertMermaid_1 = require("../experts/expertMermaid");
const expertImageToBackend_1 = require("../experts/expertImageToBackend");
const expertDiagramEditor_1 = require("../experts/expertDiagramEditor"); // Nuevo: editor de diagramas con IA
const expertImageToSpringBoot_1 = require("../experts/expertImageToSpringBoot"); // Nuevo: imagen a Spring Boot directo
const umlParser_1 = require("../utils/umlParser");
const generateAIContent = async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'; // Modelo rápido por defecto
    console.log('DEBUG: Entrando a generateAIContent');
    console.log('DEBUG: GEMINI_API_KEY leída:', GEMINI_API_KEY ? '*****' : 'NO CONFIGURADA');
    console.log('DEBUG: GEMINI_MODEL leída:', GEMINI_MODEL);
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Servicio de Gemini no disponible: GEMINI_API_KEY no configurada.' });
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
    const { prompt, image } = req.body;
    if (!prompt && !image) {
        return res.status(400).json({ error: 'Se requiere al menos un campo: "prompt" o "image".' });
    }
    try {
        const generationConfig = {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };
        const safetySettings = [
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            },
        ];
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL, generationConfig, safetySettings });
        let result, response, text;
        if (image) {
            // Si se recibe imagen, se usa el método multimodal
            // NOTA: Se actualiza a gemini-1.5-flash ya que gemini-pro-vision está deprecado
            const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-preview-03-25', generationConfig, safetySettings });
            result = await visionModel.generateContent({
                contents: [{
                        role: 'user',
                        parts: [
                            ...(prompt ? [{ text: prompt }] : []),
                            { inlineData: { data: image, mimeType: 'image/png' } }
                        ]
                    }]
            });
            response = result.response;
            text = response.text();
        }
        else {
            // Solo texto
            result = await model.generateContent(prompt);
            response = result.response;
            text = response.text();
        }
        res.json({ generatedText: text });
    }
    catch (error) {
        console.error('Error al generar contenido con Gemini:', error);
        res.status(500).json({ error: 'Error al generar contenido con Gemini', details: error.message });
    }
};
exports.generateAIContent = generateAIContent;
// Nuevo endpoint para el experto auditor de código
const auditCode = async (req, res) => {
    const { code, context, focusAreas } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'El campo "code" es requerido.' });
    }
    try {
        const auditResult = await expertAuditor_1.expertAuditor.process({
            code,
            context: context || '',
            focusAreas: focusAreas || []
        });
        res.json({ auditResult });
    }
    catch (error) {
        console.error('Error en el controlador auditCode:', error);
        res.status(500).json({ error: 'Error al auditar el código', details: error.message });
    }
};
exports.auditCode = auditCode;
// Nuevo endpoint para generar código Spring Boot desde UML
const generateSpringBootFromUML = async (req, res) => {
    const { umlDiagram, config } = req.body;
    if (!umlDiagram) {
        return res.status(400).json({ error: 'El campo "umlDiagram" es requerido.' });
    }
    try {
        // Parsear y validar el diagrama UML
        const parsedDiagram = umlParser_1.UMLParser.parseDiagram(umlDiagram);
        // Generar código Spring Boot
        const result = await expertUMLToSpringBoot_1.expertUMLToSpringBoot.process({
            umlDiagram: parsedDiagram,
            config: config || {}
        });
        if (result.error) {
            return res.status(500).json({ error: result.error });
        }
        res.json({ springBootCode: result.springBootCode });
    }
    catch (error) {
        console.error('Error en el controlador generateSpringBootFromUML:', error);
        res.status(500).json({ error: 'Error al generar código Spring Boot', details: error.message });
    }
};
exports.generateSpringBootFromUML = generateSpringBootFromUML;
// Endpoint eliminado - usar generateSpringBootWithTemplates en su lugar
// Nuevo endpoint para generar aplicación Spring Boot con PLANTILLAS (sin IA)
const generateSpringBootWithTemplates = async (req, res) => {
    const { umlDiagram, config } = req.body;
    console.log('DEBUG: Datos recibidos en generateSpringBootWithTemplates:');
    console.log('umlDiagram:', JSON.stringify(umlDiagram, null, 2));
    console.log('config:', JSON.stringify(config, null, 2));
    if (!umlDiagram) {
        return res.status(400).json({ error: 'El campo "umlDiagram" es requerido.' });
    }
    try {
        // Parsear y validar el diagrama UML
        const parsedDiagram = umlParser_1.UMLParser.parseDiagram(umlDiagram);
        // Generar aplicación Spring Boot completa con PLANTILLAS
        const result = await expertSpringBootTemplate_1.expertSpringBootTemplate.process({
            umlDiagram: parsedDiagram,
            config: config || {}
        });
        if (result instanceof Buffer) {
            const projectName = config?.projectName || parsedDiagram.metadata?.projectName || 'spring-boot-app';
            const fileName = `${projectName}_template_${Date.now()}.zip`;
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            res.setHeader('Content-Type', 'application/zip');
            res.send(result);
        }
        else {
            console.error('expertSpringBootTemplate devolvió un string en lugar de un Buffer:', result);
            res.status(500).json({ error: 'Error al generar el archivo ZIP con plantillas. Formato de respuesta inesperado.' });
        }
    }
    catch (error) {
        console.error('Error en el controlador generateSpringBootWithTemplates:', error);
        res.status(500).json({ error: 'Error al generar el archivo ZIP con plantillas', details: error.message });
    }
};
exports.generateSpringBootWithTemplates = generateSpringBootWithTemplates;
// Endpoint para generar diagrama UML desde texto
const generateDiagramFromText = async (req, res) => {
    const { prompt, style } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'El campo "prompt" es requerido.' });
    }
    try {
        const result = await expertDiagramGenerator_1.expertDiagramGenerator.process({
            prompt,
            style: style || 'class'
        });
        res.json(result);
    }
    catch (error) {
        console.error('Error en generateDiagramFromText:', error);
        res.status(500).json({ error: 'Error al generar diagrama', details: error.message });
    }
};
exports.generateDiagramFromText = generateDiagramFromText;
// Endpoint para el orquestador de IA
const orchestrateAIRequest = async (req, res) => {
    const { query, context } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'El campo "query" es requerido.' });
    }
    try {
        const result = await expertOrchestrator_1.expertOrchestrator.process({
            query,
            context: context || {}
        });
        res.json(result);
    }
    catch (error) {
        console.error('Error en orchestrateAIRequest:', error);
        res.status(500).json({ error: 'Error al procesar solicitud', details: error.message });
    }
};
exports.orchestrateAIRequest = orchestrateAIRequest;
// Endpoint para convertir a/desde Mermaid
const convertMermaid = async (req, res) => {
    const { action, diagramData, mermaidCode } = req.body;
    if (!action || (action !== 'toMermaid' && action !== 'fromMermaid')) {
        return res.status(400).json({ error: 'El campo "action" debe ser "toMermaid" o "fromMermaid".' });
    }
    if (action === 'toMermaid' && !diagramData) {
        return res.status(400).json({ error: 'Se requiere "diagramData" para convertir a Mermaid.' });
    }
    if (action === 'fromMermaid' && !mermaidCode) {
        return res.status(400).json({ error: 'Se requiere "mermaidCode" para convertir desde Mermaid.' });
    }
    try {
        const result = await expertMermaid_1.expertMermaid.process({
            action,
            diagramData,
            mermaidCode
        });
        res.json(result);
    }
    catch (error) {
        console.error('Error en convertMermaid:', error);
        res.status(500).json({ error: 'Error al convertir Mermaid', details: error.message });
    }
};
exports.convertMermaid = convertMermaid;
// Endpoint para analizar imagen y generar backend
const analyzeImageToBackend = async (req, res) => {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
        return res.status(400).json({ error: 'El campo "imageBase64" es requerido.' });
    }
    try {
        const result = await expertImageToBackend_1.expertImageToBackend.process({
            imageBase64,
            mimeType: mimeType || 'image/png'
        });
        res.json(result);
    }
    catch (error) {
        console.error('Error en analyzeImageToBackend:', error);
        res.status(500).json({ error: 'Error al analizar imagen', details: error.message });
    }
};
exports.analyzeImageToBackend = analyzeImageToBackend;
// Endpoint para editar diagrama con IA
const editDiagramWithAI = async (req, res) => {
    const { currentDiagram, instruction, context } = req.body;
    if (!currentDiagram) {
        return res.status(400).json({ error: 'El campo "currentDiagram" es requerido.' });
    }
    if (!instruction) {
        return res.status(400).json({ error: 'El campo "instruction" es requerido.' });
    }
    try {
        const result = await expertDiagramEditor_1.expertDiagramEditor.process({
            currentDiagram,
            instruction,
            context: context || {}
        });
        res.json(result);
    }
    catch (error) {
        console.error('Error en editDiagramWithAI:', error);
        res.status(500).json({ error: 'Error al editar diagrama con IA', details: error.message });
    }
};
exports.editDiagramWithAI = editDiagramWithAI;
// Endpoint para generar Spring Boot directamente desde imagen
const generateSpringBootFromImage = async (req, res) => {
    const { imageBase64, mimeType, config } = req.body;
    if (!imageBase64) {
        return res.status(400).json({ error: 'El campo "imageBase64" es requerido.' });
    }
    try {
        console.log('🖼️  Recibiendo imagen para generar Spring Boot...');
        const result = await expertImageToSpringBoot_1.expertImageToSpringBoot.process({
            imageBase64,
            mimeType: mimeType || 'image/png',
            config: config || {}
        });
        if (result.error) {
            return res.status(500).json({
                error: result.error,
                details: result.description
            });
        }
        if (result.zipBuffer) {
            const projectName = config?.artifactId || 'uml-project';
            const fileName = `${projectName}_from_image_${Date.now()}.zip`;
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            res.setHeader('Content-Type', 'application/zip');
            res.send(result.zipBuffer);
        }
        else {
            res.status(500).json({
                error: 'No se pudo generar el ZIP',
                details: result.description
            });
        }
    }
    catch (error) {
        console.error('Error en generateSpringBootFromImage:', error);
        res.status(500).json({
            error: 'Error al procesar imagen y generar Spring Boot',
            details: error.message
        });
    }
};
exports.generateSpringBootFromImage = generateSpringBootFromImage;
