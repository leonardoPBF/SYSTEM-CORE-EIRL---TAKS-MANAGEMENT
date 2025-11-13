import { eq, and, isNull, ne } from 'drizzle-orm';
import { db } from '../db';
import { tickets } from '../db/schema';
import { Ticket as ITicket, TicketStatus, TicketPriority } from '../types';

export class TicketModel {
  private static ticketNumber = 4900;

  static async create(data: Omit<ITicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): Promise<ITicket> {
    const ticketNumber = `#${++this.ticketNumber}`;
    
    const [ticket] = await db.insert(tickets).values({
      ticketNumber,
      subject: data.subject,
      description: data.description,
      clientId: data.clientId,
      assignedTo: data.assignedTo,
      priority: data.priority.toLowerCase() as 'low' | 'medium' | 'high' | 'urgent',
      status: data.status.toLowerCase().replace('_', '_') as 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed',
      type: data.type,
      source: data.source.toLowerCase() as 'email' | 'chat' | 'phone' | 'portal' | 'api',
      tags: data.tags,
      queue: data.queue,
      sla: data.sla,
      dueDate: data.dueDate,
    }).returning();

    return {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      description: ticket.description,
      clientId: ticket.clientId,
      assignedTo: ticket.assignedTo || undefined,
      priority: ticket.priority.toUpperCase() as TicketPriority,
      status: ticket.status.toUpperCase().replace('_', '_') as TicketStatus,
      type: ticket.type || '',
      source: ticket.source.toUpperCase() as any,
      tags: ticket.tags || [],
      queue: ticket.queue || undefined,
      sla: ticket.sla || undefined,
      dueDate: ticket.dueDate || undefined,
      resolvedAt: ticket.resolvedAt || undefined,
      closedAt: ticket.closedAt || undefined,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  static async findById(id: string): Promise<ITicket | null> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1);
    
    if (!ticket) return null;

    return this.mapTicket(ticket);
  }

  static async findByTicketNumber(ticketNumber: string): Promise<ITicket | null> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.ticketNumber, ticketNumber)).limit(1);
    
    if (!ticket) return null;

    return this.mapTicket(ticket);
  }

  static async findAll(filters?: {
    clientId?: string;
    assignedTo?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    queue?: string;
  }): Promise<ITicket[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.clientId) {
        conditions.push(eq(tickets.clientId, filters.clientId));
      }
      if (filters.assignedTo) {
        conditions.push(eq(tickets.assignedTo, filters.assignedTo));
      }
      if (filters.status) {
        conditions.push(eq(tickets.status, filters.status.toLowerCase().replace('_', '_') as any));
      }
      if (filters.priority) {
        conditions.push(eq(tickets.priority, filters.priority.toLowerCase() as any));
      }
      if (filters.queue) {
        conditions.push(eq(tickets.queue, filters.queue));
      }
    }

    const query = conditions.length > 0
      ? db.select().from(tickets).where(and(...conditions))
      : db.select().from(tickets);

    const allTickets = await query;
    return allTickets.map(t => this.mapTicket(t))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async update(id: string, data: Partial<Omit<ITicket, 'id' | 'ticketNumber' | 'createdAt'>>): Promise<ITicket | null> {
    const updateData: any = { ...data, updatedAt: new Date() };
    
    if (data.priority) {
      updateData.priority = data.priority.toLowerCase();
    }
    if (data.status) {
      updateData.status = data.status.toLowerCase().replace('_', '_');
    }
    if (data.source) {
      updateData.source = data.source.toLowerCase();
    }

    if (data.status === TicketStatus.RESOLVED && !updateData.resolvedAt) {
      updateData.resolvedAt = new Date();
    }
    if (data.status === TicketStatus.CLOSED && !updateData.closedAt) {
      updateData.closedAt = new Date();
    }

    const [updated] = await db.update(tickets)
      .set(updateData)
      .where(eq(tickets.id, id))
      .returning();

    if (!updated) return null;

    return this.mapTicket(updated);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(tickets).where(eq(tickets.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async getUnassigned(): Promise<ITicket[]> {
    const unassignedTickets = await db.select()
      .from(tickets)
      .where(and(isNull(tickets.assignedTo), ne(tickets.status, 'closed')));
    
    return unassignedTickets.map(t => this.mapTicket(t))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async getTickets(): Promise<ITicket[]> {
    const results = await db.select().from(tickets);
    return results.map(t => this.mapTicket(t));
  }

  private static mapTicket(ticket: any): ITicket {
    return {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      description: ticket.description,
      clientId: ticket.clientId,
      assignedTo: ticket.assignedTo || undefined,
      priority: ticket.priority.toUpperCase() as TicketPriority,
      status: ticket.status.toUpperCase().replace('_', '_') as TicketStatus,
      type: ticket.type || '',
      source: ticket.source.toUpperCase() as any,
      tags: ticket.tags || [],
      queue: ticket.queue || undefined,
      sla: ticket.sla || undefined,
      dueDate: ticket.dueDate || undefined,
      resolvedAt: ticket.resolvedAt || undefined,
      closedAt: ticket.closedAt || undefined,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}
