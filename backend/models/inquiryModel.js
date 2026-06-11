import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['Retail', 'Bulk'], 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    subject: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Read', 'Replied', 'Archived'], 
        default: 'Pending' 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

const inquiryModel = mongoose.models.inquiry || mongoose.model("inquiry", inquirySchema);

export default inquiryModel;
