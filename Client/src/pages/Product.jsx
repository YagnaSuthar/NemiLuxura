import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import apiService from '../services/apiService';
import '../CSS/pages/Product.css';


const ProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');


  const scrollToFooter = () => {
    document
      .getElementById('footer-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = async () => {
    if (!product) return;

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

      // Get default size - product.size is a string, or get from sizes array
      let size = product.size || 'Queen';
      if (!size && product.sizes && product.sizes.length > 0) {
        // If sizes is array of objects, get the id, otherwise use the first element
        size = typeof product.sizes[0] === 'object' ? product.sizes[0].id : product.sizes[0];
      }
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

  // Fetch product from database
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching product with ID:', productId);
        const data = await apiService.getProduct(productId);

        if (data.success && data.product) {
          console.log('Product data received:', data.product);

          // Calculate original price from discount
          const discount = data.product.discount || 0;
          const price = data.product.price || 0;
          const originalPrice = discount > 0
            ? Math.round(price / (1 - discount / 100))
            : price;

          // Transform backend data to match frontend format
          const transformedProduct = {
            _id: data.product._id, // Keep _id for MongoDB compatibility
            id: data.product._id, // Also keep id for frontend compatibility
            name: data.product.name,
            description: data.product.description,
            price: price,
            originalPrice: originalPrice,
            badge: data.product.bestseller ? 'Best Seller' : '',
            bestseller: data.product.bestseller || false,
            reviews: 0, // Can be fetched from reviews API if needed
            // Use all images from database - these are the multiple images uploaded by admin
            images: data.product.image && data.product.image.length > 0
              ? data.product.image
              : ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'],
            sizes: data.product.sizes && data.product.sizes.length > 0
              ? data.product.sizes.map((size) => ({
                id: size,
                label: size,
                dimensions: `${size} Size`,
                price: price
              }))
              : [{ id: 'default', label: 'Default', dimensions: 'Standard Size', price: price }],
            category: data.product.category || 'Mattress',
            subCategory: data.product.subCategory || 'General',
            firmness: data.product.firmness || 'Medium',
            size: data.product.size || 'Queen',
            rating: data.product.rating || 4.5,
            discount: discount,
            point1: data.product.point1 || '',
            point2: data.product.point2 || '',
            point3: data.product.point3 || '',
            specifications: data.product.specifications || []
          };

          console.log('Transformed product:', transformedProduct);
          setProduct(transformedProduct);
          setSelectedImage(0); // Reset to first image
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error fetching product: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Get product-specific features based on product type
  const getProductFeatures = () => {
    if (!product) return [];

    if (product.subCategory === 'Memory Foam') {
      return [
        { icon: '💤', title: 'Memory Foam Technology', subtitle: 'Adapts to your body shape' },
        { icon: '🌡️', title: 'Cooling Gel Layer', subtitle: 'Temperature regulation' },
        { icon: '🛏️', title: 'All Sleep Positions', subtitle: 'Perfect for side and back sleepers' }
      ];
    } else if (product.subCategory === 'Orthopedic') {
      return [
        { icon: '🛌', title: 'Spinal Alignment', subtitle: 'Promotes proper posture' },
        // rest ...
        { icon: '💪', title: 'Firm Support', subtitle: 'Ideal for back pain relief' },
        { icon: '🏥', title: 'Orthopedic Design', subtitle: 'Medical-grade support' }
      ];
    } else if (product.subCategory === 'Body Contour') {
      return [
        { icon: '🌿', title: 'Hypoallergenic', subtitle: 'OEKO-TEX® certified fabric' },
        { icon: '🛡️', title: 'Anti-Bug Protection', subtitle: 'Prevents allergies & bed bugs' },
        { icon: '⚖️', title: 'Body Balanced', subtitle: 'Adjusts to sleeping position' }
      ];
    }

    return [];
  };

  // State for product reviews
  const [productReviews, setProductReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch product-specific reviews dynamically
  useEffect(() => {
    const fetchProductReviews = async () => {
      if (!product) {
        console.log('Product not available');
        return;
      }

      try {
        setReviewsLoading(true);
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';
        const productId = product.id || product._id;
        const productName = product.name;

        console.log('Fetching reviews for product:', {
          productId,
          productName,
          product: product
        });

        // Fetch by both productId and productName to ensure we get all reviews
        const url = `${API_BASE_URL}/review/product/${productId}${productName ? `?productName=${encodeURIComponent(productName)}` : ''}`;
        console.log('Reviews API URL:', url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        const data = await response.json();
        console.log('Reviews API response:', data);
        console.log('Number of reviews found:', data.reviews?.length || 0);

        if (data.success && data.reviews && data.reviews.length > 0) {
          console.log(`Found ${data.reviews.length} reviews for product "${productName}"`);
          // Filter reviews to match this specific product name (extra safety check)
          const matchingReviews = data.reviews.filter(review =>
            review.productName === productName ||
            review.productId?.toString() === productId?.toString() ||
            review.productId === productId
          );

          console.log(`After filtering by product name, ${matchingReviews.length} reviews match`);

          // Transform API reviews to match component format
          const transformedReviews = matchingReviews.map((review) => ({
            name: review.userName || 'Anonymous',
            date: new Date(review.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            rating: review.rating || 5,
            comment: review.reviewText || review.reviewTitle || '',
            state: review.state || ''
          }));
          setProductReviews(transformedReviews);
        } else {
          console.log('No reviews found for this product');
          setProductReviews([]);
        }
      } catch (error) {
        console.error('Error fetching product reviews:', error);
        setProductReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProductReviews();
  }, [product]);

  // Get product-specific reviews - use dynamic data
  const getProductReviews = () => {
    return productReviews;
  };

  // Get product specifications - use dynamic data if available, otherwise fallback to static
  const getProductSpecifications = () => {
    if (!product) return [];

    // Use dynamic specifications from product data if available
    if (product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0) {
      return product.specifications.map(spec => ({
        label: spec.key || '',
        value: spec.value || ''
      })).filter(spec => spec.label && spec.value);
    }

    // Fallback to static specifications based on subCategory
    if (product.subCategory === 'Memory Foam') {
      return [
        { label: 'Breathable sleep Surface', value: 'Soft & Breathable Fabric' },
        { label: 'Memory Foam Layer', value: 'Cooling Gel Memory Foam' },
        { label: 'Fast Responsive Layer', value: 'High-resilience (HR) foam' },
        { label: 'Supportive Base Layer', value: 'Sink-Resistant Foam' },
        { label: 'FlexAdapt Cover', value: 'FlexAdapt Breathable and Stretchy Fabric' }
      ];
    } else if (product.subCategory === 'Orthopedic') {
      return [
        { label: 'Firmness', value: 'Firm' },
        { label: 'Top Layer', value: 'Soft Knitted Fabric' },
        { label: 'Comfort Layer', value: 'Memory Foam' },
        { label: 'Support Layer', value: 'HR Foam + Bonded Foam' },
        { label: 'Base Layer', value: 'High-Density Foam' },
        { label: 'Foundation', value: 'Base Support Foam' }
      ];
    } else if (product.subCategory === 'Body Contour') {
      return [
        { label: 'Firmness', value: 'Medium Soft' },
        { label: 'Top Layer', value: 'Breathable Hypoallergenic Fabric' },
        { label: 'Comfort Layer', value: 'Shape Supportive Soft Foam' },
        { label: 'Body Contour', value: 'Cool Transition Body Contouring Foam' },
        { label: 'Core', value: 'High-Density HR Foam' },
        { label: 'Certification', value: 'OEKO-TEX® Standard 100' }
      ];
    }

    return [];
  };


  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'star-filled-productpage' : 'star-empty-productpage'}>
        ★
      </span>
    ));
  };

  return (
    <div className="container-productpage">
      {/* Loading State */}
      {loading && (
        <div className="loading-productpage">
          <div className="loading-spinner-productpage"></div>
          <p>Loading product...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-productpage">
          <p>Error: {error}</p>
          <button onClick={() => navigate('/collection')}>Back to Collection</button>
        </div>
      )}

      {/* Product Content - Only show when not loading and no error */}
      {!loading && !error && product && (
        <>
          <div className="breadcrumb-productpage">
            <button className="back-button-productpage" onClick={() => navigate('/collection')}>← Back to Shop</button>
          </div>

          <div className="product-layout-productpage">
            {/* Left Side - Images */}
            <div className="product-images-productpage">
              <div className="main-image-productpage">
                <button
                  className="fullscreen-toggle-productpage"
                  onClick={() => setIsFullscreenOpen(true)}
                  aria-label="View image in fullscreen"
                >
                  ⤢
                </button>
                <img
                  src={product.images && product.images[selectedImage] ? product.images[selectedImage] : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
                  }}
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="thumbnail-gallery-productpage">
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      className={`thumbnail-productpage ${selectedImage === index ? 'active-productpage' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Product Details */}
            <div className="product-details-productpage">
              <div className="badge-productpage">{product.badge}</div>
              <h1 className="product-title-productpage">{product.name}</h1>

              <div className="rating-section-productpage">
                <div className="stars-productpage">
                  {renderStars(Math.floor(product.rating))}
                </div>
                <span className="rating-text-productpage">{product.rating}</span>
                <span className="reviews-text-productpage">
                  ({(() => {
                    // Generate a consistent number between 10-20 based on product ID
                    const hash = product.id ? product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
                    const views = 10 + (hash % 11); // Number between 10-20
                    return views;
                  })()} views)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons-productpage">
                <button
                  className="add-to-cart-btn-productpage"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  className="contact-btn-productpage"
                  onClick={scrollToFooter}
                >
                  Contact Us
                </button>
                {cartMessage && (
                  <div className={`cart-message-productpage ${cartMessage.includes('Added') ? 'success' : 'error'}`}>
                    {cartMessage}
                  </div>
                )}
              </div>

              {/* Features Section */}
              <div className="features-grid-productpage">
                {getProductFeatures().map((feature, index) => (
                  <div key={index} className="feature-item-productpage">
                    <div className="feature-icon-productpage">{feature.icon}</div>
                    <div className="feature-content-productpage">
                      <div className="feature-title-productpage">{feature.title}</div>
                      <div className="feature-subtitle-productpage">{feature.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isFullscreenOpen && (
            <div
              className="fullscreen-overlay-productpage"
              onClick={() => setIsFullscreenOpen(false)}
            >
              <div
                className="fullscreen-image-wrapper-productpage"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="close-fullscreen-productpage"
                  onClick={() => setIsFullscreenOpen(false)}
                  aria-label="Close fullscreen preview"
                >
                  ✕
                </button>
                <img
                  src={product.images && product.images[selectedImage] ? product.images[selectedImage] : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
                  }}
                />
              </div>
            </div>
          )}

          {/* Tabs Section */}
          <div className="tabs-section-productpage">
            <div className="tabs-header-productpage">
              <button
                className={`tab-btn-productpage ${activeTab === 'description' ? 'active-tab-productpage' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`tab-btn-productpage ${activeTab === 'specifications' ? 'active-tab-productpage' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button
                className={`tab-btn-productpage ${activeTab === 'reviews' ? 'active-tab-productpage' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>

            <div className="tab-content-productpage">
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className="description-content-productpage">
                  <h2 className="content-heading-productpage">Product Description</h2>
                  <p className="description-text-productpage">
                    {product.description}
                  </p>

                  <h3 className="content-subheading-productpage">Key Features</h3>
                  <div className="key-features-grid-productpage">
                    {product.point1 && (
                      <div className="key-feature-productpage">
                        <span className="checkmark-productpage">✓</span>
                        <span>{product.point1}</span>
                      </div>
                    )}
                    {product.point2 && (
                      <div className="key-feature-productpage">
                        <span className="checkmark-productpage">✓</span>
                        <span>{product.point2}</span>
                      </div>
                    )}
                    {product.point3 && (
                      <div className="key-feature-productpage">
                        <span className="checkmark-productpage">✓</span>
                        <span>{product.point3}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === 'specifications' && (
                <div className="specifications-content-productpage">
                  <h2 className="content-heading-productpage">Specifications</h2>
                  <div className="specs-table-productpage">
                    {getProductSpecifications().map((spec, index) => (
                      <div key={index} className="spec-row-productpage">
                        <div className="spec-label-productpage">{spec.label}</div>
                        <div className="spec-value-productpage">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="reviews-content-productpage">
                  <div className="reviews-header-productpage">
                    <h2 className="content-heading-productpage">Customer Reviews</h2>
                  </div>

                  {reviewsLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                      Loading reviews...
                    </div>
                  ) : getProductReviews().length > 0 ? (
                    <div className="reviews-list-productpage">
                      {getProductReviews().map((review, index) => (
                        <div key={index} className="review-item-productpage">
                          <div className="review-header-row-productpage">
                            <div className="review-author-productpage">
                              <div className="reviewer-name-productpage">{review.name}</div>
                              <div className="review-date-productpage">
                                {review.date}
                                {review.state && ` • ${review.state}`}
                              </div>
                            </div>
                            <div className="review-stars-productpage">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <p className="review-comment-productpage">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                      <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;