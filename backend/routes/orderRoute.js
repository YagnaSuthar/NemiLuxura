import express from 'express';
import { 
    getAllOrders, 
    getOrderDetails, 
    updateOrderStatus, 
    getOrdersByStatus, 
    getOrderStats 
} from '../controllers/orderController.js';
import adminAuth from '../middlewares/adminAuth.js';

const orderRouter = express.Router();

// Get all orders (admin only)
orderRouter.get('/list', adminAuth, getAllOrders);

// Get order statistics (admin only)
orderRouter.get('/stats', adminAuth, getOrderStats);

// Get orders by status (admin only)
orderRouter.get('/status/:status', adminAuth, getOrdersByStatus);

// Get single order details (admin only)
orderRouter.post('/details', adminAuth, getOrderDetails);

// Update order status (admin only)
orderRouter.post('/update', adminAuth, updateOrderStatus);

export default orderRouter;
