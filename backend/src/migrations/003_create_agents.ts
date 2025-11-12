/**
 * Migración: Crear tabla de agentes
 */
export const up = async () => {
  console.log('✅ Migración 003: Crear tabla de agentes');
  // CREATE TABLE agents (
  //   id UUID PRIMARY KEY,
  //   user_id UUID REFERENCES users(id),
  //   team VARCHAR(255),
  //   status VARCHAR(50) DEFAULT 'Offline',
  //   max_tickets INTEGER DEFAULT 10,
  //   created_at TIMESTAMP DEFAULT NOW(),
  //   updated_at TIMESTAMP DEFAULT NOW()
  // );
};

export const down = async () => {
  console.log('⬇️  Revertir migración 003: Eliminar tabla de agentes');
  // DROP TABLE IF EXISTS agents;
};

