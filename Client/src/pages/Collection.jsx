import React, { useState, useEffect } from 'react';
import ProductList from '../components/Productlist';
import apiService from '../services/apiService';
import '../CSS/pages/Collection.css';

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching products from database...');
        // Fetch all products from database
        const data = await apiService.getProducts();

        if (data.success && data.products) {
          console.log('Backend products received:', data.products.length, 'products');
          // Transform backend data to match frontend format
          const transformedProducts = data.products.map(product => {
            // Calculate original price from discount
            const discount = product.discount || 0;
            const price = product.price || 0;
            const originalPrice = discount > 0
              ? Math.round(price / (1 - discount / 100))
              : price;

            return {
              id: product._id,
              name: product.name,
              description: product.description,
              image: product.image && product.image.length > 0
                ? product.image[0]
                : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+',
              badge: product.bestseller ? 'Best Seller' : '',
              bestseller: product.bestseller || false,
              discount: discount,
              rating: product.rating || 4.5,
              firmness: product.firmness || 'Medium',
              size: product.size || 'Queen',
              sizes: product.sizes && Array.isArray(product.sizes) ? product.sizes : ['Queen'],
              point1: product.point1 || '',
              point2: product.point2 || '',
              point3: product.point3 || '',
              price: price,
              originalPrice: originalPrice,
              category: product.category || 'Mattress',
              subCategory: product.subCategory || 'General'
            };
          });

          setProducts(transformedProducts);
        } else {
          setError('Failed to fetch products: ' + (data.message || 'Unknown error'));
        }
      } catch (err) {
        const errorMessage = err.message || 'Unknown error occurred';
        setError(`Error fetching products: ${errorMessage}. Please ensure the backend server is running on port 4000.`);
        console.error('Error fetching products:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container-collection">
      <div className="wrapper-collection">
        {/* Loading State */}
        {loading && (
          <div className="loading-collection">
            <div className="loading-spinner-collection"></div>
            <p>Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-collection">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {/* Main Content - Only show when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Products Grid */}
            <div className="grid-collection">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card-wrapper-collection"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductList product={product} />
                </div>
              ))}
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default Collection;