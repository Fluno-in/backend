import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../../models/User.js';
import { sendOtpEmail } from '../../utils/otpService.js';
import crypto from 'crypto';

// Generate JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate a secure 6-digit OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Simple logger
const log = (message) => {
  console.log(`[authController] ${new Date().toISOString()} - ${message}`);
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, type } = req.body;

  // Validation
  if (!name || !email || !password || !type) {
    res.status(400);
    throw new Error('Please fill all fields including user type');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    if (userExists.type === 'influencer') {
      throw new Error('User exists as influencer');
    } else if (userExists.type === 'business') {
      throw new Error('User exists as business');
    } else {
      throw new Error('User already exists');
    }
  }

  // Generate OTP
  const otp = generateOtp();

  // Create user with OTP
  const user = await User.create({
    name,
    email,
    password,
    type,
    otp,
    isVerified: false,
  });

  if (user) {
    try {
      await sendOtpEmail(user.email, otp);
      log(`INFO: OTP email sent to ${user.email}`);
    } catch (error) {
      log(`ERROR: Failed to send OTP email to ${user.email} - ${error.message}`);
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      message: 'OTP sent to email. Please verify your email to complete registration.',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

import InfluencerOnboarding from '../../models/InfluencerOnboarding.js';
import BusinessOnboarding from '../../models/BusinessOnboarding.js';
import LinkSocials from '../../models/LinkSocials.js';

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('Invalid email Or No account found');
  }

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error('Email not verified');
    }

    // Check onboarding completion
    let onboardingComplete = false;
    if (user.type === 'influencer') {
      const influencerOnboarding = await InfluencerOnboarding.findOne({ user: user._id });
      onboardingComplete = !!influencerOnboarding;
    } else if (user.type === 'business') {
      const businessOnboarding = await BusinessOnboarding.findOne({ user: user._id });
      onboardingComplete = !!businessOnboarding;
    }

    // Check social linking
    const linkSocials = await LinkSocials.findOne({ user: user._id });
    let socialLinked = false;
    if (linkSocials) {
      // Check if any social account is linked
      if (
        (linkSocials.instagram && linkSocials.instagram.linked) ||
        (linkSocials.facebook && linkSocials.facebook.trim() !== '') ||
        (linkSocials.twitter && linkSocials.twitter.trim() !== '') ||
        (linkSocials.linkedin && linkSocials.linkedin.trim() !== '') ||
        (linkSocials.youtube && linkSocials.youtube.trim() !== '') ||
        (linkSocials.tiktok && linkSocials.tiktok.trim() !== '') ||
        (linkSocials.other && linkSocials.other.trim() !== '')
      ) {
        socialLinked = true;
      }
    }

    // Determine redirect route based on user type and role
    let redirectRoute = user.type === 'influencer' ? '/dashboard/influencer' : '/dashboard/business';
    if (user.type === 'influencer') {
      if (!onboardingComplete) {
        redirectRoute = '/onboarding/influencer';
      } else if (!socialLinked) {
        redirectRoute = '/onboarding/linksocials';
      }
    } else if (user.type === 'business') {
      if (!onboardingComplete) {
        redirectRoute = '/onboarding/business';
      } else if (!socialLinked) {
        redirectRoute = '/onboarding/linksocials';
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      isVerified: user.isVerified,
      token: generateToken(user._id),
      redirectRoute,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current logged in user info
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    type: req.user.type,
  });
});

export { signup, login, getMe };
