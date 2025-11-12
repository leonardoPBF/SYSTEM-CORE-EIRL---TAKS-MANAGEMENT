import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ClientModel } from '../models/Client';

export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, company, phone, address, segment, status } = req.body;

    if (!userId || !company) {
      res.status(400).json({ error: 'Se requieren ID de usuario y empresa' });
      return;
    }

    const client = await ClientModel.create({
      userId,
      company,
      phone,
      address,
      segment,
      status: status || 'Active'
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, segment } = req.query;

    const clients = await ClientModel.findAll({
      status: status as string,
      segment: segment as string
    });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getClientById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const client = await ClientModel.findById(id);

    if (!client) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const client = await ClientModel.update(id, updateData);
    if (!client) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await ClientModel.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

