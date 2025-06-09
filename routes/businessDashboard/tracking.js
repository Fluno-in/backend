import express from 'express';
import { getTrackingDetailsForBusiness, updateBusinessApproval } from '../../controllers/businessDashboard/tracking.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:adId')
  .get(protect, getTrackingDetailsForBusiness)
  .patch(protect, updateBusinessApproval);

export default router;
