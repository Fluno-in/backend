import express from 'express';
import multer from 'multer';
import {
  getInfluencerAds,
  sendRequestToInfluencer,
  getRequestStatus,
} from '../../controllers/businessDashboard/requestAds.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.route('/influencer/:influencerId').get(protect, getInfluencerAds);
router.route('/sendRequest').post(protect, upload.single('image'), sendRequestToInfluencer);
router.route('/status/:influencerId').get(protect, getRequestStatus);

export default router;
