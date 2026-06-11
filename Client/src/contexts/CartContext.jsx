import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Fetch cart items when user logs in
  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [user, isAuthenticated]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await apiService.getCartItems(user.id);
      if (response.success) {
        setCartItems(response.cart.items || []);
        setCartCount(response.cart.items ? response.cart.items.reduce((total, item) => total + item.quantity, 0) : 0);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity, size) => {
    if (!isAuthenticated()) {
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      setLoading(true);
      const response = await apiService.addToCart(user.id, productId, quantity, size);
      if (response.success) {
        await fetchCartItems(); // Refresh cart items
        return { success: true, message: 'Item added to cart successfully' };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add item to cart' };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated()) return;

    try {
      setLoading(true);
      const response = await apiService.updateCartItem(user.id, itemId, quantity);
      if (response.success) {
        await fetchCartItems();
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated()) return;

    try {
      setLoading(true);
      const response = await apiService.removeFromCart(user.id, itemId);
      if (response.success) {
        await fetchCartItems();
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated()) return;

    try {
      setLoading(true);
      const response = await apiService.clearCart(user.id);
      if (response.success) {
        await fetchCartItems();
        return { success: true };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCartCount = () => {
    return cartCount;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    fetchCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
