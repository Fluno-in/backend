// import axios from 'axios';
// import qs from 'qs';
// import LinkSocials from '../models/LinkSocials.js';
// import jwt from 'jsonwebtoken';

// export const redirectToInstagramLogin = (req, res) => {
//   // Accept state parameter from query or generate empty string
//   const state = req.query.state || '';
//   const redirectUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights&state=${encodeURIComponent(state)}`;

//   console.log("🔁 Initiating Instagram OAuth...");
//   console.log(`🌐 Redirecting to: ${redirectUrl}`);
//   res.redirect(redirectUrl);
// };

// export const handleInstagramCallback = async (req, res) => {
//   const { code, state } = req.query;
//   console.log("📥 Received callback from Instagram.");

//   if (!code) {
//     console.error("❌ Authorization code missing from query.");
//     return res.status(400).json({ error: "Authorization code missing" });
//   }

//   console.log("🔑 Authorization code received:", code);
//   console.log("🔎 State parameter received:", state);

//   try {
//     const payload = qs.stringify({
//       client_id: process.env.INSTAGRAM_CLIENT_ID,
//       client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
//       grant_type: "authorization_code",
//       redirect_uri: process.env.REDIRECT_URI,
//       code,
//     });

//     const tokenRes = await axios.post(
//       "https://api.instagram.com/oauth/access_token",
//       payload,
//       { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//     );

//     const shortToken = tokenRes.data.access_token;
//     const instagramUserId = tokenRes.data.user_id;

//     console.log("✅ Access token received:", shortToken);
//     console.log("👤 Instagram user ID:", instagramUserId);

//     // Exchange short-lived token for long-lived token
//     try {
//       const longTokenRes = await axios.get(
//         `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortToken}`
//       );
//       const longLivedToken = longTokenRes.data.access_token;
//       console.log("🔄 Long-lived access token received:", longLivedToken);

//       // Use long-lived token for user info request
//       const userInfoRes = await axios.get(
//         `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${longLivedToken}`
//       );

//       console.log("✅ User profile data fetched successfully:");
//       console.log(userInfoRes.data);

//       // Decode and verify state parameter to get userId
//       let userId = null;
//       if (state) {
//         try {
//           const decoded = jwt.verify(state, process.env.JWT_SECRET);
//           userId = decoded.id || null;
//         } catch (err) {
//           console.error("❌ Invalid JWT token in state parameter:", err.message);
//           return res.status(401).send("User not authenticated");
//         }
//       }

//       if (!userId) {
//         console.error("❌ User not authenticated - state parameter missing or invalid.");
//         return res.status(401).send("User not authenticated");
//       }

//       let linkSocials = await LinkSocials.findOne({ user: userId });
//       if (!linkSocials) {
//         linkSocials = new LinkSocials({ user: userId });
//       }
//       if (!linkSocials.instagram) {
//         linkSocials.instagram = {};
//       }
//       linkSocials.instagram.access_token = longLivedToken || '';
//       linkSocials.instagram.user_id = instagramUserId || '';
//       linkSocials.instagram.account_type = userInfoRes.data.account_type || '';
//       linkSocials.instagram.linked = true;
//       await linkSocials.save();
//       console.log("✅ Instagram info - long-lived access_token, user_id, account_type saved to LinkSocials model.");

//       const redirectFrontendUrl = `${process.env.FRONTEND_URL}/onboarding/LinkSocials?connected=instagram`;
//       console.log("🚀 Redirecting to frontend LinkSocials page.");
//       res.redirect(redirectFrontendUrl);
//     } catch (exchangeErr) {
//       console.error("❌ Error exchanging long-lived token:", exchangeErr.message);
//       if (exchangeErr.response) {
//         console.error("📦 Instagram Token Exchange Error Response:", exchangeErr.response.data);
//       }
//       res.status(500).send("Error during token exchange");
//     }
//   } catch (err) {
//     console.error("❌ Error during Instagram auth callback:", err.message);
//     if (err.response) {
//       console.error("📦 Instagram Error Response:", err.response.data);
//     }
//     res.status(500).send("Error during authentication");
//   }
// };

import axios from 'axios';
import qs from 'qs';
import LinkSocials from '../models/LinkSocials.js';
import jwt from 'jsonwebtoken';

/**
 * Redirects user to Instagram OAuth authorization page
 */
export const redirectToInstagramLogin = (req, res) => {
  const state = req.query.state || '';
  const redirectUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights&state=${encodeURIComponent(state)}`;

  console.log("🔁 Initiating Instagram OAuth...");
  console.log(`🌐 Redirecting to: ${redirectUrl}`);
  res.redirect(redirectUrl);
};

/**
 * Handles Instagram OAuth callback, exchanges code for access token,
 * fetches user info, and stores long-lived token in DB
 */
export const handleInstagramCallback = async (req, res) => {
  const { code, state } = req.query;
  console.log("📥 Received callback from Instagram.");

  if (!code) {
    console.error("❌ Authorization code missing from query.");
    return res.status(400).json({ error: "Authorization code missing" });
  }

  try {
    // Exchange code for short-lived access token
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

    // Exchange short-lived token for long-lived token
    const longTokenRes = await axios.get(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortToken}`
    );

    const longLivedToken = longTokenRes.data.access_token;
    const expiresInSeconds = longTokenRes.data.expires_in;
    const expiryDate = new Date(Date.now() + expiresInSeconds * 1000);

    // Get Instagram profile info
    // const userInfoRes = await axios.get(
    //   `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${longLivedToken}`
    // );

    // Decode state JWT to get userId
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

    // Save Instagram token and info in DB
    let linkSocials = await LinkSocials.findOne({ user: userId });
    if (!linkSocials) {
      linkSocials = new LinkSocials({ user: userId });
    }
    if (!linkSocials.instagram) {
      linkSocials.instagram = {};
    }

    linkSocials.instagram.access_token = longLivedToken;
    linkSocials.instagram.token_expiry = expiryDate;
    linkSocials.instagram.user_id = instagramUserId;
    linkSocials.instagram.linked = true;

    await linkSocials.save();
    console.log("✅ Instagram info saved to LinkSocials model.");

    const redirectFrontendUrl = `${process.env.FRONTEND_URL}/onboarding/LinkSocials?connected=instagram`;
    res.redirect(redirectFrontendUrl);
  } catch (err) {
    console.error("❌ Error during Instagram auth callback:", err.message);
    if (err.response) {
      console.error("📦 Instagram Error Response:", err.response.data);
    }
    res.status(500).send("Error during authentication");
  }
};

/**
 * Refreshes the Instagram long-lived access token and updates DB
 * Should be called periodically (e.g., via cron or on dashboard load)
 */
export const refreshInstagramAccessToken = async (userId) => {
  try {
    const linkSocials = await LinkSocials.findOne({ user: userId });
    if (!linkSocials || !linkSocials.instagram || !linkSocials.instagram.access_token) {
      throw new Error("No Instagram token found for user.");
    }

    const currentToken = linkSocials.instagram.access_token;

    // Check if token is near expiry (within 5 days)
    const expiryDate = new Date(linkSocials.instagram.token_expiry);
    const fiveDaysBeforeExpiry = new Date(expiryDate.getTime() - 5 * 24 * 60 * 60 * 1000);

    if (Date.now() < fiveDaysBeforeExpiry.getTime()) {
      console.log("🔄 Token is still valid. No refresh needed.");
      return linkSocials.instagram.access_token;
    }

    console.log("🔄 Refreshing Instagram token...");

    const refreshRes = await axios.get(
      `https://graph.instagram.com/refresh_access_token`,
      {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: currentToken,
        },
      }
    );

    const refreshedToken = refreshRes.data.access_token;
    const expiresIn = refreshRes.data.expires_in;
    const newExpiry = new Date(Date.now() + expiresIn * 1000);

    linkSocials.instagram.access_token = refreshedToken;
    linkSocials.instagram.token_expiry = newExpiry;
    await linkSocials.save();

    console.log("✅ Refreshed token and updated database.");
    return refreshedToken;
  } catch (err) {
    console.error("❌ Failed to refresh Instagram access token:", err.message);
    throw err;
  }
};
