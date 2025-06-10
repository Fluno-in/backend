import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../../models/User.js';
import { sendPasswordResetEmail } from '../../utils/emailService.js';

// Generate a secure token for password reset
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// @desc    Forgot password - send reset link
// @route   POST /api/password/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('No user found with this email');
  }

  // Generate reset token and expiry (e.g., 1 hour)
  const resetToken = generateResetToken();
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

  // Save token and expiry to user document
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetTokenExpiry;
  await user.save();

  // Construct reset URL (frontend URL should be configured in env)
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  // Send reset email using new email service
  try {
    await sendPasswordResetEmail(user.email, resetUrl);
    res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to send password reset email');
  }
});

// @desc    Reset password using token
// @route   POST /api/password/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400);
    throw new Error('Token and new password are required');
  }

  // Find user by token and check expiry
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired password reset token');
  }

  // Update password and clear reset token fields
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: 'Password has been reset successfully' });
});

export { forgotPassword, resetPassword };
