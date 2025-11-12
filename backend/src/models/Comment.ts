import { eq } from 'drizzle-orm';
import { db } from '../db';
import { comments } from '../db/schema';
import { Comment as IComment } from '../types';

export class CommentModel {
  static async create(data: Omit<IComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<IComment> {
    const [comment] = await db.insert(comments).values({
      ticketId: data.ticketId,
      userId: data.userId,
      content: data.content,
      isInternal: data.isInternal || false,
      attachments: data.attachments,
    }).returning();

    return {
      id: comment.id,
      ticketId: comment.ticketId,
      userId: comment.userId,
      content: comment.content,
      isInternal: comment.isInternal,
      attachments: comment.attachments || undefined,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  static async findById(id: string): Promise<IComment | null> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
    
    if (!comment) return null;

    return {
      id: comment.id,
      ticketId: comment.ticketId,
      userId: comment.userId,
      content: comment.content,
      isInternal: comment.isInternal,
      attachments: comment.attachments || undefined,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  static async findByTicketId(ticketId: string): Promise<IComment[]> {
    const ticketComments = await db.select()
      .from(comments)
      .where(eq(comments.ticketId, ticketId));
    
    return ticketComments.map(comment => ({
      id: comment.id,
      ticketId: comment.ticketId,
      userId: comment.userId,
      content: comment.content,
      isInternal: comment.isInternal,
      attachments: comment.attachments || undefined,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    })).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  static async update(id: string, data: Partial<Omit<IComment, 'id' | 'createdAt'>>): Promise<IComment | null> {
    const updateData = { ...data, updatedAt: new Date() };
    
    const [updated] = await db.update(comments)
      .set(updateData)
      .where(eq(comments.id, id))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      ticketId: updated.ticketId,
      userId: updated.userId,
      content: updated.content,
      isInternal: updated.isInternal,
      attachments: updated.attachments || undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async getComments(): Promise<IComment[]> {
    const results = await db.select().from(comments);
    return results.map(comment => ({
      id: comment.id,
      ticketId: comment.ticketId,
      userId: comment.userId,
      content: comment.content,
      isInternal: comment.isInternal,
      attachments: comment.attachments || undefined,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  }
}
