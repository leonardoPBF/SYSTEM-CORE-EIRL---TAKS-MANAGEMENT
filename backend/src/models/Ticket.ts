import { v4 as uuidv4 } from 'uuid';
import { Ticket as ITicket, TicketStatus, TicketPriority } from '../types';

export class TicketModel {
  private static tickets: ITicket[] = [];
  private static ticketCounter = 4900;

  static create(data: Omit<ITicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): ITicket {
    const ticket: ITicket = {
      id: uuidv4(),
      ticketNumber: `#${++this.ticketCounter}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tickets.push(ticket);
    return ticket;
  }

  static findById(id: string): ITicket | null {
    return this.tickets.find(t => t.id === id) || null;
  }

  static findByTicketNumber(ticketNumber: string): ITicket | null {
    return this.tickets.find(t => t.ticketNumber === ticketNumber) || null;
  }

  static findAll(filters?: {
    clientId?: string;
    assignedTo?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    queue?: string;
  }): ITicket[] {
    let result = [...this.tickets];

    if (filters) {
      if (filters.clientId) {
        result = result.filter(t => t.clientId === filters.clientId);
      }
      if (filters.assignedTo) {
        result = result.filter(t => t.assignedTo === filters.assignedTo);
      }
      if (filters.status) {
        result = result.filter(t => t.status === filters.status);
      }
      if (filters.priority) {
        result = result.filter(t => t.priority === filters.priority);
      }
      if (filters.queue) {
        result = result.filter(t => t.queue === filters.queue);
      }
    }

    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static update(id: string, data: Partial<Omit<ITicket, 'id' | 'ticketNumber' | 'createdAt'>>): ITicket | null {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.tickets[index] = {
      ...this.tickets[index],
      ...data,
      updatedAt: new Date()
    };

    if (data.status === TicketStatus.RESOLVED && !this.tickets[index].resolvedAt) {
      this.tickets[index].resolvedAt = new Date();
    }
    if (data.status === TicketStatus.CLOSED && !this.tickets[index].closedAt) {
      this.tickets[index].closedAt = new Date();
    }

    return this.tickets[index];
  }

  static delete(id: string): boolean {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.tickets.splice(index, 1);
    return true;
  }

  static getUnassigned(): ITicket[] {
    return this.tickets
      .filter(t => !t.assignedTo && t.status !== TicketStatus.CLOSED)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static getTickets(): ITicket[] {
    return this.tickets;
  }
}

