import express from 'express';
import { getProfileImage } from '../../controllers/sharedDashboard/profileImageController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getProfileImage);

export default router;
