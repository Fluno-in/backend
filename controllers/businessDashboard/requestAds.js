import asyncHandler from 'express-async-handler';
import InfluencerOnboarding from '../../models/InfluencerOnboarding.js';
import Ad from '../../models/Ad.js';

// @desc    Get influencer ad data by influencer ID
// @route   GET /api/requestAds/influencer/:influencerId
// @access  Private
const getInfluencerAds = asyncHandler(async (req, res) => {
  const influencerId = req.params.influencerId;

  const influencer = await InfluencerOnboarding.findOne({ user: influencerId });
  if (!influencer) {
    res.status(404);
    throw new Error('Influencer not found');
  }

  // Assuming influencer ads are stored in a field 'ads' or similar
  // Adjust field name as per actual schema
  const ads = influencer.ads || [];

  res.json(ads);
});

// @desc    Send request to influencer with selected ad or new campaign
// @route   POST /api/requestAds/sendRequest
// @access  Private
const sendRequestToInfluencer = asyncHandler(async (req, res) => {
  const {
    influencerId,
    adId, // optional if sending existing ad
    campaignData, // optional if sending new campaign data
  } = req.body;

  if (!influencerId) {
    res.status(400);
    throw new Error('Influencer ID is required');
  }

  // If campaignData is provided, create new ad
  let ad;
  if (campaignData) {
    // Ensure image is a string (e.g., URL or path), not an object
    let imagePath = '';
    if (campaignData.image) {
      if (typeof campaignData.image === 'string') {
        imagePath = campaignData.image;
      } else if (campaignData.image.path) {
        imagePath = campaignData.image.path;
      } else {
        // fallback or error
        imagePath = '';
      }
    }

    ad = new Ad({
      user: req.user._id,
      campaignName: campaignData.campaignName,
      platforms: campaignData.platforms,
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      taskCount: campaignData.taskCount,
      barterOrPaid: campaignData.barterOrPaid,
      budget: campaignData.budget,
      requirements: campaignData.requirements,
      campaignDescription: campaignData.campaignDescription,
      image: imagePath,
    });
    ad = await ad.save();
  } else if (adId) {
    ad = await Ad.findById(adId);
    if (!ad) {
      res.status(404);
      throw new Error('Ad not found');
    }
  } else {
    res.status(400);
    throw new Error('Either adId or campaignData must be provided');
  }

  // TODO: Implement logic to send request to influencer
  // This could involve creating a Request or Application document linking ad and influencer
  // For now, just respond with success and ad info

  res.status(201).json({
    message: 'Request sent to influencer successfully',
    ad,
    influencerId,
  });
});

export { getInfluencerAds, sendRequestToInfluencer };
