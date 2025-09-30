import { Router } from 'express';
import { 
    generateAIContent, 
 // Importar el nuevo controlador
    auditCode, // Importar el controlador del auditor
    generateSpringBootFromUML, // Importar el controlador para Spring Boot
    // generateSpringBootAppZip, // Eliminado - usar plantillas
    generateSpringBootWithTemplates, // Importar el controlador para Spring Boot con plantillas
    generateDiagramFromText, // Nuevo: generar diagrama desde texto
    orchestrateAIRequest, // Nuevo: orquestador de IA
    convertMermaid, // Nuevo: convertir Mermaid
    analyzeImageToBackend, // Nuevo: analizar imagen a backend
    editDiagramWithAI, // Nuevo: editar diagrama con IA
    generateSpringBootFromImage // Nuevo: imagen a Spring Boot directo
} from '../controllers/ai.controller';

const router = Router();

router.post('/', generateAIContent);
 // Nueva ruta para generar el ZIP
router.post('/audit-code', auditCode); // Nueva ruta para auditar código

// Nuevas rutas para Spring Boot
router.post('/uml-to-springboot', generateSpringBootFromUML); // Generar código Spring Boot desde UML (con IA)
// router.post('/springboot-app-zip', generateSpringBootAppZip); // Eliminado - usar plantillas
router.post('/springboot-template-zip', generateSpringBootWithTemplates); // Generar ZIP con PLANTILLAS (sin IA)

// Nuevas rutas para agentes especializados
router.post('/generate-diagram', generateDiagramFromText); // Generar diagrama UML desde texto
router.post('/chat', orchestrateAIRequest); // Orquestador de IA (chat inteligente)
router.post('/mermaid', convertMermaid); // Convertir a/desde Mermaid
router.post('/analyze-image', analyzeImageToBackend); // Analizar imagen y generar diagrama
router.post('/edit-diagram', editDiagramWithAI); // Editar diagrama con IA
router.post('/image-to-springboot', generateSpringBootFromImage); // Imagen directo a Spring Boot ZIP

export default router;
