import mongoose from 'mongoose';

const adSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    campaignName: {
      type: String,
      required: true,
    },
    platforms: [
      {
        type: String,
        required: true,
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    taskCount: {
      type: Number,
      required: true,
    },
    barterOrPaid: {
      type: String,
      required: true,
      enum: ['barter', 'paid'],
    },
    budget: {
      type: Number,
      required: function () {
        return this.barterOrPaid === 'paid';
      },
    },
    requirements: {
      type: String,
    },
    image: {
      type: String,
    },
    campaignDescription: {
      type: String,
      default: '',
    },
    appliedInfluencers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    notInterestedInfluencers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Ad = mongoose.model('Ad', adSchema);

export default Ad;
