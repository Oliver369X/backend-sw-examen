"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
router.post('/', ai_controller_1.generateAIContent);
// Nueva ruta para generar el ZIP
router.post('/audit-code', ai_controller_1.auditCode); // Nueva ruta para auditar código
// Nuevas rutas para Spring Boot
router.post('/uml-to-springboot', ai_controller_1.generateSpringBootFromUML); // Generar código Spring Boot desde UML (con IA)
// router.post('/springboot-app-zip', generateSpringBootAppZip); // Eliminado - usar plantillas
router.post('/springboot-template-zip', ai_controller_1.generateSpringBootWithTemplates); // Generar ZIP con PLANTILLAS (sin IA)
// Nuevas rutas para agentes especializados
router.post('/generate-diagram', ai_controller_1.generateDiagramFromText); // Generar diagrama UML desde texto
router.post('/chat', ai_controller_1.orchestrateAIRequest); // Orquestador de IA (chat inteligente)
router.post('/mermaid', ai_controller_1.convertMermaid); // Convertir a/desde Mermaid
router.post('/analyze-image', ai_controller_1.analyzeImageToBackend); // Analizar imagen y generar diagrama
router.post('/edit-diagram', ai_controller_1.editDiagramWithAI); // Editar diagrama con IA
router.post('/image-to-springboot', ai_controller_1.generateSpringBootFromImage); // Imagen directo a Spring Boot ZIP
exports.default = router;
