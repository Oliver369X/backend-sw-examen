import { createExpert } from './expertBase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { expertSpringBootTemplate } from './expertSpringBootTemplate';

interface ImageToSpringBootInput {
  imageBase64: string;
  mimeType?: string;
  config?: {
    groupId?: string;
    artifactId?: string;
    version?: string;
    javaVersion?: string;
  };
}

interface ImageToSpringBootOutput {
  zipBuffer?: Buffer;
  diagramData?: any;
  description?: string;
  error?: string;
}

export const expertImageToSpringBoot = createExpert({
  name: 'Image to Spring Boot Generator',
  systemPrompt: `Eres un experto en analizar imágenes de diagramas UML y convertirlas en estructura JSON para generar aplicaciones Spring Boot.

Tu tarea es:
1. Analizar la imagen del diagrama UML de clases
2. Identificar TODAS las clases con sus atributos y métodos
3. Detectar tipos de relaciones (herencia, asociación, composición, agregación)
4. Generar JSON estructurado EXACTO para Spring Boot

REGLAS CRÍTICAS:
- Cada clase debe tener un ID único
- Los atributos deben tener formato: "- nombre: Tipo" 
- Los métodos deben tener formato: "+ nombre(params): Tipo"
- Tipos válidos: String, Integer, Long, Double, Boolean, Date, List<Tipo>
- Relaciones: sourceClassId y targetClassId (no "from"/"to")

FORMATO JSON EXACTO:
{
  "classes": [
    {
      "id": "class-person",
      "name": "Person",
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 150,
      "attributes": [
        "- name: String",
        "- age: Integer",
        "- email: String"
      ],
      "methods": [
        "+ getName(): String",
        "+ setName(name: String): void",
        "+ getAge(): Integer",
        "+ setAge(age: Integer): void"
      ],
      "stereotypes": [],
      "visibility": "public"
    }
  ],
  "interfaces": [],
  "relationships": [
    {
      "id": "rel-1",
      "type": "inheritance",
      "sourceClassId": "class-student",
      "targetClassId": "class-person",
      "fromMultiplicity": "",
      "toMultiplicity": "",
      "label": "extends"
    }
  ],
  "notes": [],
  "packages": []
}

TIPOS DE RELACIONES:
- "inheritance" = extends (flecha vacía)
- "association" = asociación simple (línea)
- "composition" = composición (diamante relleno)
- "aggregation" = agregación (diamante vacío)
- "realization" = implements (flecha punteada)

IMPORTANTE:
- Lee TODOS los textos de la imagen
- Separa correctamente atributos (campos) de métodos (funciones)
- Detecta visibilidad: + (public), - (private), # (protected)
- Si hay interfaz, usa type: "realization" para implements

RESPONDE SOLO CON JSON VÁLIDO, SIN MARKDOWN.

NOTA CRÍTICA: Los atributos y métodos DEBEN estar en formato STRING tal como aparecen en la imagen.
Ejemplo: "- name: String", "+ getAge(): int", etc.`,

  async process(input: ImageToSpringBootInput): Promise<ImageToSpringBootOutput> {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return {
        error: 'GEMINI_API_KEY no configurada',
        description: 'No se puede analizar la imagen sin API key'
      };
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3, // Baja temperatura para mayor precisión
        topK: 32,
        topP: 1,
        maxOutputTokens: 8192,
      }
    });

    try {
      console.log('🖼️  Analizando imagen para generar Spring Boot...');

      // Preparar imagen
      const imageData = input.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      
      const imageParts = [
        {
          inlineData: {
            data: imageData,
            mimeType: input.mimeType || 'image/png'
          }
        }
      ];

      const prompt = `${this.systemPrompt}

Analiza esta imagen de diagrama UML y genera el JSON estructurado EXACTO:`;

      // Paso 1: Analizar imagen con Gemini Vision
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = result.response;
      let text = response.text();

      console.log('📝 Respuesta de Gemini:', text.substring(0, 200) + '...');

      // Limpiar respuesta
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      // Parsear JSON
      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError);
        console.log('Texto recibido:', text);
        throw new Error('La IA no devolvió JSON válido');
      }

      // Normalizar estructura
      const rawDiagram = {
        classes: parsedData.classes || [],
        interfaces: parsedData.interfaces || [],
        relationships: parsedData.relationships || [],
        notes: parsedData.notes || [],
        packages: parsedData.packages || [],
        metadata: {
          projectName: input.config?.artifactId || 'uml-project',
          description: 'Generado desde imagen de diagrama UML'
        }
      };

      console.log(`✅ Diagrama parseado: ${rawDiagram.classes.length} clases, ${rawDiagram.relationships.length} relaciones`);

      // IMPORTANTE: Parsear el diagrama para convertir strings a objetos
      // Gemini devuelve atributos como "- name: String" pero las plantillas necesitan {name, type}
      const { UMLParser } = await import('../utils/umlParser');
      const diagramData = UMLParser.parseDiagram(rawDiagram);
      
      console.log('📋 Diagrama normalizado para plantillas:', {
        classes: diagramData.classes.length,
        primeraClase: diagramData.classes[0]?.name,
        primerosAtributos: diagramData.classes[0]?.attributes?.slice(0, 2)
      });

      // Paso 2: Generar Spring Boot con plantillas
      const springBootConfig = {
        groupId: input.config?.groupId || 'com.example',
        artifactId: input.config?.artifactId || 'uml-project',
        version: input.config?.version || '1.0.0',
        javaVersion: input.config?.javaVersion || '17'
      };

      console.log('🚀 Generando proyecto Spring Boot...');
      
      const zipBuffer = await expertSpringBootTemplate.process({
        umlDiagram: diagramData,
        config: springBootConfig
      });

      return {
        zipBuffer: zipBuffer as Buffer,
        diagramData,
        description: `Proyecto generado: ${diagramData.classes.length} entidades, ${diagramData.relationships.length} relaciones`
      };

    } catch (error: any) {
      console.error('❌ Error en Image to Spring Boot:', error);
      
      return {
        error: error.message || 'Error desconocido',
        description: `No se pudo procesar la imagen: ${error.message}`
      };
    }
  }
});
