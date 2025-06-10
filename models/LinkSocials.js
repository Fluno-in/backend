import mongoose from 'mongoose';

const instagramSubSchema = new mongoose.Schema({
  access_token: {
    type: String,
  },
  user_id: {
    type: String,
  },
  token_expiry: {
    type: Date,
  },
  linked: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

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
      type: instagramSubSchema,
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
  },
  {
    timestamps: true,
  }
);

const LinkSocials = mongoose.model('LinkSocials', linkSocialsSchema);

export default LinkSocials;
