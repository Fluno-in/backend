import express from 'express';
import { getBusinessInfo, upsertBusinessInfo } from '../../controllers/businessDashboard/businessInfo.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getBusinessInfo)
  .post(protect, upsertBusinessInfo);

export default router;
