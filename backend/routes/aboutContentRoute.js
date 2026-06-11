import express from 'express';
import { getAboutContent, upsertAboutHeroImage, upsertTeamImage, deleteAboutItem } from '../controllers/aboutContentController.js';
import upload from '../middlewares/multer.js';
import adminAuth from '../middlewares/adminAuth.js';

const aboutContentRouter = express.Router();

// Public route to get about images
aboutContentRouter.get('/content', getAboutContent);

// Admin routes
aboutContentRouter.post('/hero', adminAuth, upload.single('image'), upsertAboutHeroImage);
aboutContentRouter.post('/team', adminAuth, upload.single('image'), upsertTeamImage);
aboutContentRouter.post('/delete', adminAuth, deleteAboutItem);

export default aboutContentRouter;

