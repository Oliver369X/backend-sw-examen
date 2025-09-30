import { expertImageToBackend } from '../src/experts/expertImageToBackend';

describe('Expert Image to Backend', () => {
  
  // Imagen base64 de prueba (1x1 pixel PNG transparente)
  const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  it('debería procesar una imagen y devolver estructura de diagrama', async () => {
    const input = {
      imageBase64: testImageBase64,
      mimeType: 'image/png'
    };

    const result = await expertImageToBackend.process(input);

    expect(result).toBeDefined();
    expect(result.diagramData).toBeDefined();
    expect(result.diagramData.classes).toBeInstanceOf(Array);
    expect(result.diagramData.interfaces).toBeInstanceOf(Array);
    expect(result.diagramData.relationships).toBeInstanceOf(Array);
    expect(result.diagramData.notes).toBeInstanceOf(Array);
    expect(result.diagramData.packages).toBeInstanceOf(Array);
    expect(result.description).toBeDefined();
    expect(result.confidence).toBeDefined();
  }, 30000);

  it('debería incluir nivel de confianza', async () => {
    const input = {
      imageBase64: testImageBase64,
      mimeType: 'image/png'
    };

    const result = await expertImageToBackend.process(input);

    expect(result.confidence).toBeDefined();
    expect(typeof result.confidence).toBe('number');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  }, 30000);

  it('debería incluir descripción del análisis', async () => {
    const input = {
      imageBase64: testImageBase64,
      mimeType: 'image/png'
    };

    const result = await expertImageToBackend.process(input);

    expect(result.description).toBeDefined();
    expect(typeof result.description).toBe('string');
    expect(result.description.length).toBeGreaterThan(0);
  }, 30000);

  it('debería manejar diferentes formatos de imagen', async () => {
    const formats = ['image/png', 'image/jpeg', 'image/gif'];
    
    for (const mimeType of formats) {
      const input = {
        imageBase64: testImageBase64,
        mimeType
      };

      const result = await expertImageToBackend.process(input);
      expect(result).toBeDefined();
      expect(result.diagramData).toBeDefined();
    }
  }, 45000);

  it('debería fallar sin GEMINI_API_KEY', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const input = {
      imageBase64: testImageBase64,
      mimeType: 'image/png'
    };

    try {
      await expertImageToBackend.process(input);
      fail('Debería lanzar error sin API key');
    } catch (error: any) {
      expect(error.message).toContain('GEMINI_API_KEY no configurada');
    } finally {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });

  it('debería tener fallback en caso de error de análisis', async () => {
    // Imagen inválida
    const input = {
      imageBase64: 'data:image/png;base64,INVALID',
      mimeType: 'image/png'
    };

    const result = await expertImageToBackend.process(input);

    // Debería retornar estructura válida aunque sea con error
    expect(result).toBeDefined();
    expect(result.diagramData).toBeDefined();
    expect(result.confidence).toBe(0);
    
    // Debería incluir nota de error
    if (result.diagramData.notes && result.diagramData.notes.length > 0) {
      expect(result.diagramData.notes[0].content).toContain('No se pudo analizar');
    }
  }, 30000);

  it('debería procesar imagen sin prefijo data:image', async () => {
    const input = {
      imageBase64: testImageBase64.replace('data:image/png;base64,', ''),
      mimeType: 'image/png'
    };

    const result = await expertImageToBackend.process(input);

    expect(result).toBeDefined();
    expect(result.diagramData).toBeDefined();
  }, 30000);

  it('debería usar mimeType por defecto si no se proporciona', async () => {
    const input = {
      imageBase64: testImageBase64
    };

    const result = await expertImageToBackend.process(input);

    expect(result).toBeDefined();
    expect(result.diagramData).toBeDefined();
  }, 30000);

  it('debería generar IDs únicos para elementos del diagrama', async () => {
    if (!process.env.GEMINI_API_KEY) {
      console.log('Skipping test - No GEMINI_API_KEY');
      return;
    }

    const input = {
      imageBase64: testImageBase64,
      mimeType: 'image/png'
    };

    const result = await expertImageToBackend.process(input);

    const allIds = [
      ...result.diagramData.classes.map((c: any) => c.id),
      ...result.diagramData.interfaces.map((i: any) => i.id),
      ...result.diagramData.relationships.map((r: any) => r.id),
      ...result.diagramData.notes.map((n: any) => n.id)
    ];

    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  }, 30000);
});
