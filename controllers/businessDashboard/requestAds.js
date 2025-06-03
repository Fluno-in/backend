import asyncHandler from 'express-async-handler';
import InfluencerOnboarding from '../../models/InfluencerOnboarding.js';
import Ad from '../../models/Ad.js';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get influencer ad data by influencer ID
// @route   GET /api/requestAds/influencer/:influencerId
// @access  Private
const getInfluencerAds = asyncHandler(async (req, res) => {
  const influencerId = req.params.influencerId;

  const influencer = await InfluencerOnboarding.findOne({ user: influencerId });
  if (!influencer) {
    res.status(404);
    throw new Error('Influencer not found');
  }

  // Assuming influencer ads are stored in a field 'ads' or similar
  // Adjust field name as per actual schema
  const ads = influencer.ads || [];

  res.json(ads);
});

// @desc    Send request to influencer with selected ad or new campaign
// @route   POST /api/requestAds/sendRequest
// @access  Private
const sendRequestToInfluencer = asyncHandler(async (req, res) => {
  const {
    influencerId,
    adId, // optional if sending existing ad
  } = req.body;

  let campaignData = req.body.campaignData;
  if (typeof campaignData === 'string') {
    try {
      campaignData = JSON.parse(campaignData);
    } catch (error) {
      campaignData = null;
    }
  }

  if (!influencerId) {
    res.status(400);
    throw new Error('Influencer ID is required');
  }

  // If campaignData is provided, create new ad
  let ad;
  if (campaignData) {
    let imageData = null;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'ads',
        });
        imageData = {
          url: result.secure_url,
          public_id: result.public_id,
        };
        // Delete local file after upload
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Failed to delete local file:', err);
          }
        });
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500);
        throw new Error('Image upload failed');
      }
    }

    ad = new Ad({
      user: req.user._id,
      campaignName: campaignData.campaignName,
      platforms: campaignData.platforms,
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      taskCount: campaignData.taskCount,
      barterOrPaid: campaignData.barterOrPaid,
      budget: campaignData.budget,
      requirements: campaignData.requirements,
      campaignDescription: campaignData.campaignDescription,
      image: imageData,
    });
    ad = await ad.save();
  } else if (adId) {
    ad = await Ad.findById(adId);
    if (!ad) {
      res.status(404);
      throw new Error('Ad not found');
    }
  } else {
    res.status(400);
    throw new Error('Either adId or campaignData must be provided');
  }

  // TODO: Implement logic to send request to influencer
  // This could involve creating a Request or Application document linking ad and influencer
  // For now, just respond with success and ad info

  res.status(201).json({
    message: 'Request sent to influencer successfully',
    ad,
    influencerId,
  });
});

export { getInfluencerAds, sendRequestToInfluencer };
