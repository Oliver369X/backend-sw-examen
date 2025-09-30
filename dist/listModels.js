"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function listModels() {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCzS46fN_OcC28C80j0nsciVnD6n1UdocI'; // Tu clave de API
    if (!GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY no está configurada.');
        return;
    }
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
        const response = await axios_1.default.get(url);
        const models = response.data.models;
        console.log("Modelos disponibles que soportan 'generateContent':");
        for (const model of models) {
            if (model.supportedGenerativeMethods && model.supportedGenerativeMethods.includes('generateContent')) {
                console.log(`- ${model.name}`);
            }
        }
    }
    catch (error) {
        console.error('Error al listar modelos:', error.message || error);
    }
}
listModels();
