/**
 * Migración: Crear tabla de comentarios
 */
export const up = async () => {
  console.log('✅ Migración 005: Crear tabla de comentarios');
  // CREATE TABLE comments (
  //   id UUID PRIMARY KEY,
  //   ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  //   user_id UUID REFERENCES users(id),
  //   content TEXT NOT NULL,
  //   is_internal BOOLEAN DEFAULT false,
  //   attachments TEXT[],
  //   created_at TIMESTAMP DEFAULT NOW(),
  //   updated_at TIMESTAMP DEFAULT NOW()
  // );
  // CREATE INDEX idx_comments_ticket ON comments(ticket_id);
};

export const down = async () => {
  console.log('⬇️  Revertir migración 005: Eliminar tabla de comentarios');
  // DROP TABLE IF EXISTS comments;
};

