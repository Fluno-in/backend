import express from 'express';
import { getAvailableInfluencers } from '../../controllers/businessDashboard/availableInfluencers.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getAvailableInfluencers);

export default router;
