import { eq, and, or, ne } from 'drizzle-orm';
import { db } from '../db';
import { clients, users, tickets } from '../db/schema';
import { Client as IClient } from '../types';

export class ClientModel {
  static async create(data: Omit<IClient, 'id' | 'createdAt' | 'updatedAt'>): Promise<IClient> {
    const [client] = await db.insert(clients).values({
      userId: data.userId,
      company: data.company,
      phone: data.phone,
      address: data.address,
      segment: data.segment,
      status: data.status || 'Active',
    }).returning();

    return {
      id: client.id,
      userId: client.userId,
      company: client.company,
      phone: client.phone || undefined,
      address: client.address || undefined,
      segment: client.segment || undefined,
      status: client.status as 'Active' | 'At Risk' | 'Inactive',
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  static async findById(id: string): Promise<IClient | null> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
    
    if (!client) return null;

    return {
      id: client.id,
      userId: client.userId,
      company: client.company,
      phone: client.phone || undefined,
      address: client.address || undefined,
      segment: client.segment || undefined,
      status: client.status as 'Active' | 'At Risk' | 'Inactive',
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  static async findByUserId(userId: string): Promise<IClient | null> {
    const [client] = await db.select().from(clients).where(eq(clients.userId, userId)).limit(1);
    
    if (!client) return null;

    return {
      id: client.id,
      userId: client.userId,
      company: client.company,
      phone: client.phone || undefined,
      address: client.address || undefined,
      segment: client.segment || undefined,
      status: client.status as 'Active' | 'At Risk' | 'Inactive',
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  static async findAll(filters?: {
    status?: string;
    segment?: string;
  }): Promise<any[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.status) {
        conditions.push(eq(clients.status, filters.status));
      }
      if (filters.segment) {
        conditions.push(eq(clients.segment, filters.segment));
      }
    }

    // Obtener clientes con JOIN a usuarios
    const allClients = await db
      .select({
        id: clients.id,
        userId: clients.userId,
        company: clients.company,
        phone: clients.phone,
        address: clients.address,
        segment: clients.segment,
        status: clients.status,
        createdAt: clients.createdAt,
        updatedAt: clients.updatedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(clients)
      .innerJoin(users, eq(clients.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Obtener conteo de tickets abiertos y prioridad más alta para cada cliente
    const clientsWithTickets = await Promise.all(
      allClients.map(async (client) => {
        const openTickets = await db
          .select()
          .from(tickets)
          .where(
            and(
              eq(tickets.clientId, client.id),
              or(
                eq(tickets.status, 'open'),
                eq(tickets.status, 'assigned'),
                eq(tickets.status, 'in_progress'),
                eq(tickets.status, 'pending_director')
              )
            )
          );

        const openTicketsCount = openTickets.length;
        
        // Determinar prioridad más alta
        let highestPriority: 'Low' | 'Medium' | 'High' = 'Low';
        if (openTickets.some(t => t.priority === 'urgent')) {
          highestPriority = 'High';
        } else if (openTickets.some(t => t.priority === 'high')) {
          highestPriority = 'High';
        } else if (openTickets.some(t => t.priority === 'medium')) {
          highestPriority = 'Medium';
        }

        return {
          id: client.id,
          userId: client.userId,
          name: client.userName,
          email: client.userEmail,
          company: client.company,
          phone: client.phone || undefined,
          address: client.address || undefined,
          segment: client.segment || undefined,
          status: client.status as 'Active' | 'At Risk' | 'Inactive',
          openTickets: openTicketsCount,
          priority: highestPriority,
          createdAt: client.createdAt,
          updatedAt: client.updatedAt,
        };
      })
    );

    return clientsWithTickets.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  static async update(id: string, data: Partial<Omit<IClient, 'id' | 'createdAt'>>): Promise<IClient | null> {
    const updateData = { ...data, updatedAt: new Date() };
    
    const [updated] = await db.update(clients)
      .set(updateData)
      .where(eq(clients.id, id))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      userId: updated.userId,
      company: updated.company,
      phone: updated.phone || undefined,
      address: updated.address || undefined,
      segment: updated.segment || undefined,
      status: (updated.status as 'Active' | 'At Risk' | 'Inactive'),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async getClients(): Promise<IClient[]> {
    const results = await db.select().from(clients);
    return results.map(client => ({
      id: client.id,
      userId: client.userId,
      company: client.company,
      phone: client.phone || undefined,
      address: client.address || undefined,
      segment: client.segment || undefined,
      status: (client.status as 'Active' | 'At Risk' | 'Inactive'),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));
  }
}
