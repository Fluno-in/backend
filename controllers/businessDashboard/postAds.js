import asyncHandler from 'express-async-handler';
import Ad from '../../models/Ad.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware to handle multipart/form-data for ad creation
const uploadAdImage = upload.single('image');

// @desc    Create a new ad
// @route   POST /api/postAds
// @access  Private
const createAd = asyncHandler(async (req, res) => {
  const {
    campaignName,
    platforms,
    startDate,
    endDate,
    taskCount,
    barterOrPaid,
    budget,
    requirements,
    campaignDescription,
  } = req.body;

  if (!campaignName || !platforms || !startDate || !endDate || !taskCount || !barterOrPaid) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const adData = {
    user: req.user._id,
    campaignName,
    platforms: Array.isArray(platforms) ? platforms : JSON.parse(platforms),
    startDate,
    endDate,
    taskCount,
    barterOrPaid,
    budget,
    requirements,
    campaignDescription,
  };

  if (req.file) {
    adData.image = `/uploads/${req.file.filename}`;
  }

  const ad = new Ad(adData);

  const createdAd = await ad.save();
  res.status(201).json(createdAd);
});

// @desc    Get ads posted by logged-in user
// @route   GET /api/postAds
// @access  Private
const getAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(ads);
});

// @desc    Delete an ad by ID
// @route   DELETE /api/postAds/:id
// @access  Private
const deleteAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(404);
    throw new Error('Ad not found');
  }

  if (ad.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this ad');
  }

  await Ad.deleteOne({ _id: req.params.id });
  res.json({ message: 'Ad removed' });
});

export { createAd, uploadAdImage, getAds, deleteAd };
