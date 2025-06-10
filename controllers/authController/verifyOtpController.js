import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { sendOtpEmail } from '../../utils/otpService.js';

// Simple logger function for demonstration (replace with real logger if available)
const log = (message) => {
  console.log(`[verifyOtpController] ${new Date().toISOString()} - ${message}`);
};

// @desc    Verify OTP
// @route   POST /api/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  log(`OTP verification attempt for email: ${email}`);

  if (!email || !otp) {
    log('Email and OTP are required');
    res.status(400);
    throw new Error('Email and OTP are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    log(`User not found for email: ${email}`);
    res.status(404);
    throw new Error('User not found');
  }

  if (user.otp !== otp) {
    log(`Invalid OTP for email: ${email}`);
    res.status(400);
    throw new Error('Invalid OTP');
  }

  user.isVerified = true;
  user.otp = null; // Clear OTP after verification
  await user.save();

  log(`OTP verified successfully for email: ${email}`);
  // Generate token after verification
  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(200).json({
    message: 'OTP verified successfully',
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      type: user.type,
    },
    token,
  });
});

// @desc    Resend OTP
// @route   POST /api/resend-otp
// @access  Public
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  log(`OTP resend attempt for email: ${email}`);

  if (!email) {
    log('Email is required for OTP resend');
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    log(`User not found for email: ${email}`);
    res.status(404);
    throw new Error('User not found');
  }

  // Generate new OTP (6 digit random number as string)
  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = newOtp;
  await user.save();

  try {
    // Send OTP via email using utility function
    await sendOtpEmail(user.email, newOtp);
    log(`OTP resent successfully to email: ${email}`);
  } catch (error) {
    log(`Failed to send OTP email to ${email}: ${error.message}`);
    res.status(500);
    throw new Error('Failed to send OTP email');
  }

  res.status(200).json({ message: 'OTP resent successfully' });
});

export { verifyOtp, resendOtp };
