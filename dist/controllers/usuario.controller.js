"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsuario = exports.getUsuarios = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma_1.default.usuario.findMany({
        // include: { rol: true }
        });
        res.json(usuarios);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};
exports.getUsuarios = getUsuarios;
const createUsuario = async (req, res) => {
    try {
        const usuario = await prisma_1.default.usuario.create({
            data: req.body
        });
        res.status(201).json(usuario);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};
exports.createUsuario = createUsuario;
