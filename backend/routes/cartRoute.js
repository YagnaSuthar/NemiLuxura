import express from "express";
import { 
    addToCart, 
    getCartItems, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    getCartCount 
} from "../controllers/cartController.js";

const cartRouter = express.Router();

// Add item to cart
cartRouter.post('/add', addToCart);

// Get cart items for a user
cartRouter.get('/items/:userId', getCartItems);

// Update cart item quantity
cartRouter.put('/update', updateCartItem);

// Remove item from cart
cartRouter.delete('/remove', removeFromCart);

// Clear entire cart
cartRouter.delete('/clear', clearCart);

// Get cart count (number of items)
cartRouter.get('/count/:userId', getCartCount);

export default cartRouter;
