import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import fetchInstagramInsights from '../../controllers/linkedSocialControllers/fetchInstagramInsights.js';

const router = express.Router();

router.route('/insights')
  .get(protect, fetchInstagramInsights)

export default router;
