import express from 'express';
import { getHomepageImages, addHomepageImage, updateHomepageImage, deleteHomepageImage } from '../controllers/homepageImageController.js';
import upload from '../middlewares/multer.js';
import adminAuth from '../middlewares/adminAuth.js';

const homepageImageRouter = express.Router();

// Public route to get homepage images
homepageImageRouter.get('/list', getHomepageImages);

// Admin routes
homepageImageRouter.post('/add', adminAuth, upload.single('image'), addHomepageImage);
homepageImageRouter.post('/update', adminAuth, upload.single('image'), updateHomepageImage);
homepageImageRouter.post('/delete', adminAuth, deleteHomepageImage);

export default homepageImageRouter;

