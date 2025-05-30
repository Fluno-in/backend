import axios from 'axios';
import LinkSocials from '../models/LinkSocials.js';

/**
 * Fetch Instagram insights for a given userId.
 * This function finds the linked Instagram account and calls Instagram Graph API.
 * Returns insights like followers count, media count, username, and profile picture.
 *
 * @param {String} userId - The ID of the user
 * @returns {Object|null} - Instagram insights or null if not found or failed
 */
const fetchInstagramInsights = async (userId) => {
  try {
    // Find user's linked Instagram data from LinkSocials model
    const linkSocials = await LinkSocials.findOne({ user: userId });

    if (
      !linkSocials ||
      !linkSocials.instagram ||
      !linkSocials.instagram.access_token ||
      !linkSocials.instagram.user_id
    ) {
      // If account not linked or token is missing
      console.warn(`No Instagram data for userId: ${userId}`);
      return null;
    }

    const accessToken = linkSocials.instagram.access_token;

    // Define the fields to fetch from Instagram Graph API
    const fields = 'followers_count,media_count,username,profile_picture_url';
    const url = `https://graph.instagram.com/me?fields=${fields}&access_token=${accessToken}`;

    // Make API call
    const response = await axios.get(url);
    return {
      followers_count: response.data.followers_count,
      media_count: response.data.media_count,
      username: response.data.username,
      profile_picture_url: response.data.profile_picture_url,
    };
  } catch (error) {
    console.error(`Instagram fetch failed for userId: ${userId}`, error?.response?.data || error.message);
    return null;
  }
};

export default fetchInstagramInsights;
