import express from 'express';
import { getAvailableAds, applyForAd, markNotInterested } from '../../controllers/influencerDashboard/availableAds.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Route to get available ads
router.get('/ads', protect, getAvailableAds);

// Route to apply for an ad
router.post('/apply', protect, applyForAd);

// Route to mark ad as not interested
router.post('/not-interested', protect, markNotInterested);

export default router;