import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import verifyOtpRoutes from './routes/verifyOtpRoutes.js';
import instagramRoutes from './routes/instagramRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import LinkSocialsRoutes from './routes/linkSocialsRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-lapz.onrender.com',
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

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/verify-otp', verifyOtpRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/linkSocials', LinkSocialsRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
