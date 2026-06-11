import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import '../CSS/pages/Cart.css';

const ShoppingCart = ({ isOpen, toggleCart }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, cartCount, updateCartItem, removeFromCart, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  // Check authentication when cart opens
  useEffect(() => {
    if (isOpen && !isAuthenticated()) {
      toggleCart(); // Close cart
      navigate('/login'); // Redirect to login
    }
  }, [isOpen, isAuthenticated, navigate, toggleCart]);


  const handleUpdateQuantity = async (itemId, action) => {
    const item = cartItems.find(item => item._id === itemId);
    if (!item) return;

    let newQuantity = item.quantity;
    if (action === 'increment') {
      newQuantity = item.quantity + 1;
    } else if (action === 'decrement' && item.quantity > 1) {
      newQuantity = item.quantity - 1;
    }

    if (newQuantity !== item.quantity) {
      setLoading(true);
      await updateCartItem(itemId, newQuantity);
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setLoading(true);
    await removeFromCart(itemId);
    setLoading(false);
  };

  const handleClearCart = async () => {
    setLoading(true);
    await clearCart();
    setLoading(false);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;

    // Close the cart panel
    toggleCart();

    // Navigate to payment page with cart data
    navigate('/payment', {
      state: {
        cartItems: cartItems.map(item => ({
          id: item._id,
          name: item.productId?.name || 'Product',
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.productId?.image?.[0] || '/placeholder-image.jpg'
        })),
        subtotal: getCartTotal(),
        shipping: 'Free',
        total: getCartTotal()
      }
    });
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 'Free' : 0;
  const total = subtotal;

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="cart-overlay-cart" onClick={toggleCart}></div>}

      {/* Cart Panel */}
      <div className={`cart-panel-cart ${isOpen ? 'open-cart' : ''}`}>
        <div className="cart-header-cart">
          <h2 className="cart-title-cart">Shopping Cart</h2>
          <button className="cart-close-btn-cart" onClick={toggleCart}>✕</button>
        </div>

        <div className="cart-count-cart">
          {cartCount} item(s) in your cart
        </div>

        <div className="cart-items-container-cart">
          {cartItems.length === 0 ? (
            <div className="empty-cart-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item._id} className="cart-item-cart">
                <img
                  src={item.productId?.image?.[0] || '/placeholder-image.jpg'}
                  alt={item.productId?.name || 'Product'}
                  className="cart-item-image-cart"
                />

                <div className="cart-item-details-cart">
                  <h3 className="cart-item-name-cart">{item.productId?.name || 'Product'}</h3>
                  <p className="cart-item-size-cart">Size: {item.size}</p>
                  <p className="cart-item-price-cart">₹{item.price.toLocaleString('en-IN')}</p>
                </div>

                <div className="cart-item-actions-cart">
                  <div className="cart-item-quantity-cart">
                    <button
                      className="quantity-btn-cart"
                      onClick={() => handleUpdateQuantity(item._id, 'decrement')}
                      disabled={loading}
                    >
                      -
                    </button>
                    <span className="quantity-display-cart">{item.quantity}</span>
                    <button
                      className="quantity-btn-cart"
                      onClick={() => handleUpdateQuantity(item._id, 'increment')}
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-item-btn-cart"
                    onClick={() => handleRemoveItem(item._id)}
                    disabled={loading}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer-cart">
            <div className="order-summary-cart">
              <h3 className="summary-title-cart">Order Summary</h3>

              <div className="summary-row-cart">
                <span className="summary-label-cart">Subtotal</span>
                <span className="summary-value-cart">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-row-cart">
                <span className="summary-label-cart">Shipping</span>
                <span className="summary-value-free-cart">{shipping}</span>
              </div>

              <div className="summary-row-total-cart">
                <span className="summary-label-total-cart">Total</span>
                <span className="summary-value-total-cart">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              className="proceed-checkout-btn-cart"
              onClick={handleProceedToCheckout}
              disabled={loading || cartItems.length === 0}
            >
              🛒 Proceed to Checkout
            </button>

            <button
              className="clear-cart-btn-cart"
              onClick={handleClearCart}
              disabled={loading}
            >
              {loading ? 'Clearing...' : 'Clear Cart'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;