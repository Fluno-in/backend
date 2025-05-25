import asyncHandler from 'express-async-handler';
import BusinessOnboarding from '../models/BusinessOnboarding.js';
import InfluencerOnboarding from '../models/InfluencerOnboarding.js';

// @desc    Create or update business onboarding data
// @route   POST /api/onboarding/business
// @access  Private
const upsertBusinessOnboarding = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { businessName, businessWebsite, phoneNumber, industry,state, city, additionalInfo } = req.body;

  console.log('Received business onboarding data:', req.body);
  console.log('Authenticated user ID:', userId);

  let onboarding = await BusinessOnboarding.findOne({ user: userId });

  if (onboarding) {
    onboarding.businessName = businessName || onboarding.businessName;
    onboarding.businessWebsite = businessWebsite || onboarding.businessWebsite;
    onboarding.phoneNumber = phoneNumber || onboarding.phoneNumber;
    onboarding.industry = industry || onboarding.industry;
    onboarding.state = state || onboarding.state;
    onboarding.city = city || onboarding.city;
    onboarding.additionalInfo = additionalInfo || onboarding.additionalInfo;
  } else {
    onboarding = new BusinessOnboarding({
      user: userId,
      businessName,
      businessWebsite,
      phoneNumber,
      industry,
      state,
      city,
      additionalInfo,
    });
  }

  try {
    await onboarding.save();
    console.log('Business onboarding data saved successfully for user:', userId);
    res.status(200).json(onboarding);
  } catch (error) {
    console.error('Error saving business onboarding data for user:', userId, error);
    res.status(500);
    throw new Error('Failed to save business onboarding data');
  }
});

// @desc    Get business onboarding data
// @route   GET /api/onboarding/business
// @access  Private


const getBusinessOnboarding = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let onboarding = await BusinessOnboarding.findOne({ user: userId });
  if (!onboarding) {
    // Return default empty values without saving to DB if not found
    onboarding = {
      user: userId,
      companyName: '',
      companyWebsite: '',
      phoneNumber: '',
      industry: '',
      state: '',
      city: '',
      additionalInfo: '',
    };
  }
  res.status(200).json(onboarding);
});

// @desc    Create or update influencer onboarding data
// @route   POST /api/onboarding/influencer
// @access  Private
const upsertInfluencerOnboarding = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }
  const userId = req.user._id;
  const { fullName, phoneNumber, gender, dateOfBirth, bio, state, city } = req.body;

  console.log('Received influencer onboarding data:', req.body);
  console.log('Authenticated user ID:', userId);

  let onboarding = await InfluencerOnboarding.findOne({ user: userId });

  if (onboarding) {
    onboarding.fullName = fullName || onboarding.fullName;
    onboarding.phoneNumber = phoneNumber || onboarding.phoneNumber;
    onboarding.gender = gender || onboarding.gender;
    onboarding.dateOfBirth = dateOfBirth || onboarding.dateOfBirth;
    onboarding.bio = bio || onboarding.bio;
    onboarding.state = state || onboarding.state;
    onboarding.city = city || onboarding.city;
  } else {
    onboarding = new InfluencerOnboarding({
      user: userId,
      fullName,
      phoneNumber,
      gender,
      dateOfBirth,
      bio,
      state,
      city,
    });
  }

  try {
    await onboarding.save();
    console.log('Influencer onboarding data saved successfully for user:', userId);
    res.status(200).json(onboarding);
  } catch (error) {
    console.error('Error saving influencer onboarding data for user:', userId, error);
    res.status(500);
    throw new Error('Failed to save influencer onboarding data');
  }
});

// @desc    Get influencer onboarding data
// @route   GET /api/onboarding/influencer
// @access  Private
const getInfluencerOnboarding = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let onboarding = await InfluencerOnboarding.findOne({ user: userId });
  if (!onboarding) {
    // Return default empty values without saving to DB if not found
    onboarding = {
      user: userId,
      fullName: '',
      phoneNumber: '',
      gender: '',
      dateOfBirth: new Date('1970-01-01'),
      bio: '',
      state: '',
      city: '',
    };
  }
  res.status(200).json(onboarding);
});

export {
  upsertBusinessOnboarding,
  getBusinessOnboarding,
  upsertInfluencerOnboarding,
  getInfluencerOnboarding,
};
