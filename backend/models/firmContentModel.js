import mongoose from "mongoose"

const firmContentSchema = new mongoose.Schema({
    // foamHero, mattressHero, pillowHero, foamItem, mattressItem
    section: {
        type: String,
        required: true,
        enum: ['foamHero', 'mattressHero', 'pillowHero', 'foamItem', 'mattressItem']
    },
    // For hero entries (optional for list items)
    imageUrl: {
        type: String
    },
    // For list items
    title: {
        type: String
    },
    description: {
        type: String
    },
    stock: {
        type: String
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
delete mongoose.models.firmContent;
const firmContentModel = mongoose.model("firmContent", firmContentSchema);

export default firmContentModel;


