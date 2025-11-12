import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CommentModel } from '../models/Comment';

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ticketId, content, isInternal, attachments } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!ticketId || !content) {
      res.status(400).json({ error: 'ticketId and content are required' });
      return;
    }

    const comment = CommentModel.create({
      ticketId,
      userId,
      content,
      isInternal: isInternal || false,
      attachments
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const comments = CommentModel.findByTicketId(ticketId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = CommentModel.update(id, { content });
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = CommentModel.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

