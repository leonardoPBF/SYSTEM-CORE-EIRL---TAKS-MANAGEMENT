import { Router } from 'express';
import { 
  getDashboardMetrics, 
  getAssignmentActivity, 
  getTeamCapacity, 
  getUnassignedPriorities, 
  getUnassignedTickets 
} from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/metrics', getDashboardMetrics);
router.get('/assignment-activity', getAssignmentActivity);
router.get('/team-capacity', getTeamCapacity);
router.get('/unassigned-priorities', getUnassignedPriorities);
router.get('/unassigned-tickets', getUnassignedTickets);

export default router;
