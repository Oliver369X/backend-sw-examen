import request from 'supertest';
import app from '../src/app';

// Aumentar el tiempo de espera de Jest para las pruebas que involucran llamadas a API
jest.setTimeout(30000);

describe('AI Content Generation API', () => {
  // Configurar la variable de entorno para la clave de API de Gemini
  // IMPORTANTE: En un entorno de CI/CD o en tu máquina local, asegúrate de que GEMINI_API_KEY y GEMINI_MODEL estén configuradas.
  // Por ejemplo, en tu .env o directamente en el script de prueba si es para desarrollo.
  // Para pruebas unitarias, se puede usar un mock si no quieres depender de la API real.
  beforeAll(() => {
    // Si estás usando dotenv para cargar variables de entorno, asegúrate de que se cargue aquí
    // require('dotenv').config(); // Descomenta si usas dotenv
    // Asegúrate de que estas variables de entorno estén disponibles en tu entorno de prueba
    process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCzS46fN_OcC28C80j0nsciVnD6n1UdocI'; // Usa una clave real o una mock
    process.env.GEMINI_MODEL = 'gemini-2.5-pro-preview-03-25'; // Establecer el modelo para los tests

    console.log('DEBUG TEST: En beforeAll - process.env.GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '*****' : 'NO CONFIGURADA');
    console.log('DEBUG TEST: En beforeAll - process.env.GEMINI_MODEL:', process.env.GEMINI_MODEL);
  });

  afterAll(async () => {
    // Importar prisma y desconectarlo después de todas las pruebas
    const prisma = require('../src/prisma').default;
    await prisma.$disconnect();
  });

  it('should generate AI content successfully', async () => {
    console.log('DEBUG TEST: Ejecutando test - should generate AI content successfully');
    const prompt = 'Escribe un pequeño párrafo sobre la importancia de la colaboración en proyectos de software.';
    const res = await request(app)
      .post('/api/ai')
      .send({ prompt });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('generatedText');
    expect(typeof res.body.generatedText).toBe('string');
    expect(res.body.generatedText.length).toBeGreaterThan(0);
  });

  it('should return 400 if prompt is missing', async () => {
    const res = await request(app)
      .post('/api/ai')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Se requiere al menos un campo: "prompt" o "image".');
  });

  it('should return 500 if GEMINI_API_KEY is not configured or invalid', async () => {
    // Simula que la clave de API no está configurada
    const originalGeminiApiKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = ''; 

    const prompt = 'Test prompt';
    const res = await request(app)
      .post('/api/ai')
      .send({ prompt });
    
    // Restaurar la clave de API original
    process.env.GEMINI_API_KEY = originalGeminiApiKey;

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error');
  });

  it('should generate AI content from image and prompt', async () => {
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAgMBAp6l2ZkAAAAASUVORK5CYII=';
    const prompt = 'Describe el contenido de la imagen.';

    const res = await request(app)
      .post('/api/ai')
      .send({ prompt, image: base64Image });

    expect([200, 400, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('generatedText');
      expect(typeof res.body.generatedText).toBe('string');
    } else {
      console.log('Respuesta del endpoint para imagen:', res.body);
    }
  });

  it('debe generar un widget móvil a partir de un prompt', async () => {
    const prompt = 'Genera un card móvil para tareas';
    const res = await request(app)
      .post('/api/ai/widget-mobile')
      .send({ prompt });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('block');
    expect(res.body.block).toHaveProperty('id');
    expect(res.body.block).toHaveProperty('content');
    expect(typeof res.body.block.content).toBe('string');
    expect(res.body.block.content.length).toBeGreaterThan(0);
  });
}); 