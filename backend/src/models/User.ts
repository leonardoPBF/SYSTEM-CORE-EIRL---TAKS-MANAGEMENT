import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { User as IUser, UserRole } from '../types';

export class UserModel {
  private static users: IUser[] = [];

  static async create(data: Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'password' | 'isActive'> & { password: string }): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user: IUser = {
      id: uuidv4(),
      ...data,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    this.users.push(user);
    return { ...user, password: '' } as IUser;
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  static async findById(id: string): Promise<IUser | null> {
    const user = this.users.find(u => u.id === id);
    return user ? { ...user, password: '' } as IUser : null;
  }

  static async findAll(): Promise<IUser[]> {
    return this.users.map(u => ({ ...u, password: '' } as IUser));
  }

  static async update(id: string, data: Partial<Omit<IUser, 'id' | 'password' | 'createdAt'>> & { password?: string }): Promise<IUser | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    this.users[index] = {
      ...this.users[index],
      ...updateData,
      updatedAt: new Date()
    };

    return { ...this.users[index], password: '' } as IUser;
  }

  static async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    this.users.splice(index, 1);
    return true;
  }

  static async findByRole(role: UserRole): Promise<IUser[]> {
    return this.users
      .filter(u => u.role === role)
      .map(u => ({ ...u, password: '' } as IUser));
  }

  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static getUsers(): IUser[] {
    return this.users;
  }
}

