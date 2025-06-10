import express from 'express';
import { getLinkSocials, upsertLinkSocials } from '../../controllers/linkedSocialControllers/linkSocialsController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/status')
  .get(protect, getLinkSocials)
  .post(protect, upsertLinkSocials);

export default router;
