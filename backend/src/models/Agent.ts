import { v4 as uuidv4 } from 'uuid';
import { Agent as IAgent, AgentStatus } from '../types';

export class AgentModel {
  private static agents: IAgent[] = [];

  static create(data: Omit<IAgent, 'id' | 'createdAt' | 'updatedAt'>): IAgent {
    const agent: IAgent = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.agents.push(agent);
    return agent;
  }

  static findById(id: string): IAgent | null {
    return this.agents.find(a => a.id === id) || null;
  }

  static findByUserId(userId: string): IAgent | null {
    return this.agents.find(a => a.userId === userId) || null;
  }

  static findAll(filters?: {
    team?: string;
    status?: AgentStatus;
  }): IAgent[] {
    let result = [...this.agents];

    if (filters) {
      if (filters.team) {
        result = result.filter(a => a.team === filters.team);
      }
      if (filters.status) {
        result = result.filter(a => a.status === filters.status);
      }
    }

    return result;
  }

  static update(id: string, data: Partial<Omit<IAgent, 'id' | 'createdAt'>>): IAgent | null {
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) return null;

    this.agents[index] = {
      ...this.agents[index],
      ...data,
      updatedAt: new Date()
    };

    return this.agents[index];
  }

  static delete(id: string): boolean {
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    this.agents.splice(index, 1);
    return true;
  }

  static getAgents(): IAgent[] {
    return this.agents;
  }
}

