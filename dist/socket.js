"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado:', socket.id);
        // Evento para unirse a una sala
        socket.on('join-room', async (room) => {
            socket.join(room);
            console.log(`Cliente ${socket.id} se unió a la sala: ${room}`);
            // Opcional: Notificar a otros en la sala que un usuario se unió
            io.to(room).emit('user-joined', { userId: socket.id, message: `Usuario ${socket.id} se ha unido.` });
            // Cargar el diagrama existente de la base de datos al unirse
            try {
                const sala = await prisma.sala.findUnique({
                    where: { id: room },
                    select: { diagrama: true }
                });
                if (sala) {
                    let diagramData = sala.diagrama;
                    // Si es string, parsearlo; si ya es objeto, usarlo directamente
                    if (typeof diagramData === 'string') {
                        diagramData = JSON.parse(diagramData);
                    }
                    console.log(`📤 Enviando diagrama de sala ${room}:`, diagramData);
                    // SIEMPRE enviar el diagrama (incluso si está vacío)
                    socket.emit('diagram-loaded', diagramData);
                }
                else {
                    console.error(`❌ Sala ${room} no encontrada en la base de datos`);
                }
            }
            catch (error) {
                console.error('Error al cargar el diagrama para la sala:', room, error);
            }
        });
        // Evento para salir de una sala
        socket.on('leave-room', (room) => {
            socket.leave(room);
            console.log(`Cliente ${socket.id} salió de la sala: ${room}`);
            io.to(room).emit('user-left', { userId: socket.id, message: `Usuario ${socket.id} ha salido.` });
        });
        // Evento para actualizar el diagrama y persistirlo
        socket.on('diagram-update', async (data, room) => {
            const userName = data.userInfo?.userName || 'desconocido';
            console.log(`🔄 Actualización de diagrama en sala ${room} por ${userName}`);
            // Emitir la actualización a todos los clientes en la misma sala, excepto al remitente
            socket.to(room).emit('diagram-update', data);
            // Persistir el diagrama en la base de datos
            try {
                // Prisma espera un objeto para campos tipo Json, no un string
                // Eliminar metadatos que no son parte del diagrama
                const { userInfo, ...diagramData } = data;
                const result = await prisma.sala.update({
                    where: { id: room },
                    data: { diagrama: diagramData } // Guardar como objeto directamente
                });
                console.log(`💾 Diagrama guardado en sala ${room} - Clases: ${diagramData.classes?.length || 0}`);
            }
            catch (error) {
                console.error(`❌ Error al persistir el diagrama en sala ${room}:`, error);
            }
        });
        // Evento para actualizar el estado de la página del usuario
        socket.on('user-update', (data, room) => {
            console.log(`Actualización de usuario en sala ${room}:`, data);
            // Emitir la actualización a todos los clientes en la misma sala, excepto al remitente
            socket.to(room).emit('user-update', data);
        });
        // Evento de solicitud de datos de página (ej. para un nuevo usuario que se une)
        socket.on('requestPageData', (room, requesterSocketId) => {
            console.log(`Solicitud de datos de página de ${requesterSocketId} en sala ${room}`);
            // Aquí, podrías enviar la página actual o el estado completo del editor a la solicitud
            // Esto requeriría una lógica más avanzada para obtener el estado del editor de un cliente específico
            // o del estado persistido. Por ahora, es un placeholder.
        });
        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
            // Aquí podrías manejar la eliminación del usuario de las salas si lo deseas
        });
    });
};
exports.setupSocketHandlers = setupSocketHandlers;
