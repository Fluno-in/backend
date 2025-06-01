import Ad from '../../models/Ad.js';

/**
 * @desc Get all available ads for an influencer
 * @route GET /api/ads/available
 * @access Private (Influencer)
 */
export const getAvailableAds = async (req, res) => {
  try {
    const userId = req.user.id;

    let ads = await Ad.find({
      // appliedInfluencers: { $ne: userId },
      notInterestedInfluencers: { $ne: userId },
    }).lean();

    // Add hasApplied flag based on appliedInfluencers array
    ads = ads.map(ad => {
      const appliedInfluencers = (ad.appliedInfluencers || []).map(id => id.toString());
      return {
        ...ad,
        appliedInfluencers,
        hasApplied: appliedInfluencers.includes(userId.toString()),
      };
    });

    res.json({ success: true, ads });
  } catch (error) {
    console.error('Error fetching available ads:', error);
    res.status(500).json({ success: false, message: 'Server error fetching ads' });
  }
};

/**
 * @desc Apply for an ad
 * @route POST /api/ads/apply
 * @access Private (Influencer)
 */
export const applyForAd = async (req, res) => {
  try {
    const userId = req.user.id;
    const { adId } = req.body;

    if (!adId) {
      return res.status(400).json({ success: false, message: 'adId is required' });
    }

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }

    // Check if already applied
    if (ad.appliedInfluencers.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Already applied to this ad' });
    }

    // Update ad
    ad.appliedInfluencers.addToSet(userId);
    ad.notInterestedInfluencers.pull(userId);
    await ad.save();

    res.json({ success: true, message: 'Applied for ad successfully' });
  } catch (error) {
    console.error('Error applying for ad:', error);
    res.status(500).json({ success: false, message: 'Server error applying for ad' });
  }
};

/**
 * @desc Mark an ad as "Not Interested"
 * @route POST /api/ads/not-interested
 * @access Private (Influencer)
 */
export const markNotInterested = async (req, res) => {
  try {
    const userId = req.user.id;
    const { adId } = req.body;

    if (!adId) {
      return res.status(400).json({ success: false, message: 'adId is required' });
    }

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }

    ad.notInterestedInfluencers.addToSet(userId);
    ad.appliedInfluencers.pull(userId);
    await ad.save();

    res.json({ success: true, message: 'Ad marked as not interested' });
  } catch (error) {
    console.error('Error marking ad as not interested:', error);
    res.status(500).json({ success: false, message: 'Server error marking ad as not interested' });
  }
};
