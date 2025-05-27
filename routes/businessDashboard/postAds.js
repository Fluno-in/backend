import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import { createAd, uploadAdImage, getAds, deleteAd } from '../../controllers/businessDashboard/postAds.js';

const router = express.Router();

router.route('/')
  .post(protect, uploadAdImage, createAd)
  .get(protect, getAds);

router.route('/:id').delete(protect, deleteAd);

export default router;
