import asyncHandler from 'express-async-handler';
import Onboarding from '../../models/InfluencerOnboarding.js';
import fetchInstagramInsights from '../fetchInstagramInsights.js';

/**
 * @desc    Get all available influencers with personal info and Instagram insights
 * @route   GET /api/influencers/available
 * @access  Private/Admin/Business (depending on your auth logic)
 */
const getAvailableInfluencers = asyncHandler(async (req, res) => {
  // Fetch all influencers' personal info from onboarding model
  const influencers = await Onboarding.find({});

  // Combine personal info with Instagram insights using Promise.all for concurrency
  const enrichedInfluencers = await Promise.all(
    influencers.map(async (influencer) => {
      const instagramInsights = await fetchInstagramInsights(influencer.user);

      return {
        _id: influencer._id,
        personalInfo: {
          name: influencer.fullName,
          gender: influencer.gender,
          city: influencer.city,
          state: influencer.state,
        },
        instagramInsights: instagramInsights || null, // fallback to null if not found
      };
    })
  );

  // Return the combined result
  res.status(200).json(enrichedInfluencers);
});

export { getAvailableInfluencers };
