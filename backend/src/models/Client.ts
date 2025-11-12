import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { clients } from '../db/schema';
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
      status: client.status,
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
      status: client.status,
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
      status: client.status,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  static async findAll(filters?: {
    status?: string;
    segment?: string;
  }): Promise<IClient[]> {
    let query = db.select().from(clients);

    if (filters) {
      const conditions = [];
      if (filters.status) {
        conditions.push(eq(clients.status, filters.status));
      }
      if (filters.segment) {
        conditions.push(eq(clients.segment, filters.segment));
      }
      if (conditions.length > 0) {
        query = db.select().from(clients).where(and(...conditions));
      }
    }

    const allClients = await query;
    return allClients.map(client => ({
      id: client.id,
      userId: client.userId,
      company: client.company,
      phone: client.phone || undefined,
      address: client.address || undefined,
      segment: client.segment || undefined,
      status: client.status,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
      status: updated.status,
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
      status: client.status,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));
  }
}
