import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  // Limpiar la base de datos antes de cada prueba
  beforeAll(async () => {
    // Eliminar salas primero (por foreign key constraint)
    await prisma.usuarioSala.deleteMany({});
    await prisma.sala.deleteMany({});
    // Luego eliminar usuarios de prueba
    await prisma.usuario.deleteMany({ where: { correo: { contains: '@test.com' } } });
  });

  afterAll(async () => {
    // Desconectar Prisma al finalizar las pruebas
    await prisma.$disconnect();
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        correo: 'test.register@test.com',
        contrasena: 'testpassword',
        nombre: 'Test User'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Usuario registrado exitosamente.');
    expect(res.body.token).toBeDefined();
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.correo).toEqual('test.register@test.com');
    expect(res.body.data.nombre).toEqual('Test User');
  });

  it('should not register a user with missing fields', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        correo: 'missing.fields@test.com'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Todos los campos son requeridos: correo, contrasena, nombre.');
  });

  it('should not register a user with an already registered email', async () => {
    // Primero, registramos al usuario
    await request(app)
      .post('/auth/register')
      .send({
        correo: 'existing.user@test.com',
        contrasena: 'password123',
        nombre: 'Existing User'
      });

    // Intentamos registrarlo de nuevo con el mismo correo
    const res = await request(app)
      .post('/auth/register')
      .send({
        correo: 'existing.user@test.com',
        contrasena: 'anotherpassword',
        nombre: 'Another User'
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('El correo electrónico ya está registrado.');
  });

  it('should login an existing user successfully', async () => {
    // Primero, registramos un usuario para poder iniciar sesión
    const registerRes = await request(app)
      .post('/auth/register')
      .send({
        correo: 'test.login@test.com',
        contrasena: 'loginpassword',
        nombre: 'Login User'
      });

    expect(registerRes.statusCode).toEqual(201);

    const res = await request(app)
      .post('/auth/login')
      .send({
        correo: 'test.login@test.com',
        contrasena: 'loginpassword'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Inicio de sesión exitoso.');
    expect(res.body.token).toBeDefined();
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.correo).toEqual('test.login@test.com');
    expect(res.body.data.nombre).toEqual('Login User');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        correo: 'nonexistent@test.com',
        contrasena: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Credenciales inválidas.');
  });

  it('should not login with missing fields', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        correo: 'test@test.com'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Correo y contraseña son requeridos.');
  });
}); 