import express from 'express';
import { redirectToInstagramLogin, handleInstagramCallback } from '../../controllers/linkedSocialControllers/instagramController.js';
const router = express.Router();

// Protect the login route to ensure user is authenticated before starting OAuth
router.get('/login', redirectToInstagramLogin);

// Instagram OAuth callback route (public)
router.get('/callback', handleInstagramCallback);

export default router;
