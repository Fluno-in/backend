import express from 'express';
import {
  upsertBusinessOnboarding,
  getBusinessOnboarding,
  upsertInfluencerOnboarding,
  getInfluencerOnboarding,
} from '../../controllers/authController/onboardingController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/business')
  .get(protect, getBusinessOnboarding)
  .post(protect, upsertBusinessOnboarding);

router.route('/influencer')
  .get(protect, getInfluencerOnboarding)
  .post(protect, upsertInfluencerOnboarding);

export default router;
