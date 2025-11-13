import { db } from './index';
import { sql } from 'drizzle-orm';

/**
 * Verifica si las tablas existen en la base de datos
 */
export async function checkTablesExist(): Promise<boolean> {
  try {
    // Intentar hacer una consulta simple a la tabla users
    await db.execute(sql`SELECT 1 FROM users LIMIT 1`);
    return true;
  } catch (error: any) {
    if (error?.code === '42P01' || error?.message?.includes('does not exist') || error?.message?.includes('relation') && error?.message?.includes('does not exist')) {
      return false;
    }
    // Si es un error de conexión, relanzarlo
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      throw new Error(`No se puede conectar a la base de datos. Verifica tu DBCONNECTION en .env`);
    }
    throw error;
  }
}

/**
 * Verifica la conexión a la base de datos
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error: any) {
    if (error?.code === 'ECONNREFUSED') {
      throw new Error('No se puede conectar a PostgreSQL. Asegúrate de que esté corriendo.');
    }
    if (error?.code === 'ENOTFOUND') {
      throw new Error('Host de base de datos no encontrado. Verifica DBCONNECTION en .env');
    }
    if (error?.code === '28P01') {
      throw new Error('Credenciales de base de datos incorrectas. Verifica DBCONNECTION en .env');
    }
    if (error?.code === '3D000') {
      throw new Error('La base de datos no existe. Créala primero.');
    }
    throw error;
  }
}

