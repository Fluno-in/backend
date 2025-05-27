import BusinessOnboarding from '../../models/BusinessOnboarding.js';

// Get business info by user id
export const getBusinessInfo = async (req, res) => {
  try {
    const businessInfo = await BusinessOnboarding.findOne({ user: req.user._id });
    if (!businessInfo) {
      return res.status(404).json({ message: 'Business info not found' });
    }
    res.json(businessInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update business info
export const upsertBusinessInfo = async (req, res) => {
  try {
    const data = req.body;
    let businessInfo = await BusinessOnboarding.findOne({ user: req.user._id });
    if (businessInfo) {
      // Update
      businessInfo = Object.assign(businessInfo, data);
      await businessInfo.save();
    } else {
      // Create
      businessInfo = new BusinessOnboarding({ ...data, user: req.user._id });
      await businessInfo.save();
    }
    res.json(businessInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
