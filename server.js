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

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173' || 'https://frontend-lapz.onrender.com' ,
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/verify-otp', verifyOtpRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/onboarding', onboardingRoutes) 
app.use('/api/linkSocials', LinkSocialsRoutes) 

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
