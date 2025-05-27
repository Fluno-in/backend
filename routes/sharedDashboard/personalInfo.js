import express from 'express';
import { getPersonalInfo, upsertPersonalInfo } from '../../controllers/sharedDashboard/personalInfo.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPersonalInfo)
  .post(protect, upsertPersonalInfo);

export default router;
