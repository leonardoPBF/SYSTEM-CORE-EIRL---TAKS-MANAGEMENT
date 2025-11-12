import * as migration001 from './001_create_users';
import * as migration002 from './002_create_clients';
import * as migration003 from './003_create_agents';
import * as migration004 from './004_create_tickets';
import * as migration005 from './005_create_comments';

interface Migration {
  name: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

const migrations: Migration[] = [
  { name: '001_create_users', ...migration001 },
  { name: '002_create_clients', ...migration002 },
  { name: '003_create_agents', ...migration003 },
  { name: '004_create_tickets', ...migration004 },
  { name: '005_create_comments', ...migration005 },
];

export const runMigrations = async () => {
  console.log('🔄 Ejecutando migraciones...');
  
  for (const migration of migrations) {
    try {
      await migration.up();
    } catch (error) {
      console.error(`❌ Error en migración ${migration.name}:`, error);
      throw error;
    }
  }
  
  console.log('✅ Todas las migraciones ejecutadas correctamente');
};

export const rollbackMigrations = async () => {
  console.log('⬇️  Revirtiendo migraciones...');
  
  for (const migration of migrations.reverse()) {
    try {
      await migration.down();
    } catch (error) {
      console.error(`❌ Error revirtiendo migración ${migration.name}:`, error);
      throw error;
    }
  }
  
  console.log('✅ Todas las migraciones revertidas');
};

export { migrations };

