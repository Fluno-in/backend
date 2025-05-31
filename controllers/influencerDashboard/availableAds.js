import Ad from '../../models/Ad.js';
import User from '../../models/User.js';

// Controller to get available ads for influencer
export const getAvailableAds = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user id is available in req.user from auth middleware

    // Fetch ads that are not marked as not interested by this user
    // Assuming User model has a field 'notInterestedAds' which is an array of ad IDs
    const user = await User.findById(userId);
    const notInterestedAds = user.notInterestedAds || [];

    // Fetch ads excluding those in notInterestedAds
    const ads = await Ad.find({ _id: { $nin: notInterestedAds } });

    res.json({ success: true, ads });
  } catch (error) {
    console.error('Error fetching available ads:', error);
    res.status(500).json({ success: false, message: 'Server error fetching ads' });
  }
};

// Controller to apply for an ad
export const applyForAd = async (req, res) => {
  try {
    const userId = req.user.id;
    const { adId } = req.body;

    if (!adId) {
      return res.status(400).json({ success: false, message: 'adId is required' });
    }

    // Here you would add logic to record the application, e.g. create an Application record
    // For now, just respond success
    // TODO: Implement application logic

    res.json({ success: true, message: 'Applied for ad successfully' });
  } catch (error) {
    console.error('Error applying for ad:', error);
    res.status(500).json({ success: false, message: 'Server error applying for ad' });
  }
};

// Controller to mark ad as not interested
export const markNotInterested = async (req, res) => {
  try {
    const userId = req.user.id;
    const { adId } = req.body;

    if (!adId) {
      return res.status(400).json({ success: false, message: 'adId is required' });
    }

    // Add adId to user's notInterestedAds array
    await User.findByIdAndUpdate(userId, { $addToSet: { notInterestedAds: adId } });

    res.json({ success: true, message: 'Ad marked as not interested' });
  } catch (error) {
    console.error('Error marking ad as not interested:', error);
    res.status(500).json({ success: false, message: 'Server error marking ad as not interested' });
  }
};
