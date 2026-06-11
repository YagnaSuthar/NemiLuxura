import Review from '../models/reviewModel.js';

// Add a new review
const addReview = async (req, res) => {
    try {
        const { productId, productName, productType, userName, userEmail, state, rating, reviewTitle, reviewText } = req.body;

        // Debug log to identify missing fields in incoming payload
        console.log('Incoming review payload:', {
            productId,
            productName,
            productType,
            userName,
            userEmail,
            state,
            rating,
            reviewTitle,
            reviewText
        });

        // Validate required fields
        if (!productType || !userName || !userEmail || !rating || !reviewTitle || !reviewText) {
            const missing = [];
            if (!productType) missing.push('productType');
            if (!userName) missing.push('userName');
            if (!userEmail) missing.push('userEmail');
            if (!rating) missing.push('rating');
            if (!reviewTitle) missing.push('reviewTitle');
            if (!reviewText) missing.push('reviewText');
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missing
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Normalize product fields
        const normalizedType = productType ? String(productType).toLowerCase() : 'other';
        const normalizedName = productName || (productType ? productType.charAt(0).toUpperCase() + productType.slice(1) : 'Unknown Product');

        // Convert productId to ObjectId if it's a valid ObjectId string
        let normalizedProductId = null;
        if (productId) {
            try {
                const mongoose = (await import('mongoose')).default;
                if (mongoose.Types.ObjectId.isValid(productId)) {
                    normalizedProductId = new mongoose.Types.ObjectId(productId);
                } else {
                    normalizedProductId = productId; // Keep as string if not valid ObjectId
                }
            } catch (e) {
                normalizedProductId = productId; // Fallback to original value
            }
        }

        const reviewData = {
            productId: normalizedProductId,
            productName: normalizedName,
            productType: ['foam', 'mattress', 'pillow'].includes(normalizedType) ? normalizedType : 'other',
            userName,
            userEmail,
            state: state || '',
            rating: Number(rating),
            reviewTitle,
            reviewText,
            status: 'pending'
        };

        const review = new Review(reviewData);
        await review.save();

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review: review
        });

    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting review: ' + error.message
        });
    }
};

// Get all reviews (for admin)
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            reviews: reviews
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews: ' + error.message
        });
    }
};

// Get reviews for home page (approved and showOnHome = true)
const getHomeReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            status: 'approved',
            showOnHome: true
        })
        .sort({ date: -1 })
        .limit(20); // Limit to 20 reviews for home page

        res.status(200).json({
            success: true,
            reviews: reviews
        });

    } catch (error) {
        console.error('Error fetching home reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching home reviews: ' + error.message
        });
    }
};

// Get reviews for a specific product (by productId or productName)
const getProductReviews = async (req, res) => {
    try {
        const mongoose = (await import('mongoose')).default;
        const { productId } = req.params;
        const { productName } = req.query; // Optional productName from query params

        // Check if productId is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
        
        let query = { status: 'approved' };
        let orConditions = [];
        
        // Priority 1: Search by productName if provided (most reliable)
        if (productName) {
            orConditions.push({ productName: productName });
            console.log('Searching by productName:', productName);
        }
        
        // Priority 2: Search by productId (try both ObjectId and string format)
        if (isValidObjectId) {
            // Try ObjectId format
            orConditions.push({ productId: new mongoose.Types.ObjectId(productId) });
            // Try string format
            orConditions.push({ productId: productId });
            // Try string comparison
            orConditions.push({ productId: String(productId) });
            console.log('Searching by productId:', productId);
        }
        
        // If we have OR conditions, use them
        if (orConditions.length > 0) {
            query.$or = orConditions;
        } else if (['foam', 'mattress', 'pillow'].includes(String(productId).toLowerCase())) {
            // If it's a static category (foam/mattress/pillow)
            query.productType = String(productId).toLowerCase();
        } else {
            // If no valid conditions, return empty
            console.log('No valid query conditions, returning empty reviews');
            return res.status(200).json({
                success: true,
                reviews: []
            });
        }
        
        console.log('Fetching reviews with query:', JSON.stringify(query, null, 2));
        
        // First, let's check all reviews (including pending) to debug
        const allReviews = await Review.find({
            $or: orConditions
        }).sort({ date: -1 });
        console.log(`Found ${allReviews.length} total reviews (including pending) for product ${productId}${productName ? ` (name: ${productName})` : ''}`);
        
        if (allReviews.length > 0) {
            console.log('All reviews found:', allReviews.map(r => ({
                productId: r.productId,
                productName: r.productName,
                userName: r.userName,
                status: r.status
            })));
        }
        
        // Now get only approved reviews
        const reviews = await Review.find(query).sort({ date: -1 });
        console.log(`Found ${reviews.length} approved reviews for product ${productId}${productName ? ` (name: ${productName})` : ''}`);
        
        if (reviews.length > 0) {
            console.log('Approved reviews:', reviews.map(r => ({
                productId: r.productId,
                productName: r.productName,
                userName: r.userName,
                status: r.status
            })));
        }

        res.status(200).json({
            success: true,
            reviews: reviews
        });

    } catch (error) {
        console.error('Error fetching product reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product reviews: ' + error.message
        });
    }
};

// Update review status (for admin)
const updateReviewStatus = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { status, showOnHome } = req.body;

        const updateData = {};
        
        if (status) {
            if (!['pending', 'approved', 'rejected'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be pending, approved, or rejected'
                });
            }
            updateData.status = status;
        }

        if (showOnHome !== undefined) {
            updateData.showOnHome = showOnHome === true || showOnHome === 'true';
        }

        const review = await Review.findByIdAndUpdate(
            reviewId,
            updateData,
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            review: review
        });

    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review status: ' + error.message
        });
    }
};

// Delete review (for admin)
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByIdAndDelete(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review: ' + error.message
        });
    }
};

export {
    addReview,
    getAllReviews,
    getHomeReviews,
    getProductReviews,
    updateReviewStatus,
    deleteReview
};
