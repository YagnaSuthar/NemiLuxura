import inquiryModel from "../models/inquiryModel.js";

// @desc    Submit a new inquiry (Retail or Bulk)
// @route   POST /api/inquiries/submit
// @access  Public
const submitInquiry = async (req, res) => {
    try {
        const { type, name, email, subject, message } = req.body;

        // Validation
        if (!type || !name || !email || !subject || !message) {
            return res.json({ success: false, message: "All fields are required" });
        }

        if (type !== 'Retail' && type !== 'Bulk') {
            return res.json({ success: false, message: "Invalid inquiry type" });
        }

        const newInquiry = new inquiryModel({
            type,
            name,
            email,
            subject,
            message
        });

        await newInquiry.save();

        res.json({ 
            success: true, 
            message: "Message sent successfully! Our team will contact you soon." 
        });

    } catch (error) {
        console.error("Error submitting inquiry:", error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries/all
// @access  Private (Admin)
const getInquiries = async (req, res) => {
    try {
        const inquiries = await inquiryModel.find({}).sort({ date: -1 });
        res.json({ success: true, inquiries });
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/status/:id
// @access  Private (Admin)
const updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.json({ success: false, message: "Status is required" });
        }

        const validStatuses = ['Pending', 'Read', 'Replied', 'Archived'];
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid status value" });
        }

        const updatedInquiry = await inquiryModel.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );

        if (!updatedInquiry) {
            return res.json({ success: false, message: "Inquiry not found" });
        }

        res.json({ 
            success: true, 
            message: `Inquiry status updated to ${status} successfully`,
            inquiry: updatedInquiry
        });

    } catch (error) {
        console.error("Error updating inquiry status:", error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/delete/:id
// @access  Private (Admin)
const deleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedInquiry = await inquiryModel.findByIdAndDelete(id);

        if (!deletedInquiry) {
            return res.json({ success: false, message: "Inquiry not found" });
        }

        res.json({ success: true, message: "Inquiry deleted successfully" });

    } catch (error) {
        console.error("Error deleting inquiry:", error);
        res.json({ success: false, message: error.message });
    }
};

export {
    submitInquiry,
    getInquiries,
    updateInquiryStatus,
    deleteInquiry
};
