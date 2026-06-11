// API Service for Client
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

export const apiService = {
  // Product APIs
  async getProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.size && filters.size !== 'All') {
        queryParams.append('size', filters.size);
      }

      if (filters.firmness && filters.firmness !== 'All') {
        queryParams.append('firmness', filters.firmness);
      }

      if (filters.category) {
        queryParams.append('category', filters.category);
      }

      if (filters.subCategory) {
        queryParams.append('subCategory', filters.subCategory);
      }

      const queryString = queryParams.toString();
      const url = queryString ? `${API_BASE_URL}/product/list?${queryString}` : `${API_BASE_URL}/product/list`;

      console.log('Fetching products from:', url);
      console.log('API_BASE_URL:', API_BASE_URL);

      const response = await fetch(url);

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response. Please check if the backend server is running.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/product/single`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Cart APIs
  async addToCart(userId, productId, quantity, size) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId, quantity, size }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async getCartItems(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  async updateCartItem(userId, itemId, quantity) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, itemId, quantity }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  async removeFromCart(userId, itemId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, itemId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  async clearCart(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  async getCartCount(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/count/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      throw error;
    }
  },

  // User APIs
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async register(name, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Review APIs
  async submitReview(reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/review/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  async getProductReviews(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/review/product/${productId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  },

  // Homepage Images API
  async getHomepageImages() {
    try {
      const response = await fetch(`${API_BASE_URL}/homepage/list`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching homepage images:', error);
      throw error;
    }
  },

  // Firm page content
  async getFirmContent() {
    try {
      const response = await fetch(`${API_BASE_URL}/firm/content`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching firm content:', error);
      throw error;
    }
  },

  // About page content
  async getAboutContent() {
    try {
      const response = await fetch(`${API_BASE_URL}/about/content`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching about content:', error);
      throw error;
    }
  },

  // Submit Inquiry API
  async submitInquiry(inquiryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/inquiries/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      throw error;
    }
  }
};

export default apiService;
