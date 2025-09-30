"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_1 = require("./socket"); // Importa el manejador de sockets
const PORT = process.env.PORT || 4000;
// Crea un servidor HTTP a partir de la aplicación Express
const server = http_1.default.createServer(app_1.default);
// Configura Socket.IO para usar el servidor HTTP
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Permitir todas las conexiones, puedes restringirlo en producción
        methods: ["GET", "POST"]
    }
});
// Configura los manejadores de eventos de Socket.IO
(0, socket_1.setupSocketHandlers)(exports.io);
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
