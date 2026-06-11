# Complete API Routes Reference

Base URL: `https://nemi-laxura-backend.vercel.app/api`

---

## 🔐 User Authentication Routes

### Register User
- **Endpoint**: `POST /api/user/register`
- **Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `{ success: true, token: "...", user: {...} }`

### User Login
- **Endpoint**: `POST /api/user/login`
- **Body**: 
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `{ success: true, token: "...", user: {...} }`

### Admin Login
- **Endpoint**: `POST /api/user/admin`
- **Body**: 
  ```json
  {
    "email": "admin@nemi-laxura.com",
    "password": "admin-password"
  }
  ```
- **Response**: `{ success: true, token: "...", user: {...} }`

### Google OAuth
- **Endpoint**: `POST /api/user/google-auth`
- **Body**: User data from Google
- **Response**: `{ success: true, token: "...", user: {...} }`

---

## 📦 Product Routes

### Get All Products
- **Endpoint**: `GET /api/product/list`
- **Query Parameters** (optional):
  - `size`: Filter by size (e.g., "King", "Queen")
  - `firmness`: Filter by firmness (e.g., "Soft", "Medium")
  - `category`: Filter by category
  - `subCategory`: Filter by subcategory
- **Example**: `GET /api/product/list?size=King&firmness=Medium`
- **Response**: `{ success: true, products: [...] }`

### Get Single Product
- **Endpoint**: `POST /api/product/single`
- **Body**: 
  ```json
  {
    "productId": "product-id-here"
  }
  ```
- **Response**: `{ success: true, product: {...} }`

### Add Product (Admin Only)
- **Endpoint**: `POST /api/product/add`
- **Headers**: `{ token: "admin-token" }`
- **Body**: FormData with:
  - Product fields (name, price, description, etc.)
  - `image1`, `image2`, `image3`, `image4` (files)
- **Response**: `{ success: true, message: "Product added" }`

### Remove Product (Admin Only)
- **Endpoint**: `POST /api/product/remove`
- **Headers**: `{ token: "admin-token" }`
- **Body**: 
  ```json
  {
    "id": "product-id-here"
  }
  ```
- **Response**: `{ success: true, message: "Product removed" }`

---

## 🛒 Cart Routes

### Add to Cart
- **Endpoint**: `POST /api/cart/add`
- **Body**: 
  ```json
  {
    "userId": "user-id-here",
    "productId": "product-id-here",
    "quantity": 2,
    "size": "King"
  }
  ```
- **Response**: `{ success: true, message: "Item added to cart" }`

### Get Cart Items
- **Endpoint**: `GET /api/cart/items/:userId`
- **Example**: `GET /api/cart/items/507f1f77bcf86cd799439011`
- **Response**: `{ success: true, cartItems: [...] }`

### Update Cart Item
- **Endpoint**: `PUT /api/cart/update`
- **Body**: 
  ```json
  {
    "userId": "user-id-here",
    "itemId": "cart-item-id-here",
    "quantity": 3
  }
  ```
- **Response**: `{ success: true, message: "Cart updated" }`

### Remove from Cart
- **Endpoint**: `DELETE /api/cart/remove`
- **Body**: 
  ```json
  {
    "userId": "user-id-here",
    "itemId": "cart-item-id-here"
  }
  ```
- **Response**: `{ success: true, message: "Item removed" }`

### Clear Cart
- **Endpoint**: `DELETE /api/cart/clear`
- **Body**: 
  ```json
  {
    "userId": "user-id-here"
  }
  ```
- **Response**: `{ success: true, message: "Cart cleared" }`

### Get Cart Count
- **Endpoint**: `GET /api/cart/count/:userId`
- **Example**: `GET /api/cart/count/507f1f77bcf86cd799439011`
- **Response**: `{ success: true, count: 5 }`

---

## 📋 Order Routes (Admin Only)

All order routes require admin authentication token in headers: `{ token: "admin-token" }`

### Get All Orders
- **Endpoint**: `GET /api/orders/list`
- **Response**: `{ success: true, orders: [...] }`

### Get Order Statistics
- **Endpoint**: `GET /api/orders/stats`
- **Response**: `{ success: true, stats: {...} }`

### Get Orders by Status
- **Endpoint**: `GET /api/orders/status/:status`
- **Status values**: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`
- **Example**: `GET /api/orders/status/Pending`
- **Response**: `{ success: true, orders: [...] }`

### Get Order Details
- **Endpoint**: `POST /api/orders/details`
- **Body**: 
  ```json
  {
    "orderId": "order-id-here"
  }
  ```
- **Response**: `{ success: true, order: {...} }`

### Update Order Status
- **Endpoint**: `POST /api/orders/update`
- **Body**: 
  ```json
  {
    "orderId": "order-id-here",
    "status": "Shipped"
  }
  ```
- **Response**: `{ success: true, message: "Order updated" }`

---

## ⭐ Review Routes

### Add Review
- **Endpoint**: `POST /api/review/add`
- **Body**: Review data
- **Response**: `{ success: true, review: {...} }`

### Get All Reviews (Admin)
- **Endpoint**: `GET /api/review/all`
- **Response**: `{ success: true, reviews: [...] }`

### Get Product Reviews
- **Endpoint**: `GET /api/review/product/:productId`
- **Example**: `GET /api/review/product/507f1f77bcf86cd799439011`
- **Response**: `{ success: true, reviews: [...] }`

### Update Review Status (Admin)
- **Endpoint**: `PUT /api/review/status/:reviewId`
- **Example**: `PUT /api/review/status/507f1f77bcf86cd799439011`
- **Body**: Status update data
- **Response**: `{ success: true, message: "Review updated" }`

### Delete Review (Admin)
- **Endpoint**: `DELETE /api/review/delete/:reviewId`
- **Example**: `DELETE /api/review/delete/507f1f77bcf86cd799439011`
- **Response**: `{ success: true, message: "Review deleted" }`

---

## 🔧 Notes

1. **Authentication**: Admin routes require a token in the request headers:
   ```
   headers: {
     'token': 'your-admin-token-here'
   }
   ```

2. **Base URL**: All routes are prefixed with `/api`

3. **Error Responses**: All endpoints return:
   ```json
   {
     "success": false,
     "message": "Error message here"
   }
   ```

4. **CORS**: Backend is configured to accept requests from:
   - `http://localhost:5173` (local dev)
   - `http://localhost:3000` (local dev)
   - `https://nemi-laxura-frontend.vercel.app` (production)

