import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import '../CSS/components/Productlist.css';
import DescriptionToggle from './DescriptionToggle';

const ProductList = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  const scrollToFooter = () => {
    document
      .getElementById('footer-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to get safe values with N/A fallback
  const getSafeValue = (value, fallback = 'N/A') => {
    return value !== null && value !== undefined && value !== '' ? value : fallback;
  };

  // Create features array from point1, point2, point3 - always show 3 points
  const getFeatures = () => {
    console.log('ProductList - Product data:', {
      name: product.name,
      point1: product.point1,
      point2: product.point2,
      point3: product.point3
    });
    console.log('ProductList - Point1:', product.point1);
    console.log('ProductList - Point2:', product.point2);
    console.log('ProductList - Point3:', product.point3);
    return [
      product.point1 || 'N/A',
      product.point2 || 'N/A', 
      product.point3 || 'N/A'
    ];
  };

  // Get badge based on bestseller status
  const getBadge = () => {
    if (product.bestseller) return 'Best Seller';
    return null;
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };


  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    if (!isAuthenticated()) {
      // Redirect to login page
      navigate('/login');
      return;
    }

    // Add to cart
    try {
      setAddingToCart(true);
      setCartMessage('');
      
      // Get default size (use product.size or first available size)
      const size = product.size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Queen');
      const quantity = 1;
      
      const result = await addToCart(product.id, quantity, size);
      
      if (result.success) {
        setCartMessage('Added to cart!');
        // Clear message after 2 seconds
        setTimeout(() => setCartMessage(''), 2000);
      } else {
        setCartMessage(result.message || 'Failed to add to cart');
        // Clear error message after 3 seconds
        setTimeout(() => setCartMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage('Failed to add to cart. Please try again.');
      setTimeout(() => setCartMessage(''), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="card-productlist" onClick={handleCardClick}>
      {/* Badges - Show on hover */}
      <div className="badges-productlist">
        {getBadge() && (
          <span className="badge-type-productlist">{getBadge()}</span>
        )}
      </div>

      {/* Product Image */}
      <div className="image-wrapper-productlist">
        <img 
          src={getSafeValue(product.image, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+')} 
          alt={getSafeValue(product.name, 'Product')} 
          className="image-productlist"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
          }}
        />
        <div className="overlay-productlist">
          <button className="quick-view-productlist" onClick={handleViewDetails}>
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="content-productlist">
        <h3 className="title-productlist">{getSafeValue(product.name, 'Product Name')}</h3>
        <DescriptionToggle
          shortText={product.shortDescription}
          fullText={product.description || ''}
        />

        {/* Rating */}
        <div className="rating-wrapper-productlist">
          <div className="rating-productlist">
            <span className="star-productlist">⭐</span>
            <span className="score-productlist">{getSafeValue(product.rating, 4.5)}</span>
          </div>
          <span className="reviews-productlist">
            ({(() => {
              // Generate a consistent number between 10-20 based on product ID
              const hash = product.id ? product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
              const views = 10 + (hash % 11); // Number between 10-20
              return views;
            })()} views)
          </span>
        </div>

        {/* Firmness */}
        <div className="firmness-productlist">
          <span className="label-productlist">Firmness:</span>
          <span className="value-productlist">{getSafeValue(product.firmness, 'N/A')}</span>
        </div>

        {/* Features */}
        <ul className="features-productlist">
          {getFeatures().map((feature, index) => (
            <li key={index} className="feature-item-productlist">{feature}</li>
          ))}
        </ul>

        {/* Actions */}
        <div className="actions-productlist">
          <div className="actions-buttons-productlist">
            <button className="btn-primary-productlist" onClick={handleViewDetails}>
              View Details
            </button>
            <button
              className="btn-secondary-productlist"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
          {cartMessage && (
            <div className={`add-to-cart-message-productlist ${cartMessage.includes('Added') ? 'success' : 'error'}`}>
              {cartMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;