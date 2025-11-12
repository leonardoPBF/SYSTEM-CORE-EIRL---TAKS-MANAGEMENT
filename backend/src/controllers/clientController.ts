import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ClientModel } from '../models/Client';

export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, company, phone, address, segment, status } = req.body;

    if (!userId || !company) {
      res.status(400).json({ error: 'userId and company are required' });
      return;
    }

    const client = ClientModel.create({
      userId,
      company,
      phone,
      address,
      segment,
      status: status || 'Active'
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, segment } = req.query;

    const clients = ClientModel.findAll({
      status: status as string,
      segment: segment as string
    });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClientById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const client = ClientModel.findById(id);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const client = ClientModel.update(id, updateData);
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = ClientModel.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

