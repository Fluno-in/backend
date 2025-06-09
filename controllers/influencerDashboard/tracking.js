import asyncHandler from 'express-async-handler';
import Tracking from '../../models/Tracking.js';
import Request from '../../models/Request.js';
import InfluencerOnboarding from '../../models/InfluencerOnboarding.js';

// @desc    Submit tracking details by influencer for an ad
// @route   POST /api/influencerDashboard/tracking/:adId
// @access  Private
const submitTrackingDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const adId = req.params.adId;
  const { submission } = req.body;

  // Validate request
  if (!submission) {
    res.status(400);
    throw new Error('Submission details are required');
  }

  // Find influencer onboarding document for logged-in user
  const influencerOnboarding = await InfluencerOnboarding.findOne({ user: userId });

  if (!influencerOnboarding) {
    res.status(404);
    throw new Error('Influencer onboarding not found for user');
  }

  // Check if request exists and is accepted by influencer
  const request = await Request.findOne({
    ad: adId,
    influencer: influencerOnboarding._id,
    status: 'accepted',
  });

  if (!request) {
    res.status(404);
    throw new Error('Accepted request not found for this ad and influencer');
  }

  // Upsert tracking document
  let tracking = await Tracking.findOne({ request: request._id });
  if (!tracking) {
    tracking = new Tracking({
      request: request._id,
      ad: adId,
      influencer: influencerOnboarding._id,
      business: request.business,
      submissions: [submission],
    });
  } else {
    tracking.submissions.push(submission);
  }
  // Reset businessStatus on new submission is not needed per submission basis

  await tracking.save();

  res.status(201).json({ message: 'Submission added successfully' });
});

// @desc    Get tracking details for influencer by ad id
// @route   GET /api/influencerDashboard/tracking/:adId
// @access  Private

const getTrackingDetailsForInfluencer = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const adId = req.params.adId;

  // Find influencer onboarding document for logged-in user
  const influencerOnboarding = await InfluencerOnboarding.findOne({ user: userId });

  if (!influencerOnboarding) {
    res.status(404);
    throw new Error('Influencer onboarding not found for user');
  }

  const request = await Request.findOne({
    ad: adId,
    influencer: influencerOnboarding._id,
  }).populate('ad');

  if (!request) {
    res.status(404);
    throw new Error('Request not found for this ad and influencer');
  }

  const tracking = await Tracking.findOne({ request: request._id });

  if (!tracking) {
    return res.json({ submissions: [], campaignName: null });
  }

  res.json({
    submissions: tracking.submissions,
    campaignName: request.ad?.campaignName || null,
  });
});

export { submitTrackingDetails, getTrackingDetailsForInfluencer };
