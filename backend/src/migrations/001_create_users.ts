/**
 * Migración: Crear tabla de usuarios
 * Descripción: Crea la estructura base para usuarios del sistema
 */
export const up = async () => {
  console.log('✅ Migración 001: Crear tabla de usuarios');
  // En una implementación real con base de datos, aquí se ejecutaría:
  // CREATE TABLE users (
  //   id UUID PRIMARY KEY,
  //   email VARCHAR(255) UNIQUE NOT NULL,
  //   password VARCHAR(255) NOT NULL,
  //   name VARCHAR(255) NOT NULL,
  //   role VARCHAR(50) NOT NULL,
  //   avatar VARCHAR(255),
  //   is_active BOOLEAN DEFAULT true,
  //   created_at TIMESTAMP DEFAULT NOW(),
  //   updated_at TIMESTAMP DEFAULT NOW()
  // );
};

export const down = async () => {
  console.log('⬇️  Revertir migración 001: Eliminar tabla de usuarios');
  // DROP TABLE IF EXISTS users;
};

