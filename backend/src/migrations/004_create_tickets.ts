/**
 * Migración: Crear tabla de tickets
 */
export const up = async () => {
  console.log('✅ Migración 004: Crear tabla de tickets');
  // CREATE TABLE tickets (
  //   id UUID PRIMARY KEY,
  //   ticket_number VARCHAR(50) UNIQUE NOT NULL,
  //   subject VARCHAR(500) NOT NULL,
  //   description TEXT NOT NULL,
  //   client_id UUID REFERENCES clients(id),
  //   assigned_to UUID REFERENCES agents(id),
  //   priority VARCHAR(50) DEFAULT 'Medium',
  //   status VARCHAR(50) DEFAULT 'Open',
  //   type VARCHAR(100),
  //   source VARCHAR(50),
  //   tags TEXT[],
  //   queue VARCHAR(255),
  //   sla VARCHAR(255),
  //   due_date TIMESTAMP,
  //   resolved_at TIMESTAMP,
  //   closed_at TIMESTAMP,
  //   created_at TIMESTAMP DEFAULT NOW(),
  //   updated_at TIMESTAMP DEFAULT NOW()
  // );
  // CREATE INDEX idx_tickets_client ON tickets(client_id);
  // CREATE INDEX idx_tickets_assigned ON tickets(assigned_to);
  // CREATE INDEX idx_tickets_status ON tickets(status);
};

export const down = async () => {
  console.log('⬇️  Revertir migración 004: Eliminar tabla de tickets');
  // DROP TABLE IF EXISTS tickets;
};

