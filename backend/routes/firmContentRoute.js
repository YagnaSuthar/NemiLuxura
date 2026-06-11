import express from 'express';
import { getFirmContent, upsertFirmHeroImage, upsertFirmItem, deleteFirmItem } from '../controllers/firmContentController.js';
import upload from '../middlewares/multer.js';
import adminAuth from '../middlewares/adminAuth.js';

const firmContentRouter = express.Router();

// Public route to get all Firm page content
firmContentRouter.get('/content', getFirmContent);

// Admin routes
firmContentRouter.post('/hero', adminAuth, upload.single('image'), upsertFirmHeroImage);
firmContentRouter.post('/item', adminAuth, upsertFirmItem);
firmContentRouter.put('/item', adminAuth, upsertFirmItem);
firmContentRouter.delete('/item/:id', adminAuth, deleteFirmItem);

export default firmContentRouter;


