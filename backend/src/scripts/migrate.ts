import { runMigrations } from '../migrations/migrator';

/**
 * Script para ejecutar migraciones manualmente
 * Uso: npm run migrate
 */
runMigrations()
  .then(() => {
    console.log('✅ Migraciones completadas');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error ejecutando migraciones:', error);
    process.exit(1);
  });

