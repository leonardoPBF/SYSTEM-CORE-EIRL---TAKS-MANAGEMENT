import { Router } from 'express';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} from '../controllers/clientController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/', getClients);
router.get('/:id', getClientById);
router.post('/', authorize(UserRole.ADMIN, UserRole.IT_DIRECTOR), createClient);
router.put('/:id', updateClient);
router.delete('/:id', authorize(UserRole.ADMIN), deleteClient);

export default router;

