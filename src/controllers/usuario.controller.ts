import { Request, Response } from 'express';
import prisma from '../prisma';

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      // include: { rol: true }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await prisma.usuario.create({
      data: req.body
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}; 