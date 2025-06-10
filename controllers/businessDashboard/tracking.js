
import asyncHandler from 'express-async-handler';
import Tracking from '../../models/Tracking.js';
import Request from '../../models/Request.js';

// @desc    Get tracking details for business by ad id
// @route   GET /api/businessDashboard/tracking/:adId
// @access  Private
const getTrackingDetailsForBusiness = asyncHandler(async (req, res) => {
  const businessId = req.user._id;
  const adId = req.params.adId;

  console.log('Business ID:', businessId);
  console.log('Ad ID:', adId);

  // Find tracking document by ad and business
  const tracking = await Tracking.findOne({
    ad: adId,
    business: businessId,
  }).populate('request').populate('ad');

  // console.log('Tracking found:', tracking);

  if (!tracking) {
    return res.json({ submissions: null, businessStatus: null, businessMessage: null, campaignName: null });
  }

  res.json({
    submissions: tracking.submissions,
    businessStatus: tracking.businessStatus,
    businessMessage: tracking.businessMessage,
    campaignName: tracking.ad?.campaignName || null,
  });
});

// @desc    Update business approval status and message for tracking
// @route   PATCH /api/businessDashboard/tracking/:adId
// @access  Private
const updateBusinessApproval = asyncHandler(async (req, res) => {
  const businessId = req.user._id;
  const adId = req.params.adId;
  const { businessStatus, businessMessage, submissionId } = req.body;

  if (!['approved', 'declined', 'pending', 'rejected'].includes(businessStatus)) {
    res.status(400);
    throw new Error('Invalid business status value');
  }

  const request = await Request.findOne({
    ad: adId,
    business: businessId,
  });

  if (!request) {
    res.status(404);
    throw new Error('Request not found for this ad and business');
  }

  const tracking = await Tracking.findOne({ request: request._id });

  if (!tracking) {
    res.status(404);
    throw new Error('Tracking details not found for this request');
  }

  if (submissionId) {
    // Update status/message for specific submission inside submissions array
    let updated = false;
    if (Array.isArray(tracking.submissions)) {
      for (let i = 0; i < tracking.submissions.length; i++) {
        if (tracking.submissions[i]._id && tracking.submissions[i]._id.toString() === submissionId) {
          tracking.submissions[i].status = businessStatus;
          tracking.submissions[i].businessMessage = businessMessage || '';
          console.log('Updated submission businessMessage:', tracking.submissions[i].businessMessage);
          updated = true;
          break;
        }
      }
      if (updated) {
        tracking.markModified('submissions');
      }
    } else if (tracking.submissions && tracking.submissions._id && tracking.submissions._id.toString() === submissionId) {
      // If submissions is a single object
      tracking.submissions.status = businessStatus;
      tracking.submissions.businessMessage = businessMessage || '';
      updated = true;
    }

    if (!updated) {
      res.status(404);
      throw new Error('Submission not found in submissions');
    }
  } else {
    // Update global status/message if no submissionId provided
    tracking.businessStatus = businessStatus;
    tracking.businessMessage = businessMessage || '';
  }

  console.log('Before save, submissions:', tracking.submissions);
  await tracking.save();
  console.log('After save, submissions:', tracking.submissions);

  res.json({ message: `Business status updated to ${businessStatus}` });
});

export { getTrackingDetailsForBusiness, updateBusinessApproval };
