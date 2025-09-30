import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setupSocketHandlers } from './socket'; // Importa el manejador de sockets

const PORT = process.env.PORT || 4000;

// Crea un servidor HTTP a partir de la aplicación Express
const server = http.createServer(app);

// Configura Socket.IO para usar el servidor HTTP
export const io = new SocketIOServer(server, { // Exporta la instancia de io
  cors: {
    origin: "*", // Permitir todas las conexiones, puedes restringirlo en producción
    methods: ["GET", "POST"]
  }
});

// Configura los manejadores de eventos de Socket.IO
setupSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 