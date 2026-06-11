import express from 'express';
const router = express.Router();
import { addReview, getAllReviews, getHomeReviews, getProductReviews, updateReviewStatus, deleteReview } from '../controllers/reviewController.js';

// Add a new review
router.post('/add', addReview);

// Get all reviews (for admin)
router.get('/all', getAllReviews);

// Get reviews for home page (approved and showOnHome = true)
router.get('/home', getHomeReviews);

// Get reviews for a specific product
router.get('/product/:productId', getProductReviews);

// Update review status (for admin)
router.put('/status/:reviewId', updateReviewStatus);

// Delete review (for admin)
router.delete('/delete/:reviewId', deleteReview);

export default router;
