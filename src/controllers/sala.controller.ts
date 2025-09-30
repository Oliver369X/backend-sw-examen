import { Request, Response } from 'express';
import prisma from '../prisma';

export const getSalas = async (req: Request, res: Response) => {
  try {
    const salas = await prisma.sala.findMany({
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
  } catch (error) {
    console.error('Error al obtener salas:', error);
    res.status(500).json({ error: 'Error al obtener salas' });
  }
};

export const createSala = async (req: Request, res: Response) => {
  try {
    const sala = await prisma.sala.create({
      data: req.body
    });
    res.status(201).json(sala);
  } catch (error) {
    console.error('Error al crear sala:', error);
    res.status(500).json({ error: 'Error al crear sala' });
  }
};

export const isHostInSala = async (req: Request, res: Response) => {
  const { idSala, idUsuario } = req.params;

  try {
    const sala = await prisma.sala.findUnique({
      where: { id: idSala },
      select: { idHost: true }
    });

    if (!sala) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }

    const ishost = sala.idHost === idUsuario;
    res.json({ ishost });
  } catch (error) {
    console.error('Error al verificar si es host:', error);
    res.status(500).json({ message: 'Error al verificar permisos' });
  }
};

export const getUsuariosInSala = async (req: Request, res: Response) => {
  const { idSala } = req.params;

  try {
    const usuariosSala = await prisma.usuarioSala.findMany({
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
  } catch (error) {
    console.error('Error al obtener usuarios en sala:', error);
    res.status(500).json({ message: 'Error al obtener usuarios de la sala' });
  }
};

export const updateSala = async (req: Request, res: Response) => {
  const { idSala } = req.params;
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
  }

  try {
    // Preparar datos para actualizar
    const updateData: any = {};
    
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

    const salaActualizada = await prisma.sala.update({
      where: { id: idSala },
      data: updateData,
    });
    
    res.json(salaActualizada);
  } catch (error: any) {
    console.error('Error al actualizar sala:', error);
    if (error && error.code === 'P2025') {
      return res.status(404).json({ message: 'Sala no encontrada para actualizar' });
    }
    res.status(500).json({ message: 'Error al actualizar sala' });
  }
};

export const getSalaById = async (req: Request, res: Response) => {
  const { idSala } = req.params;
  try {
    const sala = await prisma.sala.findUnique({
      where: { id: idSala },
      // Incluir campos relevantes si es necesario, por ejemplo, el host o usuarios
      // Por ahora, solo los datos de la sala, incluyendo el 'diagrama'
    });
    if (!sala) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }
    res.json(sala);
  } catch (error: any) {
    console.error('Error al obtener sala por ID:', error);
    res.status(500).json({ message: 'Error al obtener sala por ID' });
  }
};

export const deleteSala = async (req: Request, res: Response) => {
  const { idSala } = req.params;
  const { idUsuario } = req.body; // El usuario que intenta eliminar

  try {
    // Verificar que la sala existe y que el usuario es el host
    const sala = await prisma.sala.findUnique({
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
    await prisma.usuarioSala.deleteMany({
      where: { idSala }
    });

    // Eliminar la sala
    await prisma.sala.delete({
      where: { id: idSala }
    });

    res.json({ message: 'Sala eliminada exitosamente' });
  } catch (error: any) {
    console.error('Error al eliminar sala:', error);
    res.status(500).json({ message: 'Error al eliminar sala' });
  }
};