# Setup Checklist for Nemi-Laxura

Use this checklist to ensure all environment variables are properly configured.

## ✅ Backend Configuration (Vercel)

Go to: https://vercel.com → Your Backend Project → Settings → Environment Variables

- [ ] `MONGODB_URI` - Your MongoDB connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net`
  - Database name will be `/e-commerce` (appended automatically)

- [ ] `JWT_SECRET` - Secret key for JWT tokens
  - Should be at least 32 characters long
  - Generate with: `openssl rand -base64 32`

- [ ] `ADMIN_EMAIL` - Admin login email
  - Example: `admin@nemi-laxura.com`

- [ ] `ADMIN_PASSWORD` - Admin login password
  - Use a strong password

- [ ] `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name

- [ ] `CLOUDINARY_API_KEY` - Your Cloudinary API key

- [ ] `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

- [ ] `PORT` - Server port (optional, Vercel sets this automatically)
  - Default: `4000`

**After adding variables:**
- [ ] Redeploy the backend application

---

## ✅ Frontend Configuration (Vercel)

Go to: https://vercel.com → Your Frontend Project → Settings → Environment Variables

- [ ] `VITE_BACKEND_URL` - Backend API URL
  - Value: `https://nemi-laxura-backend.vercel.app/api`
  - ⚠️ **Important**: Include `/api` at the end

**After adding variables:**
- [ ] Redeploy the frontend application

---

## ✅ Admin Panel Configuration (Vercel)

If your admin panel is a separate Vercel project:

Go to: https://vercel.com → Your Admin Project → Settings → Environment Variables

- [ ] `VITE_BACKEND_URL` - Backend API URL
  - Value: `https://nemi-laxura-backend.vercel.app/api`
  - ⚠️ **Important**: Include `/api` at the end

**After adding variables:**
- [ ] Redeploy the admin application

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] Visit `https://nemi-laxura-backend.vercel.app/` - Should show "API Working"
- [ ] Test user registration: `POST /api/user/register`
- [ ] Test user login: `POST /api/user/login`
- [ ] Test admin login: `POST /api/user/admin`
- [ ] Test product list: `GET /api/product/list`

### Frontend Tests
- [ ] Open `https://nemi-laxura-frontend.vercel.app/`
- [ ] Check browser console for errors
- [ ] Try to register/login
- [ ] Browse products
- [ ] Add items to cart
- [ ] Check if API calls are going to correct backend URL

### Database Tests
- [ ] Verify MongoDB connection (check backend logs)
- [ ] Create a test user account
- [ ] Verify user is saved in database

### Admin Panel Tests
- [ ] Login with admin credentials
- [ ] View products list
- [ ] View orders list
- [ ] Test adding a product

---

## 🔍 Troubleshooting

### If backend shows "API Working" but frontend can't connect:
1. Check `VITE_BACKEND_URL` is set correctly (must include `/api`)
2. Check browser console for CORS errors
3. Verify backend CORS includes your frontend URL
4. Redeploy both frontend and backend

### If database connection fails:
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas IP whitelist (should allow `0.0.0.0/0`)
3. Verify database user has correct permissions
4. Check backend logs for specific error messages

### If authentication fails:
1. Verify `JWT_SECRET` is set
2. Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` match
3. Verify token is being sent in request headers
4. Check backend logs for authentication errors

### If images don't upload:
1. Verify all Cloudinary variables are set
2. Check Cloudinary dashboard for account status
3. Verify API keys are correct
4. Check file size limits

---

## 📝 Quick Reference

**Backend URL**: `https://nemi-laxura-backend.vercel.app`
**Frontend URL**: `https://nemi-laxura-frontend.vercel.app`
**API Base URL**: `https://nemi-laxura-backend.vercel.app/api`

**Required Environment Variables:**
- Backend: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Frontend: `VITE_BACKEND_URL`
- Admin: `VITE_BACKEND_URL`

---

## 🚀 After Setup

Once everything is configured:
1. Test all major features
2. Monitor Vercel logs for any errors
3. Set up monitoring/alerts if needed
4. Document any custom configurations

