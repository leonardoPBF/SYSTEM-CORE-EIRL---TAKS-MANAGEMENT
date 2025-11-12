import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import { User as IUser, UserRole } from '../types';

export class UserModel {
  static async create(data: Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'password' | 'isActive'> & { password: string }): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const [user] = await db.insert(users).values({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role.toLowerCase() as 'admin' | 'agent' | 'client' | 'manager',
      avatar: data.avatar,
      isActive: true,
    }).returning();

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toUpperCase() as UserRole,
      avatar: user.avatar || undefined,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      password: '',
    };
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toUpperCase() as UserRole,
      avatar: user.avatar || undefined,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      password: user.password, // Necesario para comparar contraseñas
    };
  }

  static async findById(id: string): Promise<IUser | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toUpperCase() as UserRole,
      avatar: user.avatar || undefined,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      password: '',
    };
  }

  static async findAll(): Promise<IUser[]> {
    const allUsers = await db.select().from(users);
    
    return allUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toUpperCase() as UserRole,
      avatar: user.avatar || undefined,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      password: '',
    }));
  }

  static async update(id: string, data: Partial<Omit<IUser, 'id' | 'password' | 'createdAt'>> & { password?: string }): Promise<IUser | null> {
    const updateData: any = { ...data };
    
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    if (data.role) {
      updateData.role = data.role.toLowerCase();
    }

    updateData.updatedAt = new Date();

    const [updated] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role.toUpperCase() as UserRole,
      avatar: updated.avatar || undefined,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      password: '',
    };
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async findByRole(role: UserRole): Promise<IUser[]> {
    const roleUsers = await db.select()
      .from(users)
      .where(eq(users.role, role.toLowerCase() as 'admin' | 'agent' | 'client' | 'manager'));
    
    return roleUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toUpperCase() as UserRole,
      avatar: user.avatar || undefined,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      password: '',
    }));
  }

  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Método auxiliar para obtener usuarios con contraseña (solo para autenticación)
  static async getUserWithPassword(email: string): Promise<IUser | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toUpperCase() as UserRole,
      avatar: user.avatar || undefined,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      password: user.password,
    };
  }
}
