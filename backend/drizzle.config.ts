import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DBCONNECTION || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DBCONNECTION o DATABASE_URL debe estar definido en el archivo .env');
}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString,
  },
} satisfies Config;

