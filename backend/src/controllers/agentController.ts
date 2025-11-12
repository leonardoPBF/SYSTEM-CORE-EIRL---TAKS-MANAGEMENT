import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AgentModel } from '../models/Agent';
import { AgentStatus } from '../types';

export const createAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, team, status, maxTickets } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'Se requiere ID de usuario' });
      return;
    }

    const agent = await AgentModel.create({
      userId,
      team,
      status: status || AgentStatus.OFFLINE,
      maxTickets: maxTickets || 10
    });

    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAgents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { team, status } = req.query;

    const agents = await AgentModel.findAll({
      team: team as string,
      status: status as AgentStatus
    });

    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAgentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const agent = await AgentModel.findById(id);

    if (!agent) {
      res.status(404).json({ error: 'Agente no encontrado' });
      return;
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const agent = await AgentModel.update(id, updateData);
    if (!agent) {
      res.status(404).json({ error: 'Agente no encontrado' });
      return;
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await AgentModel.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Agente no encontrado' });
      return;
    }

    res.json({ message: 'Agente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

