import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TicketModel } from '../models/Ticket';
import { AgentModel } from '../models/Agent';
import { AgentStatus, TicketStatus } from '../types';

export const getDashboardMetrics = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await TicketModel.getTickets();
    const agents = await AgentModel.getAgents();

    const agentsOnline = agents.filter(a => a.status === AgentStatus.ONLINE).length;
    const unassignedTickets = tickets.filter(
      t => !t.assignedTo && t.status !== TicketStatus.CLOSED && t.status !== TicketStatus.RESOLVED
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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actividad de asignación (asignados vs reasignados por día)
export const getAssignmentActivity = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await TicketModel.getTickets();
    
    // Últimos 7 días
    const days = 7;
    const today = new Date();
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const assigned = tickets.filter(t => {
        if (!t.assignedAt) return false;
        const assignedDate = new Date(t.assignedAt).toISOString().split('T')[0];
        return assignedDate === dateStr;
      }).length;
      
      // Reasignados: tickets que tienen assignedAt pero fueron actualizados después
      const reassigned = tickets.filter(t => {
        if (!t.assignedAt || !t.updatedAt) return false;
        const assignedDate = new Date(t.assignedAt).toISOString().split('T')[0];
        const updatedDate = new Date(t.updatedAt).toISOString().split('T')[0];
        return assignedDate !== updatedDate && updatedDate === dateStr && t.assignedTo;
      }).length;
      
      data.push({
        date: dateStr,
        assigned,
        reassigned
      });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Capacidad del equipo (disponibles vs en riesgo)
export const getTeamCapacity = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const agents = await AgentModel.getAgents();
    const tickets = await TicketModel.getTickets();
    
    let available = 0;
    let atRisk = 0;
    
    agents.forEach(agent => {
      const agentTickets = tickets.filter(t => t.assignedTo === agent.id && t.status !== TicketStatus.CLOSED && t.status !== TicketStatus.RESOLVED);
      const loadPercentage = (agentTickets.length / agent.maxTickets) * 100;
      
      if (loadPercentage < 80) {
        available++;
      } else if (loadPercentage >= 80 && loadPercentage < 100) {
        atRisk++;
      }
    });
    
    res.json({
      available,
      atRisk,
      total: agents.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Mezcla de prioridades sin asignar
export const getUnassignedPriorities = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await TicketModel.getTickets();
    
    const unassigned = tickets.filter(t => !t.assignedTo && t.status !== TicketStatus.CLOSED && t.status !== TicketStatus.RESOLVED);
    
    const urgent = unassigned.filter(t => t.priority === 'URGENT').length;
    const high = unassigned.filter(t => t.priority === 'HIGH').length;
    const medium = unassigned.filter(t => t.priority === 'MEDIUM').length;
    const low = unassigned.filter(t => t.priority === 'LOW').length;
    
    res.json({
      urgent,
      high,
      medium,
      low,
      total: unassigned.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Tickets sin asignar (tabla)
export const getUnassignedTickets = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await TicketModel.getTickets();
    const unassigned = tickets
      .filter(t => !t.assignedTo && t.status !== TicketStatus.CLOSED && t.status !== TicketStatus.RESOLVED)
      .sort((a, b) => {
        // Ordenar por prioridad: Urgent > High > Medium > Low
        const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      })
      .slice(0, 10) // Top 10
      .map(t => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        subject: t.subject,
        priority: t.priority,
        status: t.status,
        createdAt: t.createdAt
      }));
    
    res.json(unassigned);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
