import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    notes: { type: String }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
