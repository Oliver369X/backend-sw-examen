import { expertOrchestrator } from '../src/experts/expertOrchestrator';

describe('Expert Orchestrator', () => {
  
  it('debería detectar intención de generar diagrama', async () => {
    const input = {
      query: 'Quiero crear un diagrama de biblioteca',
      context: {}
    };

    const result = await expertOrchestrator.process(input);

    expect(result).toBeDefined();
    expect(result.action).toBe('generate');
    expect(result.intent).toContain('diagrama');
    expect(result.result).toBeDefined();
  }, 15000);

  it('debería detectar intención de exportar', async () => {
    const input = {
      query: 'Exporta esto a Mermaid',
      context: {}
    };

    const result = await expertOrchestrator.process(input);

    expect(result).toBeDefined();
    expect(result.action).toBe('export');
    expect(result.intent).toContain('exportar');
  }, 15000);

  it('debería detectar solicitud de ayuda', async () => {
    const input = {
      query: '¿Cómo agrego una clase?',
      context: {}
    };

    const result = await expertOrchestrator.process(input);

    expect(result).toBeDefined();
    expect(result.action).toBe('help');
  }, 15000);

  it('debería proporcionar sugerencias', async () => {
    const input = {
      query: 'Quiero hacer algo con mi diagrama',
      context: {}
    };

    const result = await expertOrchestrator.process(input);

    expect(result).toBeDefined();
    expect(result.suggestions).toBeInstanceOf(Array);
    expect(result.suggestions.length).toBeGreaterThan(0);
  }, 15000);

  it('debería usar fallback sin API key', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const input = {
      query: 'Crea un diagrama',
      context: {}
    };

    const result = await expertOrchestrator.process(input);

    expect(result).toBeDefined();
    expect(result.action).toBe('generate');
    expect(result.intent).toBeDefined();

    process.env.GEMINI_API_KEY = originalKey;
  });

  it('debería detectar backend/spring boot', async () => {
    const input = {
      query: 'Genera el backend en Spring Boot',
      context: {}
    };

    const result = await expertOrchestrator.process(input);

    expect(result).toBeDefined();
    expect(result.action).toBe('export');
    expect(result.intent).toContain('backend');
  }, 15000);

  it('debería incluir nextSteps cuando sea apropiado', async () => {
    const input = {
      query: 'Ayuda con el sistema',
      context: {}
    };

    const result = await expertOrchestrator.process(input);

    expect(result).toBeDefined();
    if (result.needsMoreInfo || result.action === 'help') {
      expect(result.nextSteps || result.suggestions).toBeDefined();
    }
  }, 15000);

  it('debería manejar contexto con diagrama actual', async () => {
    const input = {
      query: 'Analiza esto',
      context: {
        currentDiagram: {
          classes: [
            { id: 'class-1', name: 'Usuario' }
          ]
        }
      }
    };

    const result = await expertOrchestrator.process(input);

    expect(result).toBeDefined();
    expect(result.action).toBeDefined();
  }, 15000);
});
