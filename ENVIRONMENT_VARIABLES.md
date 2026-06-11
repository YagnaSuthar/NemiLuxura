# Environment Variables Configuration Guide

This document contains all the environment variables needed for your Nemi-Laxura application to work properly on Vercel.

## Backend Environment Variables (Vercel)

Set these in your **backend** Vercel project settings (https://nemi-laxura-backend.vercel.app):

```env
# MongoDB Database Connection
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net
# OR if using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net

# JWT Secret Key (for authentication tokens)
# Generate a strong random string, e.g., use: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Admin Credentials (used for admin authentication)
ADMIN_EMAIL=admin@nemi-laxura.com
ADMIN_PASSWORD=your-admin-password-here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server Port (Vercel will set this automatically, but you can specify)
PORT=4000
```

## Frontend Environment Variables (Vercel)

Set these in your **frontend** Vercel project settings (https://nemi-laxura-frontend.vercel.app):

```env
# Backend API URL
VITE_BACKEND_URL=https://nemi-laxura-backend.vercel.app/api
```

## Admin Panel Environment Variables (Vercel)

Set these in your **admin panel** Vercel project settings (if separate):

```env
# Backend API URL
VITE_BACKEND_URL=https://nemi-laxura-backend.vercel.app/api
```

---

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add each variable with its value
4. Make sure to select the correct **Environment** (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application for changes to take effect

---

## Complete API Routes Reference

### User Routes (`/api/user`)
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - User login
- `POST /api/user/admin` - Admin login
- `POST /api/user/google-auth` - Google OAuth authentication

### Product Routes (`/api/product`)
- `GET /api/product/list` - Get all products (supports query params: size, firmness, category, subCategory)
- `POST /api/product/single` - Get single product details (requires: `{ productId }`)
- `POST /api/product/add` - Add new product (admin only, requires token)
- `POST /api/product/remove` - Remove product (admin only, requires token)

### Cart Routes (`/api/cart`)
- `POST /api/cart/add` - Add item to cart (requires: `{ userId, productId, quantity, size }`)
- `GET /api/cart/items/:userId` - Get cart items for a user
- `PUT /api/cart/update` - Update cart item quantity (requires: `{ userId, itemId, quantity }`)
- `DELETE /api/cart/remove` - Remove item from cart (requires: `{ userId, itemId }`)
- `DELETE /api/cart/clear` - Clear entire cart (requires: `{ userId }`)
- `GET /api/cart/count/:userId` - Get cart count for a user

### Order Routes (`/api/orders`)
- `GET /api/orders/list` - Get all orders (admin only, requires token)
- `GET /api/orders/stats` - Get order statistics (admin only, requires token)
- `GET /api/orders/status/:status` - Get orders by status (admin only, requires token)
- `POST /api/orders/details` - Get single order details (admin only, requires token, body: `{ orderId }`)
- `POST /api/orders/update` - Update order status (admin only, requires token, body: `{ orderId, status }`)

### Review Routes (`/api/review`)
- `POST /api/review/add` - Add a new review
- `GET /api/review/all` - Get all reviews (for admin)
- `GET /api/review/product/:productId` - Get reviews for a specific product
- `PUT /api/review/status/:reviewId` - Update review status (for admin)
- `DELETE /api/review/delete/:reviewId` - Delete review (for admin)

---

## Common Issues and Solutions

### Issue 1: CORS Errors
**Solution**: The backend CORS has been updated to include `https://nemi-laxura-frontend.vercel.app`. If you still see CORS errors, make sure:
- The frontend URL in CORS matches exactly
- You've redeployed the backend after changes

### Issue 2: Database Connection Failed
**Solution**: 
- Verify `MONGODB_URI` is set correctly in Vercel
- Check MongoDB Atlas IP whitelist (should allow all IPs: `0.0.0.0/0` for Vercel)
- Ensure database name is correct (backend uses `/e-commerce` database)

### Issue 3: API Calls Returning 404
**Solution**:
- Verify `VITE_BACKEND_URL` is set to `https://nemi-laxura-backend.vercel.app/api` (note the `/api` suffix)
- Make sure you've redeployed frontend after adding environment variables
- Check browser console for exact error messages

### Issue 4: Authentication Not Working
**Solution**:
- Verify `JWT_SECRET` is set in backend
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` match what you're using
- Ensure tokens are being sent in request headers

### Issue 5: Image Upload Not Working
**Solution**:
- Verify all Cloudinary variables are set correctly
- Check Cloudinary dashboard for correct credentials
- Ensure Cloudinary account is active

---

## Testing Your Configuration

1. **Test Backend**: Visit `https://nemi-laxura-backend.vercel.app/` - should show "API Working"
2. **Test Frontend Connection**: Open browser console on frontend, check for API errors
3. **Test Database**: Try logging in or registering a user
4. **Test Admin**: Try admin login with your credentials

---

## Security Notes

- Never commit `.env` files to Git
- Use strong, unique values for `JWT_SECRET` (minimum 32 characters)
- Keep `ADMIN_PASSWORD` secure and change it regularly
- Use MongoDB Atlas connection string with proper authentication
- Regularly rotate API keys and secrets

