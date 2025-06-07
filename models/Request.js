import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
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
      ref: 'User', // Assuming business is a User with business role
      required: true,
    },
    message: {
      type: String,
    },
    budget: {
      type: Number,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model('Request', requestSchema);

export default Request;
