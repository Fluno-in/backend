import express from 'express';
import {
  getInfluencerAds,
  sendRequestToInfluencer,
} from '../../controllers/businessDashboard/requestAds.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/influencer/:influencerId').get(protect, getInfluencerAds);
router.route('/sendRequest').post(protect, sendRequestToInfluencer);

export default router;
