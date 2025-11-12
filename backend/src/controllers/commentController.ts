import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CommentModel } from '../models/Comment';

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ticketId, content, isInternal, attachments } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    if (!ticketId || !content) {
      res.status(400).json({ error: 'Se requieren ID de ticket y contenido' });
      return;
    }

    const comment = await CommentModel.create({
      ticketId,
      userId,
      content,
      isInternal: isInternal || false,
      attachments
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const comments = await CommentModel.findByTicketId(ticketId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await CommentModel.update(id, { content });
    if (!comment) {
      res.status(404).json({ error: 'Comentario no encontrado' });
      return;
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await CommentModel.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Comentario no encontrado' });
      return;
    }

    res.json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

