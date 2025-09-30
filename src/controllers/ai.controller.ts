import { Request, Response } from 'express';
import { GoogleGenerativeAI, GenerationConfig, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
 // Importar el nuevo experto
import { expertAuditor } from '../experts/expertAuditor'; // Importar el experto auditor
import { expertUMLToSpringBoot } from '../experts/expertUMLToSpringBoot';
// import { expertSpringBootAppGen } from '../experts/expertSpringBootAppGen'; // Eliminado - usar plantillas
import { expertSpringBootTemplate } from '../experts/expertSpringBootTemplate';
import { expertDiagramGenerator } from '../experts/expertDiagramGenerator';
import { expertOrchestrator } from '../experts/expertOrchestrator';
import { expertMermaid } from '../experts/expertMermaid';
import { expertImageToBackend } from '../experts/expertImageToBackend';
import { expertDiagramEditor } from '../experts/expertDiagramEditor'; // Nuevo: editor de diagramas con IA
import { expertImageToSpringBoot } from '../experts/expertImageToSpringBoot'; // Nuevo: imagen a Spring Boot directo
import { UMLParser } from '../utils/umlParser';

export const generateAIContent = async (req: Request, res: Response) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'; // Modelo rápido por defecto

  console.log('DEBUG: Entrando a generateAIContent');
  console.log('DEBUG: GEMINI_API_KEY leída:', GEMINI_API_KEY ? '*****' : 'NO CONFIGURADA');
  console.log('DEBUG: GEMINI_MODEL leída:', GEMINI_MODEL);

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Servicio de Gemini no disponible: GEMINI_API_KEY no configurada.' });
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  const { prompt, image } = req.body;

  if (!prompt && !image) {
    return res.status(400).json({ error: 'Se requiere al menos un campo: "prompt" o "image".' });
  }

  try {
    const generationConfig: GenerationConfig = {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
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
    } else {
      // Solo texto
      result = await model.generateContent(prompt);
      response = result.response;
      text = response.text();
    }
    res.json({ generatedText: text });
  } catch (error: any) {
    console.error('Error al generar contenido con Gemini:', error);
    res.status(500).json({ error: 'Error al generar contenido con Gemini', details: error.message });
  }
};





// Nuevo endpoint para el experto auditor de código
export const auditCode = async (req: Request, res: Response) => {
  const { code, context, focusAreas } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'El campo "code" es requerido.' });
  }

  try {
    const auditResult = await expertAuditor.process({
      code,
      context: context || '',
      focusAreas: focusAreas || []
    });

    res.json({ auditResult });
  } catch (error: any) {
    console.error('Error en el controlador auditCode:', error);
    res.status(500).json({ error: 'Error al auditar el código', details: error.message });
  }
};

// Nuevo endpoint para generar código Spring Boot desde UML
export const generateSpringBootFromUML = async (req: Request, res: Response) => {
  const { umlDiagram, config } = req.body;

  if (!umlDiagram) {
    return res.status(400).json({ error: 'El campo "umlDiagram" es requerido.' });
  }

  try {
    // Parsear y validar el diagrama UML
    const parsedDiagram = UMLParser.parseDiagram(umlDiagram);
    
    // Generar código Spring Boot
    const result = await expertUMLToSpringBoot.process({ 
      umlDiagram: parsedDiagram, 
      config: config || {} 
    });

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ springBootCode: result.springBootCode });
  } catch (error: any) {
    console.error('Error en el controlador generateSpringBootFromUML:', error);
    res.status(500).json({ error: 'Error al generar código Spring Boot', details: error.message });
  }
};

// Endpoint eliminado - usar generateSpringBootWithTemplates en su lugar

// Nuevo endpoint para generar aplicación Spring Boot con PLANTILLAS (sin IA)
export const generateSpringBootWithTemplates = async (req: Request, res: Response) => {
  const { umlDiagram, config } = req.body;

  console.log('DEBUG: Datos recibidos en generateSpringBootWithTemplates:');
  console.log('umlDiagram:', JSON.stringify(umlDiagram, null, 2));
  console.log('config:', JSON.stringify(config, null, 2));

  if (!umlDiagram) {
    return res.status(400).json({ error: 'El campo "umlDiagram" es requerido.' });
  }

  try {
    // Parsear y validar el diagrama UML
    const parsedDiagram = UMLParser.parseDiagram(umlDiagram);
    
    // Generar aplicación Spring Boot completa con PLANTILLAS
    const result = await expertSpringBootTemplate.process({ 
      umlDiagram: parsedDiagram, 
      config: config || {} 
    });

    if (result instanceof Buffer) {
      const projectName = config?.projectName || parsedDiagram.metadata?.projectName || 'spring-boot-app';
      const fileName = `${projectName}_template_${Date.now()}.zip`;
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'application/zip');
      res.send(result);
    } else {
      console.error('expertSpringBootTemplate devolvió un string en lugar de un Buffer:', result);
      res.status(500).json({ error: 'Error al generar el archivo ZIP con plantillas. Formato de respuesta inesperado.' });
    }
  } catch (error: any) {
    console.error('Error en el controlador generateSpringBootWithTemplates:', error);
    res.status(500).json({ error: 'Error al generar el archivo ZIP con plantillas', details: error.message });
  }
};

// Endpoint para generar diagrama UML desde texto
export const generateDiagramFromText = async (req: Request, res: Response) => {
  const { prompt, style } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'El campo "prompt" es requerido.' });
  }

  try {
    const result = await expertDiagramGenerator.process({
      prompt,
      style: style || 'class'
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error en generateDiagramFromText:', error);
    res.status(500).json({ error: 'Error al generar diagrama', details: error.message });
  }
};

// Endpoint para el orquestador de IA
export const orchestrateAIRequest = async (req: Request, res: Response) => {
  const { query, context } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'El campo "query" es requerido.' });
  }

  try {
    const result = await expertOrchestrator.process({
      query,
      context: context || {}
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error en orchestrateAIRequest:', error);
    res.status(500).json({ error: 'Error al procesar solicitud', details: error.message });
  }
};

// Endpoint para convertir a/desde Mermaid
export const convertMermaid = async (req: Request, res: Response) => {
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
    const result = await expertMermaid.process({
      action,
      diagramData,
      mermaidCode
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error en convertMermaid:', error);
    res.status(500).json({ error: 'Error al convertir Mermaid', details: error.message });
  }
};

// Endpoint para analizar imagen y generar backend
export const analyzeImageToBackend = async (req: Request, res: Response) => {
  const { imageBase64, mimeType } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'El campo "imageBase64" es requerido.' });
  }

  try {
    const result = await expertImageToBackend.process({
      imageBase64,
      mimeType: mimeType || 'image/png'
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error en analyzeImageToBackend:', error);
    res.status(500).json({ error: 'Error al analizar imagen', details: error.message });
  }
};

// Endpoint para editar diagrama con IA
export const editDiagramWithAI = async (req: Request, res: Response) => {
  const { currentDiagram, instruction, context } = req.body;

  if (!currentDiagram) {
    return res.status(400).json({ error: 'El campo "currentDiagram" es requerido.' });
  }

  if (!instruction) {
    return res.status(400).json({ error: 'El campo "instruction" es requerido.' });
  }

  try {
    const result = await expertDiagramEditor.process({
      currentDiagram,
      instruction,
      context: context || {}
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error en editDiagramWithAI:', error);
    res.status(500).json({ error: 'Error al editar diagrama con IA', details: error.message });
  }
};

// Endpoint para generar Spring Boot directamente desde imagen
export const generateSpringBootFromImage = async (req: Request, res: Response) => {
  const { imageBase64, mimeType, config } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'El campo "imageBase64" es requerido.' });
  }

  try {
    console.log('🖼️  Recibiendo imagen para generar Spring Boot...');
    
    const result = await expertImageToSpringBoot.process({
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
    } else {
      res.status(500).json({ 
        error: 'No se pudo generar el ZIP',
        details: result.description 
      });
    }
  } catch (error: any) {
    console.error('Error en generateSpringBootFromImage:', error);
    res.status(500).json({ 
      error: 'Error al procesar imagen y generar Spring Boot', 
      details: error.message 
    });
  }
};
