import axios from 'axios';

async function listModels() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCzS46fN_OcC28C80j0nsciVnD6n1UdocI'; // Tu clave de API

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY no está configurada.');
    return;
  }

  try {
    const url: string = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    const response = await axios.get(url);
    const models = response.data.models;

    console.log("Modelos disponibles que soportan 'generateContent':");
    for (const model of models) {
      if (model.supportedGenerativeMethods && model.supportedGenerativeMethods.includes('generateContent')) {
        console.log(`- ${model.name}`);
      }
    }
  } catch (error: any) {
    console.error('Error al listar modelos:', error.message || error);
  }
}

listModels(); 