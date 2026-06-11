import cartModel from '../models/cartModel.js';
import productModel from '../models/productModel.js';

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity, size } = req.body;

        // Validate required fields
        if (!userId || !productId || !quantity || !size) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, productId, quantity, size'
            });
        }

        // Check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Validate size
        if (!product.sizes.includes(size)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid size for this product'
            });
        }

        // Find or create cart for user
        let cart = await cartModel.findOne({ userId });
        
        if (!cart) {
            cart = new cartModel({ userId, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId && item.size === size
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            cart.items.push({
                productId,
                quantity,
                size,
                price: product.price
            });
        }

        // Calculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();

        // Populate product details for response
        await cart.populate('items.productId');

        res.status(200).json({
            success: true,
            message: 'Item added to cart successfully',
            cart: cart
        });

    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get cart items
export const getCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const cart = await cartModel.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: 'Cart is empty',
                cart: { items: [], totalAmount: 0 }
            });
        }

        res.status(200).json({
            success: true,
            cart: cart
        });

    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;

        if (!userId || !itemId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, itemId, quantity'
            });
        }

        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();
        await cart.populate('items.productId');

        res.status(200).json({
            success: true,
            message: 'Cart item updated successfully',
            cart: cart
        });

    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        if (!userId || !itemId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, itemId'
            });
        }

        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Remove item
        cart.items.splice(itemIndex, 1);

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();
        await cart.populate('items.productId');

        res.status(200).json({
            success: true,
            message: 'Item removed from cart successfully',
            cart: cart
        });

    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            cart: cart
        });

    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get cart count (number of items)
export const getCartCount = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const cart = await cartModel.findOne({ userId });
        const itemCount = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

        res.status(200).json({
            success: true,
            count: itemCount
        });

    } catch (error) {
        console.error('Error getting cart count:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
