import Notification from '../../models/Notification.js';

/**
 * Create a new notification for a user
 * @param {Object} req
 * @param {Object} res
 */
export const createNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description, unread } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newNotification = new Notification({
      user: userId,
      title,
      description: description || '',
      unread: unread !== undefined ? unread : true,
      time: new Date(),
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
};
