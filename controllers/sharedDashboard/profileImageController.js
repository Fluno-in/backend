import fetchInstagramInsights from '../linkedSocialControllers/fetchInstagramInsights.js';

/**
 * Get profile image URL for a user
 * @param {Object} req
 * @param {Object} res
 */
export const getProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const instagramData = await fetchInstagramInsights(userId);
    if (instagramData && instagramData.profile_picture_url) {
      res.json({ profileImageUrl: instagramData.profile_picture_url });
    } else {
      res.status(404).json({ message: 'Profile image not found' });
    }
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ message: 'Failed to fetch profile image' });
  }
};
