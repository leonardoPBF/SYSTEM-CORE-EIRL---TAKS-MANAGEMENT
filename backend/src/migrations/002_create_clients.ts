/**
 * Migración: Crear tabla de clientes
 */
export const up = async () => {
  console.log('✅ Migración 002: Crear tabla de clientes');
  // CREATE TABLE clients (
  //   id UUID PRIMARY KEY,
  //   user_id UUID REFERENCES users(id),
  //   company VARCHAR(255) NOT NULL,
  //   phone VARCHAR(50),
  //   address TEXT,
  //   segment VARCHAR(100),
  //   status VARCHAR(50) DEFAULT 'Active',
  //   created_at TIMESTAMP DEFAULT NOW(),
  //   updated_at TIMESTAMP DEFAULT NOW()
  // );
};

export const down = async () => {
  console.log('⬇️  Revertir migración 002: Eliminar tabla de clientes');
  // DROP TABLE IF EXISTS clients;
};

