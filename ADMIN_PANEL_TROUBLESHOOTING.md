# Admin Panel "Failed to Fetch" Error - Troubleshooting Guide

## Quick Fix Checklist

### ✅ Step 1: Check Environment Variable in Vercel

1. Go to your **Admin Panel** Vercel project: https://vercel.com
2. Navigate to **Settings** → **Environment Variables**
3. Verify `VITE_BACKEND_URL` is set to:
   ```
   https://nemi-laxura-backend.vercel.app/api
   ```
   ⚠️ **CRITICAL**: Must include `/api` at the end!

4. Make sure it's set for **Production** environment (and Preview if needed)
5. **Redeploy** the admin panel after adding/changing the variable

### ✅ Step 2: Check Backend CORS Configuration

The backend has been updated to allow all Vercel deployments. If you still see CORS errors:

1. Make sure backend is redeployed with the latest code
2. Check browser console for specific CORS error messages
3. Verify your admin panel URL matches the pattern `*.vercel.app`

### ✅ Step 3: Verify Backend is Running

1. Visit: `https://nemi-laxura-backend.vercel.app/`
2. Should see: "API Working"
3. If not, check backend deployment logs in Vercel

### ✅ Step 4: Check Browser Console

Open browser DevTools (F12) and check:

1. **Console Tab**: Look for error messages
2. **Network Tab**: 
   - Check if requests are being made
   - Look at the request URL (should be `https://nemi-laxura-backend.vercel.app/api/...`)
   - Check response status codes
   - Look for CORS errors (red text)

### ✅ Step 5: Test API Directly

Try accessing the backend API directly from browser:

```
https://nemi-laxura-backend.vercel.app/api/product/list
```

Should return JSON data. If it doesn't, backend has issues.

---

## Common Error Messages and Solutions

### Error: "Failed to connect to backend"
**Cause**: Environment variable not set or wrong URL
**Solution**: 
- Set `VITE_BACKEND_URL=https://nemi-laxura-backend.vercel.app/api` in Vercel
- Redeploy admin panel

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Cause**: Admin panel URL not in CORS whitelist
**Solution**: 
- Backend now allows all `*.vercel.app` domains
- Redeploy backend if needed

### Error: "Network request failed"
**Cause**: Backend is down or URL is incorrect
**Solution**:
- Check if backend is accessible: `https://nemi-laxura-backend.vercel.app/`
- Verify backend deployment status in Vercel

### Error: "404 Not Found"
**Cause**: API endpoint doesn't exist or URL is wrong
**Solution**:
- Verify endpoint exists in backend routes
- Check that URL includes `/api` prefix

---

## Debugging Steps

### 1. Check Environment Variable

In admin panel browser console, run:
```javascript
console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
```

Should output: `https://nemi-laxura-backend.vercel.app/api`

If it shows `undefined` or `http://localhost:4000/api`, the environment variable is not set correctly.

### 2. Test API Connection

In browser console, run:
```javascript
fetch('https://nemi-laxura-backend.vercel.app/api/product/list')
  .then(r => r.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err));
```

This will tell you if:
- Backend is accessible
- CORS is working
- API is responding

### 3. Check Network Tab

1. Open DevTools → Network tab
2. Try to login or load products
3. Look for failed requests (red)
4. Click on failed request to see:
   - Request URL
   - Response status
   - Error message
   - Response headers (check for CORS headers)

---

## Vercel-Specific Issues

### Issue: Environment Variable Not Loading

**Symptoms**: 
- `import.meta.env.VITE_BACKEND_URL` is undefined
- API calls go to `http://localhost:4000/api`

**Solution**:
1. In Vercel, go to project → Settings → Environment Variables
2. Add `VITE_BACKEND_URL` with value `https://nemi-laxura-backend.vercel.app/api`
3. **Important**: Select the correct environment (Production, Preview, Development)
4. Click **Save**
5. Go to **Deployments** tab
6. Click **Redeploy** on the latest deployment
7. Wait for deployment to complete
8. Clear browser cache and reload

### Issue: Preview Deployments Not Working

**Solution**:
- Set environment variable for **Preview** environment as well
- Or set it for **All Environments**

---

## Verification Checklist

After fixing, verify:

- [ ] `VITE_BACKEND_URL` is set in Vercel admin panel project
- [ ] Admin panel has been redeployed after setting variable
- [ ] Backend is accessible at `https://nemi-laxura-backend.vercel.app/`
- [ ] Browser console shows: `✅ Backend URL configured: https://nemi-laxura-backend.vercel.app/api`
- [ ] No CORS errors in browser console
- [ ] API requests show correct URL in Network tab
- [ ] Login works without "failed to fetch" error

---

## Still Not Working?

If you've tried everything above:

1. **Check Vercel Logs**:
   - Go to admin panel project in Vercel
   - Click on latest deployment
   - Check **Logs** tab for build/runtime errors

2. **Check Backend Logs**:
   - Go to backend project in Vercel
   - Check **Logs** for API errors

3. **Test with curl** (from terminal):
   ```bash
   curl https://nemi-laxura-backend.vercel.app/api/product/list
   ```

4. **Contact Support** with:
   - Screenshot of browser console errors
   - Screenshot of Network tab
   - Vercel deployment logs
   - Environment variable configuration (without showing values)

---

## Quick Reference

**Admin Panel Environment Variable:**
```
VITE_BACKEND_URL=https://nemi-laxura-backend.vercel.app/api
```

**Backend URL to Test:**
```
https://nemi-laxura-backend.vercel.app/
```

**API Base URL:**
```
https://nemi-laxura-backend.vercel.app/api
```

**Common Mistake:**
❌ `VITE_BACKEND_URL=https://nemi-laxura-backend.vercel.app` (missing `/api`)
✅ `VITE_BACKEND_URL=https://nemi-laxura-backend.vercel.app/api` (correct)

