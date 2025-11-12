import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AgentModel } from '../models/Agent';
import { AgentStatus } from '../types';

export const createAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, team, status, maxTickets } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const agent = AgentModel.create({
      userId,
      team,
      status: status || AgentStatus.OFFLINE,
      maxTickets: maxTickets || 10
    });

    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAgents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { team, status } = req.query;

    const agents = AgentModel.findAll({
      team: team as string,
      status: status as AgentStatus
    });

    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAgentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const agent = AgentModel.findById(id);

    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const agent = AgentModel.update(id, updateData);
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = AgentModel.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

