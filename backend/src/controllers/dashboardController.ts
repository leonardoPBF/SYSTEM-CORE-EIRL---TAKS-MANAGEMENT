import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TicketModel } from '../models/Ticket';
import { AgentModel } from '../models/Agent';
import { AgentStatus, TicketStatus } from '../types';

export const getDashboardMetrics = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = TicketModel.getTickets();
    const agents = AgentModel.getAgents();

    const agentsOnline = agents.filter(a => a.status === AgentStatus.ONLINE).length;
    const unassignedTickets = tickets.filter(
      t => !t.assignedTo && t.status !== TicketStatus.CLOSED
    ).length;
    
    const queuesBreachingSoon = 5; // Placeholder - would calculate based on SLA
    const avgLoadPerAgent = agentsOnline > 0 
      ? Math.round((tickets.filter(t => t.assignedTo && t.status !== TicketStatus.CLOSED).length / agentsOnline) * 10) / 10
      : 0;

    const newTickets = tickets.filter(
      t => t.status === TicketStatus.OPEN || t.status === TicketStatus.ASSIGNED
    ).length;
    
    const resolvedTickets = tickets.filter(
      t => t.status === TicketStatus.RESOLVED
    ).length;
    
    const backlog = tickets.filter(
      t => t.status !== TicketStatus.CLOSED && t.status !== TicketStatus.RESOLVED
    ).length;

    res.json({
      agentsOnline,
      unassignedTickets,
      queuesBreachingSoon,
      avgLoadPerAgent,
      newTickets,
      resolvedTickets,
      backlog
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

