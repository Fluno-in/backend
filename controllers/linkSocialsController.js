import LinkSocials from '../models/LinkSocials.js';

// Controller to get linked socials status for authenticated user
export const getLinkSocials = async (req, res) => {
  const userId = req.user ? req.user._id : null;
  console.log('getLinkSocials called for user:', userId);
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  try {
    const linkSocials = await LinkSocials.findOne({ user: userId });
    console.log('LinkSocials document:', linkSocials);
    if (!linkSocials) {
      return res.json({});
    }
    res.json({
      instagram: !!linkSocials.instagram,
      instagram_username: linkSocials.instagram_username || '',
      instagram_account_type: linkSocials.instagram_account_type || '',
      instagram_linked: linkSocials.instagram_linked || false,
      facebook: !!linkSocials.facebook,
      twitter: !!linkSocials.twitter,
      youtube: !!linkSocials.youtube,
      linkedin: !!linkSocials.linkedin,
      tiktok: !!linkSocials.tiktok,
      other: !!linkSocials.other,
    });
  } catch (err) {
    console.error('Error fetching linked socials:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const upsertLinkSocials = async (req, res) => {
  const userId = req.user ? req.user._id : null;
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const { platform, linked } = req.body;
  if (!platform || typeof linked !== 'boolean') {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  try {
    let linkSocials = await LinkSocials.findOne({ user: userId });
    if (!linkSocials) {
      linkSocials = new LinkSocials({ user: userId });
    }
    linkSocials[platform] = linked;
    await linkSocials.save();
    res.json({ message: 'Link socials updated successfully' });
  } catch (err) {
    console.error('Error updating linked socials:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
