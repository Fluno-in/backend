import express from 'express';
import {
  getRequestsForInfluencer,
  updateRequestStatus,
} from '../../controllers/influencerDashboard/requestAds.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getRequestsForInfluencer);
router.route('/:id').patch(protect, updateRequestStatus);

export default router;
