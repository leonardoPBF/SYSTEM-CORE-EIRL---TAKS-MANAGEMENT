import { Router } from 'express';
import { 
  getVolumeTrend,
  getSLABreaches,
  getFirstResponseTime,
  getResolutionTime
} from '../controllers/reportsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/volume-trend', getVolumeTrend);
router.get('/sla-breaches', getSLABreaches);
router.get('/first-response-time', getFirstResponseTime);
router.get('/resolution-time', getResolutionTime);

export default router;

