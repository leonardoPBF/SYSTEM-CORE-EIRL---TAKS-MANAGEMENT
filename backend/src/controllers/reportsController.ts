import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TicketModel } from '../models/Ticket';
import { TicketStatus } from '../types';

// Tendencia de Volumen y Resolución (últimos 30 días)
export const getVolumeTrend = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await TicketModel.getTickets();
    const days = 30;
    const today = new Date();
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const created = tickets.filter(t => {
        const createdDate = new Date(t.createdAt).toISOString().split('T')[0];
        return createdDate === dateStr;
      }).length;
      
      const resolved = tickets.filter(t => {
        if (!t.resolvedAt) return false;
        const resolvedDate = new Date(t.resolvedAt).toISOString().split('T')[0];
        return resolvedDate === dateStr;
      }).length;
      
      data.push({
        date: dateStr,
        created,
        resolved
      });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Incumplimientos SLA (últimos 30 días)
export const getSLABreaches = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await TicketModel.getTickets();
    const days = 30;
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Fin del día actual
    const data = [];
    
    // Definir SLA por prioridad (en horas)
    const slaHours: Record<string, number> = {
      'URGENT': 4,   // 4 horas para urgentes
      'HIGH': 24,    // 24 horas para alta
      'MEDIUM': 72,  // 72 horas (3 días) para media
      'LOW': 168     // 168 horas (7 días) para baja
    };
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(23, 59, 59, 999); // Fin del día
      const dateStr = date.toISOString().split('T')[0];
      
      // Contar tickets que estaban en estado de incumplimiento al final de este día
      // Un ticket está en incumplimiento si:
      // 1. Fue creado antes o en este día
      // 2. Al final de este día, el tiempo transcurrido excede el SLA
      // 3. No está resuelto/cerrado, o se resolvió después del límite
      const breaches = tickets.filter(t => {
        const createdDate = new Date(t.createdAt);
        const ticketPriority = t.priority.toUpperCase();
        const slaLimit = slaHours[ticketPriority] || 72; // Default 72 horas
        
        // El ticket debe haber sido creado antes o en este día
        const createdDateStr = createdDate.toISOString().split('T')[0];
        if (createdDateStr > dateStr) {
          return false;
        }
        
        // Calcular cuándo debería haberse resuelto (fecha de creación + SLA)
        const slaDueDate = new Date(createdDate);
        slaDueDate.setHours(slaDueDate.getHours() + slaLimit);
        const slaDueDateStr = slaDueDate.toISOString().split('T')[0];
        
        // Si el límite del SLA aún no ha pasado en este día, no hay incumplimiento
        if (slaDueDateStr > dateStr) {
          return false;
        }
        
        // Si el ticket está resuelto o cerrado, verificar si se resolvió después del SLA
        if (t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED) {
          if (t.resolvedAt) {
            const resolvedDate = new Date(t.resolvedAt);
            const resolvedDateStr = resolvedDate.toISOString().split('T')[0];
            // Solo cuenta si se resolvió después del límite y antes o en este día
            return resolvedDate > slaDueDate && resolvedDateStr <= dateStr;
          }
          return false;
        }
        
        // Si no está resuelto y ya pasó el límite, cuenta como incumplimiento
        // (el límite ya pasó en este día o antes)
        return slaDueDateStr <= dateStr;
      }).length;
      
      data.push({
        date: dateStr,
        breaches
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error calculando incumplimientos SLA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Tiempo de Primera Respuesta (últimos 30 días)
export const getFirstResponseTime = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await TicketModel.getTickets();
    const days = 30;
    const today = new Date();
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Calcular tiempo de primera respuesta para tickets que fueron asignados ese día
      // El tiempo de primera respuesta es desde creación hasta asignación (o resolución si no hay asignación)
      const ticketsForDay = tickets.filter(t => {
        // Tickets que fueron asignados en este día
        if (t.assignedAt) {
          const assignedDate = new Date(t.assignedAt).toISOString().split('T')[0];
          return assignedDate === dateStr;
        }
        // O tickets que fueron resueltos en este día pero no tienen fecha de asignación
        if (t.resolvedAt && !t.assignedAt) {
          const resolvedDate = new Date(t.resolvedAt).toISOString().split('T')[0];
          return resolvedDate === dateStr;
        }
        return false;
      });
      
      let medianMinutes = 0;
      if (ticketsForDay.length > 0) {
        const responseTimes = ticketsForDay.map(t => {
          const created = new Date(t.createdAt).getTime();
          // Usar assignedAt si existe, sino usar resolvedAt, sino usar updatedAt
          const responseTime = t.assignedAt 
            ? new Date(t.assignedAt).getTime()
            : t.resolvedAt 
            ? new Date(t.resolvedAt).getTime()
            : new Date(t.updatedAt).getTime();
          return (responseTime - created) / (1000 * 60); // Convertir a minutos
        }).filter(time => time >= 0); // Filtrar tiempos negativos (datos inconsistentes)
        
        if (responseTimes.length > 0) {
          // Calcular mediana
          responseTimes.sort((a, b) => a - b);
          const mid = Math.floor(responseTimes.length / 2);
          medianMinutes = responseTimes.length % 2 === 0
            ? Math.round((responseTimes[mid - 1] + responseTimes[mid]) / 2)
            : Math.round(responseTimes[mid]);
        }
      }
      
      data.push({
        date: dateStr,
        medianMinutes
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error calculando tiempo de primera respuesta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Tiempo de Resolución (últimos 30 días)
export const getResolutionTime = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await TicketModel.getTickets();
    const days = 30;
    const today = new Date();
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Calcular tiempo promedio de resolución para tickets resueltos ese día
      const resolvedTickets = tickets.filter(t => {
        if (!t.resolvedAt) return false;
        const resolvedDate = new Date(t.resolvedAt).toISOString().split('T')[0];
        return resolvedDate === dateStr;
      });
      
      let avgHours = 0;
      if (resolvedTickets.length > 0) {
        const resolutionTimes = resolvedTickets.map(t => {
          const created = new Date(t.createdAt).getTime();
          const resolved = new Date(t.resolvedAt!).getTime();
          return (resolved - created) / (1000 * 60 * 60); // Convertir a horas
        }).filter(time => time >= 0); // Filtrar tiempos negativos
        
        if (resolutionTimes.length > 0) {
          const totalHours = resolutionTimes.reduce((sum, time) => sum + time, 0);
          avgHours = Math.round((totalHours / resolutionTimes.length) * 10) / 10;
        }
      }
      
      data.push({
        date: dateStr,
        avgHours
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error calculando tiempo de resolución:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

