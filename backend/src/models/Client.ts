import { v4 as uuidv4 } from 'uuid';
import { Client as IClient } from '../types';

export class ClientModel {
  private static clients: IClient[] = [];

  static create(data: Omit<IClient, 'id' | 'createdAt' | 'updatedAt'>): IClient {
    const client: IClient = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.clients.push(client);
    return client;
  }

  static findById(id: string): IClient | null {
    return this.clients.find(c => c.id === id) || null;
  }

  static findByUserId(userId: string): IClient | null {
    return this.clients.find(c => c.userId === userId) || null;
  }

  static findAll(filters?: {
    status?: string;
    segment?: string;
  }): IClient[] {
    let result = [...this.clients];

    if (filters) {
      if (filters.status) {
        result = result.filter(c => c.status === filters.status);
      }
      if (filters.segment) {
        result = result.filter(c => c.segment === filters.segment);
      }
    }

    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static update(id: string, data: Partial<Omit<IClient, 'id' | 'createdAt'>>): IClient | null {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.clients[index] = {
      ...this.clients[index],
      ...data,
      updatedAt: new Date()
    };

    return this.clients[index];
  }

  static delete(id: string): boolean {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.clients.splice(index, 1);
    return true;
  }

  static getClients(): IClient[] {
    return this.clients;
  }
}

