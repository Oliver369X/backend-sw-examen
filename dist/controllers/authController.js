"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Usar una variable de entorno para la clave secreta
const register = async (req, res) => {
    const { correo, contrasena, nombre } = req.body;
    if (!correo || !contrasena || !nombre) {
        return res.status(400).json({ success: false, message: 'Todos los campos son requeridos: correo, contrasena, nombre.' });
    }
    try {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.usuario.findUnique({ where: { correo } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado.' });
        }
        // Hashear la contraseña
        const hashedPassword = await bcryptjs_1.default.hash(contrasena, 10);
        // Crear el usuario en la base de datos
        const newUser = await prisma.usuario.create({
            data: {
                correo,
                contrasena: hashedPassword,
                nombre,
                // Los campos 'apellidos', 'ci' serán nulos por defecto si no se proporcionan
                // 'idRol', 'sexo', 'telefono' fueron eliminados del esquema
            },
        });
        // Generar un token JWT (opcional, si quieres iniciar sesión automáticamente)
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, correo: newUser.correo }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ success: true, message: 'Usuario registrado exitosamente.', token, data: { id: newUser.id, nombre: newUser.nombre, correo: newUser.correo, ci: newUser.ci } });
    }
    catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al registrar usuario.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { correo, contrasena } = req.body;
    console.log('Intentando iniciar sesión para:', correo);
    console.log('Cuerpo de la solicitud:', req.body);
    if (!correo || !contrasena) {
        console.log('Campos faltantes en la solicitud de login.');
        return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos.' });
    }
    try {
        // Buscar el usuario por correo
        const user = await prisma.usuario.findUnique({ where: { correo } });
        console.log('Usuario encontrado:', user ? user.correo : 'Ninguno');
        if (!user) {
            console.log('Usuario no encontrado para:', correo);
            return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
        }
        // Comparar la contraseña hasheada
        const isPasswordValid = await bcryptjs_1.default.compare(contrasena, user.contrasena);
        console.log('Contraseña válida:', isPasswordValid);
        if (!isPasswordValid) {
            console.log('Contraseña inválida para el usuario:', correo);
            return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
        }
        // Generar un token JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id, correo: user.correo }, JWT_SECRET, { expiresIn: '1h' });
        console.log('Inicio de sesión exitoso para:', user.correo);
        res.status(200).json({ success: true, message: 'Inicio de sesión exitoso.', token, data: { id: user.id, nombre: user.nombre, correo: user.correo, ci: user.ci } });
    }
    catch (error) {
        console.error('Error en el inicio de sesión:', error); // Esto siempre debería loguear un error.
        res.status(500).json({ success: false, message: 'Error interno del servidor al iniciar sesión.' });
    }
};
exports.login = login;
