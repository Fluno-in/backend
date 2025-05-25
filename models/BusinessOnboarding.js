import mongoose from 'mongoose';

const businessOnboardingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessWebsite: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BusinessOnboarding = mongoose.model('BusinessOnboarding', businessOnboardingSchema);

export default BusinessOnboarding;
