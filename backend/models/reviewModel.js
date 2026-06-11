import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    // productId is optional so we can store reviews for fixed categories (foam/mattress/pillow)
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    },
    productName: {
        type: String,
        required: true
    },
    // productType is used for static categories (foam/mattress/pillow)
    productType: {
        type: String,
        enum: ['foam', 'mattress', 'pillow', 'other'],
        default: 'other'
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewTitle: {
        type: String,
        required: true
    },
    reviewText: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    showOnHome: {
        type: Boolean,
        default: false
    },
    state: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Review', reviewSchema);
