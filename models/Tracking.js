import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    links: [
      {
        id: String,
        url: String,
        platform: String,
      }
    ],
    screenshot: String,
    notes: String,
    businessMessage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined', 'rejected'],
      default: 'pending',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const trackingSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
      unique: true,
    },
    ad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ad',
      required: true,
    },
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InfluencerOnboarding',
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    submissions: {
      type: [submissionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Tracking = mongoose.model('Tracking', trackingSchema);

export default Tracking;
