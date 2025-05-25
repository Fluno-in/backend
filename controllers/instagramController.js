import axios from 'axios';
import qs from 'qs';
import LinkSocials from '../models/LinkSocials.js';
import jwt from 'jsonwebtoken';

export const redirectToInstagramLogin = (req, res) => {
  // Accept state parameter from query or generate empty string
  const state = req.query.state || '';
  const redirectUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights&state=${encodeURIComponent(state)}`;

  console.log("🔁 Initiating Instagram OAuth...");
  console.log(`🌐 Redirecting to: ${redirectUrl}`);
  res.redirect(redirectUrl);
};

export const handleInstagramCallback = async (req, res) => {
  const { code, state } = req.query;
  console.log("📥 Received callback from Instagram.");

  if (!code) {
    console.error("❌ Authorization code missing from query.");
    return res.status(400).json({ error: "Authorization code missing" });
  }

  console.log("🔑 Authorization code received:", code);
  console.log("🔎 State parameter received:", state);

  try {
    const payload = qs.stringify({
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: process.env.REDIRECT_URI,
      code,
    });

    const tokenRes = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      payload,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const shortToken = tokenRes.data.access_token;
    const instagramUserId = tokenRes.data.user_id;

    console.log("✅ Access token received:", shortToken);
    console.log("👤 Instagram user ID:", instagramUserId);

    const userInfoRes = await axios.get(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${shortToken}`
    );

    console.log("✅ User profile data fetched successfully:");
    console.log(userInfoRes.data);

    // Decode and verify state parameter to get userId
    let userId = null;
    if (state) {
      try {
        const decoded = jwt.verify(state, process.env.JWT_SECRET);
        userId = decoded.id || null;
      } catch (err) {
        console.error("❌ Invalid JWT token in state parameter:", err.message);
        return res.status(401).send("User not authenticated");
      }
    }

    if (!userId) {
      console.error("❌ User not authenticated - state parameter missing or invalid.");
      return res.status(401).send("User not authenticated");
    }

    let linkSocials = await LinkSocials.findOne({ user: userId });
    if (!linkSocials) {
      linkSocials = new LinkSocials({ user: userId });
    }
    linkSocials.instagram = userInfoRes.data.id;
    linkSocials.instagram_username = userInfoRes.data.username || '';
    linkSocials.instagram_account_type = userInfoRes.data.account_type || '';
    linkSocials.instagram_linked = true;
    await linkSocials.save();
    console.log("✅ Instagram info saved to LinkSocials model.");

    const redirectFrontendUrl = `${process.env.FRONTEND_URL}/onboarding/LinkSocials?connected=instagram`;
    console.log("🚀 Redirecting to frontend LinkSocials page.");
    res.redirect(redirectFrontendUrl);

  } catch (err) {
    console.error("❌ Error during Instagram auth callback:", err.message);
    if (err.response) {
      console.error("📦 Instagram Error Response:", err.response.data);
    }
    res.status(500).send("Error during authentication");
  }
};
