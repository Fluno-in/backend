import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getInstagramInsights } from '../controllers/InstagramInsightsController.js';

const router = express.Router();

router.route('/insights')
  .get(protect, getInstagramInsights)

export default router;
