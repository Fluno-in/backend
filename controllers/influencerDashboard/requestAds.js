import asyncHandler from 'express-async-handler';
import Request from '../../models/Request.js';

// @desc    Get requests received by influencer
// @route   GET /api/influencerDashboard/requestAds
// @access  Private
const getRequestsForInfluencer = asyncHandler(async (req, res) => {
  const influencerId = req.user._id;

  const requests = await Request.find({ influencer: influencerId })
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

  // Check if the logged in user is the influencer for this request
  if (request.influencer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this request');
  }

  request.status = status;
  await request.save();

  res.json({ message: `Request ${status} successfully` });
});

export { getRequestsForInfluencer, updateRequestStatus };
