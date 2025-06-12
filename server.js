import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

//  Import Auth and onboarding routes
import authRoutes from './routes/authRoutes/authRoutes.js';
import verifyOtpRoutes from './routes/authRoutes/verifyOtpRoutes.js';
import passwordRoutes from './routes/authRoutes/passwordRoutes.js';
import onboardingRoutes from './routes/authRoutes/onboardingRoutes.js';

// Import linkedSocial- Instagram routes
import instagramRoutes from './routes/linkedSocialRoutes/instagramRoutes.js';
import LinkSocialsRoutes from './routes/linkedSocialRoutes/linkSocialsRoutes.js';
import instagramInsightsRoutes from './routes/linkedSocialRoutes/instagramInsightsRoutes.js';

// Import business dashboard routes
import businessInfo from './routes/businessDashboard/businessInfo.js';
import postAds from './routes/businessDashboard/postAds.js';
import availableInfluencers from './routes/businessDashboard/availableInfluencers.js';  
import postRequest from './routes/businessDashboard/requestAds.js';
import businessTrackingRoutes from './routes/businessDashboard/tracking.js';

// Import influencer dashboard routes
import personalInfo from './routes/influencerDashboard/personalInfo.js';
import availableAds from './routes/influencerDashboard/availableAds.js';
import postRequestInfluencer from './routes/influencerDashboard/requestAds.js';
import influencerTrackingRoutes from './routes/influencerDashboard/tracking.js';

// Import contact us, notification, profileImage routes
import contactRoutes from './routes/contactRoutes.js';
import fetchNotificationRoutes from './routes/sharedDashboard/notificationRoutes.js';
import createNotificationRoutes from './routes/sharedDashboard/createNotificationRoutes.js';
import profileImageRoutes from './routes/sharedDashboard/profileImageRoutes.js';

// Import error handling middleware
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-lapz.onrender.com',
  'https://suzao.netlify.app'
];

// Proper CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// API Authentication and Onboarding Routes
app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/verify-otp', verifyOtpRoutes);
app.use('/api/onboarding', onboardingRoutes);

// Linked Socials - Instagram Routes
app.use('/api/instagram', instagramRoutes);
app.use('/api/linkSocials', LinkSocialsRoutes);
app.use('/api/instagramInsights', instagramInsightsRoutes);

// Business Dashboard Routes
app.use('/api/business-info', businessInfo);
app.use('/api/postAds', postAds);
app.use('/api/availableInfluencers', availableInfluencers);
app.use('/api/businessDashboard/tracking', businessTrackingRoutes);
app.use('/api/requestAds', postRequest);

// Influencer Dashboard Routes
app.use('/api/personal-info', personalInfo);
app.use('/api/availableAds', availableAds);
app.use('/api/influencerDashboard/requestAds', postRequestInfluencer);
app.use('/api/influencerDashboard/tracking', influencerTrackingRoutes);

// Contact Routes
app.use('/api/contact', contactRoutes);
// Notification Routes
app.use('/api/notifications', fetchNotificationRoutes);
app.use('/api/notifications/create', createNotificationRoutes);
// Profile Image Routes
app.use('/api/profileImage', profileImageRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
