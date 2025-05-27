import express from 'express';
import { getBusinessInfo, upsertBusinessInfo } from '../../controllers/sharedDashboard/businessInfo.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getBusinessInfo)
  .post(protect, upsertBusinessInfo);

export default router;
