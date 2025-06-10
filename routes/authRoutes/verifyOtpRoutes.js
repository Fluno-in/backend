import express from 'express';
import { verifyOtp, resendOtp } from '../../controllers/authController/verifyOtpController.js';

const router = express.Router();

router.post('/', verifyOtp);
router.post('/resend-otp', resendOtp);

export default router;
