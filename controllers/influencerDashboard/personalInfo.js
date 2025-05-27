import InfluencerOnboarding from '../../models/InfluencerOnboarding.js';

// Get personal info by user id
export const getPersonalInfo = async (req, res) => {
  try {
    const personalInfo = await InfluencerOnboarding.findOne({ user: req.user._id });
    if (!personalInfo) {
      return res.status(404).json({ message: 'Personal info not found' });
    }
    res.json(personalInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update personal info
export const upsertPersonalInfo = async (req, res) => {
  try {
    const data = req.body;
    let personalInfo = await InfluencerOnboarding.findOne({ user: req.user._id });
    if (personalInfo) {
      // Update
      personalInfo = Object.assign(personalInfo, data);
      await personalInfo.save();
    } else {
      // Create
      personalInfo = new InfluencerOnboarding({ ...data, user: req.user._id });
      await personalInfo.save();
    }
    res.json(personalInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
