import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { agents } from '../db/schema';
import { Agent as IAgent, AgentStatus } from '../types';

export class AgentModel {
  static async create(data: Omit<IAgent, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAgent> {
    const [agent] = await db.insert(agents).values({
      userId: data.userId,
      team: data.team,
      status: data.status.toLowerCase().replace('_', '_') as 'online' | 'away' | 'offline' | 'at_capacity',
      maxTickets: data.maxTickets || 10,
    }).returning();

    return {
      id: agent.id,
      userId: agent.userId,
      team: agent.team || undefined,
      status: agent.status.toUpperCase().replace('_', '_') as AgentStatus,
      maxTickets: agent.maxTickets,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    };
  }

  static async findById(id: string): Promise<IAgent | null> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
    
    if (!agent) return null;

    return {
      id: agent.id,
      userId: agent.userId,
      team: agent.team || undefined,
      status: agent.status.toUpperCase().replace('_', '_') as AgentStatus,
      maxTickets: agent.maxTickets,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    };
  }

  static async findByUserId(userId: string): Promise<IAgent | null> {
    const [agent] = await db.select().from(agents).where(eq(agents.userId, userId)).limit(1);
    
    if (!agent) return null;

    return {
      id: agent.id,
      userId: agent.userId,
      team: agent.team || undefined,
      status: agent.status.toUpperCase().replace('_', '_') as AgentStatus,
      maxTickets: agent.maxTickets,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    };
  }

  static async findAll(filters?: {
    team?: string;
    status?: AgentStatus;
  }): Promise<IAgent[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.team) {
        conditions.push(eq(agents.team, filters.team));
      }
      if (filters.status) {
        conditions.push(eq(agents.status, filters.status.toLowerCase().replace('_', '_') as any));
      }
    }

    const query = conditions.length > 0
      ? db.select().from(agents).where(and(...conditions))
      : db.select().from(agents);

    const allAgents = await query;
    return allAgents.map(agent => ({
      id: agent.id,
      userId: agent.userId,
      team: agent.team || undefined,
      status: agent.status.toUpperCase().replace('_', '_') as AgentStatus,
      maxTickets: agent.maxTickets,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    }));
  }

  static async update(id: string, data: Partial<Omit<IAgent, 'id' | 'createdAt'>>): Promise<IAgent | null> {
    const updateData: any = { ...data, updatedAt: new Date() };
    
    if (data.status) {
      updateData.status = data.status.toLowerCase().replace('_', '_');
    }

    const [updated] = await db.update(agents)
      .set(updateData)
      .where(eq(agents.id, id))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      userId: updated.userId,
      team: updated.team || undefined,
      status: updated.status.toUpperCase().replace('_', '_') as AgentStatus,
      maxTickets: updated.maxTickets,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(agents).where(eq(agents.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async getAgents(): Promise<IAgent[]> {
    const results = await db.select().from(agents);
    return results.map(agent => ({
      id: agent.id,
      userId: agent.userId,
      team: agent.team || undefined,
      status: agent.status.toUpperCase().replace('_', '_') as AgentStatus,
      maxTickets: agent.maxTickets,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    }));
  }
}
