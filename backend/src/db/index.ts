import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config();

// Obtener la URI de conexión desde la variable de entorno
const connectionString = process.env.DBCONNECTION || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DBCONNECTION o DATABASE_URL debe estar definido en el archivo .env');
}

// Crear el pool de conexiones
const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Crear la instancia de Drizzle
export const db = drizzle(pool, { schema });

// Exportar el pool para poder cerrarlo si es necesario
export { pool };

// Exportar el schema
export * from './schema';

