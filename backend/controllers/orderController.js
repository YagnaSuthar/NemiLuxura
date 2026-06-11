import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
            .populate('userId', 'name email')
            .populate('products.productId', 'name image price')
            .sort({ orderDate: -1 });
        
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get single order details
const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId)
            .populate('userId', 'name email phone')
            .populate('products.productId', 'name image price category');
        
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }
        
        res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: 'Invalid status' });
        }
        
        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { 
                status,
                ...(status === 'Delivered' && { deliveryDate: new Date() })
            },
            { new: true }
        ).populate('userId', 'name email')
         .populate('products.productId', 'name image price');
        
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }
        
        res.json({ success: true, message: 'Order status updated successfully', order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get orders by status
const getOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const orders = await orderModel.find({ status })
            .populate('userId', 'name email')
            .populate('products.productId', 'name image price')
            .sort({ orderDate: -1 });
        
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get order statistics
const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments();
        const pendingOrders = await orderModel.countDocuments({ status: 'Pending' });
        const processingOrders = await orderModel.countDocuments({ status: 'Processing' });
        const shippedOrders = await orderModel.countDocuments({ status: 'Shipped' });
        const deliveredOrders = await orderModel.countDocuments({ status: 'Delivered' });
        
        const totalRevenue = await orderModel.aggregate([
            { $match: { status: 'Delivered' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        
        res.json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { 
    getAllOrders, 
    getOrderDetails, 
    updateOrderStatus, 
    getOrdersByStatus, 
    getOrderStats 
};
