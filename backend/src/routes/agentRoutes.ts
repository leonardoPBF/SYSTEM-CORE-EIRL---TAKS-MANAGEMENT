import { Router } from 'express';
import {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent
} from '../controllers/agentController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de lectura: cualquier usuario autenticado puede ver agentes
router.get('/', getAgents);
router.get('/:id', getAgentById);

// Rutas de escritura: solo ADMIN e IT_DIRECTOR pueden crear/modificar/eliminar
router.post('/', authorize(UserRole.ADMIN, UserRole.IT_DIRECTOR), createAgent);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.IT_DIRECTOR), updateAgent);
router.delete('/:id', authorize(UserRole.ADMIN, UserRole.IT_DIRECTOR), deleteAgent);

export default router;

