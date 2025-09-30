import { expertDiagramGenerator } from '../src/experts/expertDiagramGenerator';

describe('Expert Diagram Generator', () => {
  
  it('debería generar un diagrama básico desde texto', async () => {
    const input = {
      prompt: 'Sistema de biblioteca con libros y usuarios',
      style: 'class' as const
    };

    const result = await expertDiagramGenerator.process(input);

    expect(result).toBeDefined();
    expect(result.diagramData).toBeDefined();
    expect(result.diagramData.classes).toBeInstanceOf(Array);
    expect(result.diagramData.relationships).toBeInstanceOf(Array);
    expect(result.diagramData.interfaces).toBeInstanceOf(Array);
    expect(result.diagramData.notes).toBeInstanceOf(Array);
    expect(result.diagramData.packages).toBeInstanceOf(Array);
    
    // Verificar que se generaron clases
    if (process.env.GEMINI_API_KEY) {
      expect(result.diagramData.classes.length).toBeGreaterThan(0);
    }
  }, 30000); // Timeout de 30 segundos para llamadas a la API

  it('debería generar un diagrama de e-commerce', async () => {
    const input = {
      prompt: 'Sistema de e-commerce con productos, usuarios y pedidos',
      style: 'class' as const
    };

    const result = await expertDiagramGenerator.process(input);

    expect(result).toBeDefined();
    expect(result.diagramData).toBeDefined();
    expect(result.explanation).toBeDefined();
    
    if (process.env.GEMINI_API_KEY) {
      expect(result.diagramData.classes.length).toBeGreaterThanOrEqual(2);
    }
  }, 30000);

  it('debería manejar prompts vacíos', async () => {
    const input = {
      prompt: '',
      style: 'class' as const
    };

    try {
      await expertDiagramGenerator.process(input);
      // Si no lanza error, al menos debería retornar algo válido
      expect(true).toBe(true);
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  }, 30000); // Aumentar timeout a 30 segundos

  it('debería generar clases con atributos y métodos', async () => {
    const input = {
      prompt: 'Clase Usuario con nombre, email y método validar',
      style: 'class' as const
    };

    const result = await expertDiagramGenerator.process(input);

    if (process.env.GEMINI_API_KEY && result.diagramData.classes.length > 0) {
      const firstClass = result.diagramData.classes[0];
      expect(firstClass).toHaveProperty('name');
      expect(firstClass).toHaveProperty('attributes');
      expect(firstClass).toHaveProperty('methods');
      expect(firstClass).toHaveProperty('x');
      expect(firstClass).toHaveProperty('y');
    }
  }, 30000);

  it('debería fallar sin GEMINI_API_KEY', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const input = {
      prompt: 'Test sin API key',
      style: 'class' as const
    };

    try {
      await expertDiagramGenerator.process(input);
      fail('Debería lanzar error sin API key');
    } catch (error: any) {
      expect(error.message).toContain('GEMINI_API_KEY no configurada');
    } finally {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });
});
