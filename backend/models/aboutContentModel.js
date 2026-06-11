import mongoose from "mongoose"

const aboutContentSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        enum: [
            'heroImage',           // Mission/Vision section image
            'team'                 // Team member images
        ]
    },
    // For hero image
    imageUrl: {
        type: String,
        required: function() { return this.section === 'heroImage'; }
    },
    // For team member images
    teamMemberIndex: {
        type: Number,
        required: function() { return this.section === 'team'; }
    },
    date: {
        type: Number,
        default: Date.now
    }
})

// Force model recreation to ensure schema changes take effect
delete mongoose.models.aboutContent;
const aboutContentModel = mongoose.model("aboutContent", aboutContentSchema);

export default aboutContentModel;

