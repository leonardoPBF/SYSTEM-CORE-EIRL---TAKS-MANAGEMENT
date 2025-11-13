import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TicketModel } from '../models/Ticket';
import { TicketStatus, TicketPriority, TicketSource } from '../types';

export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      subject,
      description,
      clientId,
      priority,
      type,
      source,
      tags,
      queue
    } = req.body;

    if (!subject || !description || !clientId) {
      res.status(400).json({ error: 'Se requieren asunto, descripción y ID de cliente' });
      return;
    }

    // El ticket lo crea el usuario autenticado (Cliente)
    const createdBy = req.user?.userId || clientId;

    const ticket = await TicketModel.create({
      subject,
      description,
      clientId,
      createdBy,
      priority: priority || TicketPriority.MEDIUM,
      status: TicketStatus.OPEN,
      type: type || 'General',
      source: source || TicketSource.PORTAL,
      tags: tags || [],
      queue
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId, assignedTo, status, priority, queue } = req.query;

    const tickets = await TicketModel.findAll({
      clientId: clientId as string,
      assignedTo: assignedTo as string,
      status: status as TicketStatus,
      priority: priority as TicketPriority,
      queue: queue as string
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getTicketById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ticket = await TicketModel.findById(id);

    if (!ticket) {
      res.status(404).json({ error: 'Ticket no encontrado' });
      return;
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const ticket = await TicketModel.update(id, updateData);
    if (!ticket) {
      res.status(404).json({ error: 'Ticket no encontrado' });
      return;
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await TicketModel.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Ticket no encontrado' });
      return;
    }

    res.json({ message: 'Ticket eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const assignTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      res.status(400).json({ error: 'Se requiere asignar a un agente' });
      return;
    }

    // Solo el Director TI puede asignar tickets
    const reviewedBy = req.user?.userId;

    const ticket = await TicketModel.update(id, {
      assignedTo,
      reviewedBy,
      reviewedAt: new Date(),
      assignedAt: new Date(),
      status: TicketStatus.ASSIGNED
    });

    if (!ticket) {
      res.status(404).json({ error: 'Ticket no encontrado' });
      return;
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getUnassignedTickets = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await TicketModel.getUnassigned();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const reviewTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // El Director TI revisa el ticket y cambia el estado a PENDING_DIRECTOR
    const reviewedBy = req.user?.userId;

    const ticket = await TicketModel.update(id, {
      reviewedBy,
      reviewedAt: new Date(),
      status: TicketStatus.PENDING_DIRECTOR
    });

    if (!ticket) {
      res.status(404).json({ error: 'Ticket no encontrado' });
      return;
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

