import asyncHandler from 'express-async-handler';
import Request from '../../models/Request.js';
import InfluencerOnboarding from '../../models/InfluencerOnboarding.js';

// @desc    Get requests received by influencer
// @route   GET /api/influencerDashboard/requestAds
// @access  Private
const getRequestsForInfluencer = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find influencer onboarding document for logged-in user
  const influencerOnboarding = await InfluencerOnboarding.findOne({ user: userId });

  if (!influencerOnboarding) {
    res.status(404);
    throw new Error('Influencer onboarding not found for user');
  }

  const requests = await Request.find({ influencer: influencerOnboarding._id })
    .populate('ad')
    .populate('business', 'name email') // Assuming business user has name and email
    .sort({ createdAt: -1 });

  res.json(requests);
});

// @desc    Update request status (accept/reject)
// @route   PATCH /api/influencerDashboard/requestAds/:id
// @access  Private
const updateRequestStatus = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const request = await Request.findById(requestId);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // Fetch influencer onboarding document for logged-in user
  const influencerOnboarding = await InfluencerOnboarding.findOne({ user: req.user._id });

  if (!influencerOnboarding) {
    res.status(404);
    throw new Error('Influencer onboarding not found for user');
  }

  // Check if the logged in user is the influencer for this request
  if (request.influencer.toString() !== influencerOnboarding._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this request');
  }

  request.status = status;
  await request.save();

  res.json({ message: `Request ${status} successfully` });
});

export { getRequestsForInfluencer, updateRequestStatus };
