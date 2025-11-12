import { v4 as uuidv4 } from 'uuid';
import { Comment as IComment } from '../types';

export class CommentModel {
  private static comments: IComment[] = [];

  static create(data: Omit<IComment, 'id' | 'createdAt' | 'updatedAt'>): IComment {
    const comment: IComment = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.comments.push(comment);
    return comment;
  }

  static findById(id: string): IComment | null {
    return this.comments.find(c => c.id === id) || null;
  }

  static findByTicketId(ticketId: string): IComment[] {
    return this.comments
      .filter(c => c.ticketId === ticketId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  static update(id: string, data: Partial<Omit<IComment, 'id' | 'createdAt'>>): IComment | null {
    const index = this.comments.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.comments[index] = {
      ...this.comments[index],
      ...data,
      updatedAt: new Date()
    };

    return this.comments[index];
  }

  static delete(id: string): boolean {
    const index = this.comments.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.comments.splice(index, 1);
    return true;
  }

  static getComments(): IComment[] {
    return this.comments;
  }
}

