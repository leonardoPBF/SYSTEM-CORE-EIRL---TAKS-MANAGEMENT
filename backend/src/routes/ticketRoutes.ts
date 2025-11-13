import { Router } from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  assignTicket,
  getUnassignedTickets,
  reviewTicket
} from '../controllers/ticketController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/', getTickets);
router.get('/unassigned', getUnassignedTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.put('/:id', updateTicket);
router.put('/:id/review', authorize(UserRole.IT_DIRECTOR), reviewTicket);
router.put('/:id/assign', authorize(UserRole.IT_DIRECTOR), assignTicket);
router.delete('/:id', authorize(UserRole.ADMIN, UserRole.IT_DIRECTOR), deleteTicket);

export default router;

