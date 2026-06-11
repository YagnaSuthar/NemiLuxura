import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../CSS/pages/Payment.css';
import { CreditCard, Lock, CheckCircle, ArrowLeft, MapPin, Phone, Mail, Calendar, Package, Truck } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });

  // Get cart data from location state or use default
  const cartItems = location.state?.cartItems || [
    { id: 1, name: 'Premium Memory Foam Mattress', price: 25000, quantity: 1, image: '/api/placeholder/100/100' },
    { id: 2, name: 'Luxury Pillow Set', price: 3500, quantity: 2, image: '/api/placeholder/100/100' }
  ];

  // Use provided totals or calculate them
  const subtotal = location.state?.subtotal || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = location.state?.shipping === 'Free' ? 0 : 500;
  const tax = Math.round(subtotal * 0.18);
  const total = location.state?.total || (subtotal + shipping + tax);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData(prev => ({
      ...prev,
      cardNumber: value
    }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setFormData(prev => ({
      ...prev,
      expiryDate: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Redirect to success page after 3 seconds
      setTimeout(() => {
        navigate('/order-success', {
          state: {
            orderId: 'ORD-' + Date.now(),
            total: total,
            items: cartItems
          }
        });
      }, 3000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="payment-success-page">
        <div className="success-container">
          <div className="success-icon">
            <CheckCircle size={80} />
          </div>
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-message">
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>
          <div className="success-details">
            <p><strong>Order ID:</strong> ORD-{Date.now()}</p>
            <p><strong>Total Amount:</strong> ₹{total.toLocaleString()}</p>
          </div>
          <div className="success-actions">
            <button
              className="btn-primary"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/orders')}
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1 className="payment-title">Complete Your Purchase</h1>
          <div className="security-badge">
            <Lock size={16} />
            <span>Secure Payment</span>
          </div>
        </div>

        <div className="payment-content">
          {/* Payment Form */}
          <div className="payment-form-section">
            <div className="form-header">
              <h2>Payment Information</h2>
              <p>Enter your payment details to complete the order</p>
            </div>

            {/* Payment Method Selection */}
            <div className="payment-methods">
              <div
                className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={24} />
                <span>Credit/Debit Card</span>
              </div>
              <div
                className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <div className="upi-icon">UPI</div>
                <span>UPI Payment</span>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="payment-form">
              {paymentMethod === 'card' && (
                <div className="card-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="upi-form">
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input
                      type="email"
                      name="upiId"
                      placeholder="yourname@paytm"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="contact-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="shipping-section">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    rows="3"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`payment-btn ${isProcessing ? 'processing' : ''}`}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Pay ₹{total.toLocaleString()}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>

            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    <span className="item-price">₹{item.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}</span>
              </div>
              <div className="total-row">
                <span>Tax (18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="total-row total-final">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="delivery-info">
              <div className="delivery-item">
                <Truck size={20} />
                <div>
                  <h4>Free Delivery</h4>
                  <p>Estimated delivery: 3-5 business days</p>
                </div>
              </div>
              <div className="delivery-item">
                <Package size={20} />
                <div>
                  <h4>Easy Returns</h4>
                  <p>30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
