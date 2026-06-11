import express from 'express';
import { submitInquiry, getInquiries, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController.js';
import adminAuth from '../middlewares/adminAuth.js';

const inquiryRouter = express.Router();

// Public route to submit an inquiry
inquiryRouter.post('/submit', submitInquiry);

// Admin routes (require token authentication)
inquiryRouter.get('/all', adminAuth, getInquiries);
inquiryRouter.put('/status/:id', adminAuth, updateInquiryStatus);
inquiryRouter.delete('/delete/:id', adminAuth, deleteInquiry);

export default inquiryRouter;
