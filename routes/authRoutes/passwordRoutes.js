import express from 'express';
import { forgotPassword, resetPassword } from '../../controllers/authController/passwordController.js';

const router = express.Router();

// Route to request password reset link
router.post('/forgot-password', forgotPassword);

// Route to reset password using token
router.post('/reset-password', resetPassword);

export default router;
