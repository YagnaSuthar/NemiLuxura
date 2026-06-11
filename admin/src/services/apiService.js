const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    
    // Log environment variable for debugging
    if (!import.meta.env.VITE_BACKEND_URL) {
      console.warn('⚠️ VITE_BACKEND_URL is not set! Using default:', API_BASE_URL);
      console.warn('Please set VITE_BACKEND_URL in Vercel environment variables to: https://nemi-laxura-backend.vercel.app/api');
    } else {
      console.log('✅ Backend URL configured:', API_BASE_URL);
    }
  }

  getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { token })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Log the URL being called for debugging
    console.log('API Request:', url);
    console.log('Base URL:', this.baseURL);
    
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is JSON
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text}`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Error Details:', {
        url,
        baseURL: this.baseURL,
        error: error.message,
        type: error.name
      });
      
      // Provide more helpful error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Failed to connect to backend. Please check:
1. VITE_BACKEND_URL is set correctly in Vercel (should be: https://nemi-laxura-backend.vercel.app/api)
2. Backend is deployed and running
3. No CORS errors in browser console
Current URL: ${this.baseURL}`);
      }
      
      throw error;
    }
  }

  // Product API methods
  async addProduct(productData) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(productData).forEach(key => {
      if (key !== 'images' && productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });

    // Add images
    if (productData.images) {
      productData.images.forEach((image, index) => {
        if (image) {
          formData.append(`image${index + 1}`, image);
        }
      });
    }

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/product/add`, {
      method: 'POST',
      headers: {
        token: token
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add product');
    }
    return data;
  }

  async updateProduct(productData) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(productData).forEach(key => {
      if (key !== 'images' && productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });

    // Add images
    if (productData.images) {
      productData.images.forEach((image, index) => {
        if (image) {
          formData.append(`image${index + 1}`, image);
        }
      });
    }

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/product/update`, {
      method: 'POST',
      headers: {
        token: token
      },
      body: formData,
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product');
      }
      return data;
    } else {
      const text = await response.text();
      // Remove HTML tags for user display
      const cleanText = text.replace(/<[^>]*>/g, '').trim().substring(0, 150);
      throw new Error(`Server Error: ${cleanText || 'Empty response'}`);
    }
  }

  async getProducts() {

    return this.request('/product/list');
  }

  async removeProduct(productId) {
    return this.request('/product/remove', {
      method: 'POST',
      body: JSON.stringify({ id: productId }),
    });
  }

  async getSingleProduct(productId) {
    return this.request('/product/single', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  // Admin authentication
  async adminLogin(credentials) {
    return this.request('/user/admin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Orders API methods
  async getOrders() {
    return this.request('/orders/list');
  }

  async getOrderStats() {
    return this.request('/orders/stats');
  }

  async updateOrderStatus(orderId, status) {
    return this.request('/orders/update', {
      method: 'POST',
      body: JSON.stringify({ orderId, status }),
    });
  }

  async getOrderDetails(orderId) {
    return this.request('/orders/details', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  // Homepage Images API methods
  async getHomepageImages() {
    return this.request('/homepage/list');
  }

  async addHomepageImage(imageFile, type, order = 0) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('type', type);
    if (type === 'hero') {
      formData.append('order', order);
    }

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/homepage/add`, {
      method: 'POST',
      headers: {
        token: token
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add homepage image');
    }
    return data;
  }

  async updateHomepageImage(imageId, imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('imageId', imageId);

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/homepage/update`, {
      method: 'POST',
      headers: {
        token: token
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update homepage image');
    }
    return data;
  }

  async deleteHomepageImage(imageId) {
    return this.request('/homepage/delete', {
      method: 'POST',
      body: JSON.stringify({ imageId }),
    });
  }

  // Firm page content API methods
  async getFirmContent() {
    return this.request('/firm/content');
  }

  async upsertFirmHero(section, imageFile) {
    const formData = new FormData();
    formData.append('section', section);
    formData.append('image', imageFile);

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/firm/hero`, {
      method: 'POST',
      headers: {
        token: token,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to update firm hero image');
    }
    return data;
  }

  async upsertFirmItem(item) {
    return this.request('/firm/item', {
      method: item.id ? 'PUT' : 'POST',
      body: JSON.stringify(item),
    });
  }

  async deleteFirmItem(id) {
    const url = `${this.baseURL}/firm/item/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete firm item');
    }
    return data;
  }

  // About page content API methods
  async getAboutContent() {
    return this.request('/about/content');
  }

  async upsertAboutHeroImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/about/hero`, {
      method: 'POST',
      headers: {
        token: token
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update hero image');
    }
    return data;
  }

  async upsertTeamImage(imageFile, teamMemberIndex, itemId) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('teamMemberIndex', teamMemberIndex);
    if (itemId) {
      formData.append('itemId', itemId);
    }

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/about/team`, {
      method: 'POST',
      headers: {
        token: token
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save team image');
    }
    return data;
  }

  async deleteAboutItem(itemId) {
    return this.request('/about/delete', {
      method: 'POST',
      body: JSON.stringify({ itemId }),
    });
  }

  // Inquiry API methods
  async getInquiries() {
    return this.request('/inquiries/all');
  }

  async updateInquiryStatus(id, status) {
    return this.request(`/inquiries/status/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteInquiry(id) {
    return this.request(`/inquiries/delete/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
