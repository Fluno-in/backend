import express from 'express';
import { submitTrackingDetails, getTrackingDetailsForInfluencer } from '../../controllers/influencerDashboard/tracking.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Fix route to include :adId param as expected by controller
router.route('/:adId').post(submitTrackingDetails).get(getTrackingDetailsForInfluencer);

export default router;
