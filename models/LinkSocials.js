import mongoose from 'mongoose';

const linkSocialsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    instagram_username: {
      type: String,
    },
    instagram_account_type: {
      type: String,
    },
    instagram_linked: {
      type: Boolean,
      default: false,
    },
    twitter: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    youtube: {
      type: String,
    },
    tiktok: {
      type: String,
    },
    other: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const LinkSocials = mongoose.model('LinkSocials', linkSocialsSchema);

export default LinkSocials;
