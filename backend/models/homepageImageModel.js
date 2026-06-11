import mongoose from "mongoose"

const homepageImageSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['hero', 'featured'],
        default: 'hero'
    },
    imageUrl: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    date: {
        type: Number,
        default: Date.now
    }
})

// Force model recreation to ensure schema changes take effect
delete mongoose.models.homepageImage;
const homepageImageModel = mongoose.model("homepageImage", homepageImageSchema);

export default homepageImageModel;

