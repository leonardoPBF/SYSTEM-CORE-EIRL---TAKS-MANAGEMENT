import { Router } from 'express';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment
} from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/ticket/:ticketId', getComments);
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;

