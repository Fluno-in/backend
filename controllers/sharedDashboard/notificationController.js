import Notification from '../../models/Notification.js';

/**
 * Get notifications for a user
 * @param {Object} req
 * @param {Object} res
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ user: userId }).sort({ time: -1 });
    // Ensure response is always an array
    if (!Array.isArray(notifications)) {
      return res.json([]);
    }
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};
