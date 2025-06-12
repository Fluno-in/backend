import express from 'express';
import { createNotification } from '../../controllers/sharedDashboard/createNotificationController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createNotification);

export default router;
