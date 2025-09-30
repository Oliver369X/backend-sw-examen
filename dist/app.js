"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const sala_routes_1 = __importDefault(require("./routes/sala.routes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Aumentar el límite para JSON payloads y URL-encoded payloads
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API Diagramador UML funcionando correctamente',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});
app.use('/api/usuarios', usuario_routes_1.default);
app.use('/api/salas', sala_routes_1.default);
app.use('/auth', authRoutes_1.default);
app.use('/api/ai', ai_routes_1.default);
exports.default = app;
