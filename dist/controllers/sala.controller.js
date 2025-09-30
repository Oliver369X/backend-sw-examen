"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSala = exports.getSalaById = exports.updateSala = exports.getUsuariosInSala = exports.isHostInSala = exports.createSala = exports.getSalas = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getSalas = async (req, res) => {
    try {
        const salas = await prisma_1.default.sala.findMany({
            include: {
                host: { select: { id: true, ci: true, nombre: true, correo: true } },
                usuarios: {
                    include: {
                        usuario: { select: { id: true, ci: true, nombre: true, correo: true } }
                    }
                }
            }
        });
        res.json(salas);
    }
    catch (error) {
        console.error('Error al obtener salas:', error);
        res.status(500).json({ error: 'Error al obtener salas' });
    }
};
exports.getSalas = getSalas;
const createSala = async (req, res) => {
    try {
        const sala = await prisma_1.default.sala.create({
            data: req.body
        });
        res.status(201).json(sala);
    }
    catch (error) {
        console.error('Error al crear sala:', error);
        res.status(500).json({ error: 'Error al crear sala' });
    }
};
exports.createSala = createSala;
const isHostInSala = async (req, res) => {
    const { idSala, idUsuario } = req.params;
    try {
        const sala = await prisma_1.default.sala.findUnique({
            where: { id: idSala },
            select: { idHost: true }
        });
        if (!sala) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        const ishost = sala.idHost === idUsuario;
        res.json({ ishost });
    }
    catch (error) {
        console.error('Error al verificar si es host:', error);
        res.status(500).json({ message: 'Error al verificar permisos' });
    }
};
exports.isHostInSala = isHostInSala;
const getUsuariosInSala = async (req, res) => {
    const { idSala } = req.params;
    try {
        const usuariosSala = await prisma_1.default.usuarioSala.findMany({
            where: { idSala: idSala },
            include: {
                usuario: {
                    select: { id: true, ci: true, nombre: true, correo: true }
                }
            }
        });
        const usuarios = usuariosSala.map(us => ({
            idUsuario: us.usuario.id,
            ciUsuario: us.usuario.ci,
            nombreUsuario: us.usuario.nombre,
            correoUsuario: us.usuario.correo,
            rol: us.rol
        }));
        res.json(usuarios);
    }
    catch (error) {
        console.error('Error al obtener usuarios en sala:', error);
        res.status(500).json({ message: 'Error al obtener usuarios de la sala' });
    }
};
exports.getUsuariosInSala = getUsuariosInSala;
const updateSala = async (req, res) => {
    const { idSala } = req.params;
    const { data } = req.body;
    if (!data) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
    }
    try {
        // Preparar datos para actualizar
        const updateData = {};
        // Si data contiene nombre/descripción, actualizar info de la sala
        if (data.nombre !== undefined) {
            updateData.nombre = data.nombre;
        }
        if (data.descripcion !== undefined) {
            updateData.descripcion = data.descripcion;
        }
        // Si data es un diagrama completo (tiene classes, relationships, etc.), actualizar diagrama
        if (data.classes || data.relationships || data.interfaces) {
            updateData.diagrama = data;
        }
        const salaActualizada = await prisma_1.default.sala.update({
            where: { id: idSala },
            data: updateData,
        });
        res.json(salaActualizada);
    }
    catch (error) {
        console.error('Error al actualizar sala:', error);
        if (error && error.code === 'P2025') {
            return res.status(404).json({ message: 'Sala no encontrada para actualizar' });
        }
        res.status(500).json({ message: 'Error al actualizar sala' });
    }
};
exports.updateSala = updateSala;
const getSalaById = async (req, res) => {
    const { idSala } = req.params;
    try {
        const sala = await prisma_1.default.sala.findUnique({
            where: { id: idSala },
            // Incluir campos relevantes si es necesario, por ejemplo, el host o usuarios
            // Por ahora, solo los datos de la sala, incluyendo el 'diagrama'
        });
        if (!sala) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        res.json(sala);
    }
    catch (error) {
        console.error('Error al obtener sala por ID:', error);
        res.status(500).json({ message: 'Error al obtener sala por ID' });
    }
};
exports.getSalaById = getSalaById;
const deleteSala = async (req, res) => {
    const { idSala } = req.params;
    const { idUsuario } = req.body; // El usuario que intenta eliminar
    try {
        // Verificar que la sala existe y que el usuario es el host
        const sala = await prisma_1.default.sala.findUnique({
            where: { id: idSala },
            select: { idHost: true }
        });
        if (!sala) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        // Solo el host puede eliminar la sala
        if (sala.idHost !== idUsuario) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar esta sala' });
        }
        // Eliminar usuarios asociados primero (relación)
        await prisma_1.default.usuarioSala.deleteMany({
            where: { idSala }
        });
        // Eliminar la sala
        await prisma_1.default.sala.delete({
            where: { id: idSala }
        });
        res.json({ message: 'Sala eliminada exitosamente' });
    }
    catch (error) {
        console.error('Error al eliminar sala:', error);
        res.status(500).json({ message: 'Error al eliminar sala' });
    }
};
exports.deleteSala = deleteSala;
