import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  unread: {
    type: Boolean,
    default: true,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
