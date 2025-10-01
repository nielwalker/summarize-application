# 🔧 Fix CORS Error - Frontend to Backend Connection

## Problem
```
Access to fetch at 'http://localhost:3000/api/login' from origin 'https://summarize-application-b7b9-72i60k9b6-walkers-projects-02d7bb5a.vercel.app' has been blocked by CORS policy
```

## Root Cause
The frontend is trying to connect to `localhost:3000` (local backend) instead of the deployed Vercel backend.

## ✅ Solution

### Step 1: Get Your Backend URL
From your Vercel dashboard, copy your backend URL:
- Go to your backend project
- Copy the URL (e.g., `https://summarize-application-backend.vercel.app`)

### Step 2: Update Frontend Environment Variable
1. **Go to Vercel Dashboard**
2. **Find your frontend project**
3. **Go to Settings → Environment Variables**
4. **Add or update:**
   ```env
   VITE_API_URL=https://your-backend-project-name.vercel.app
   ```
   Replace with your actual backend URL!

### Step 3: Redeploy Frontend
1. **Go to your frontend project**
2. **Click "Redeploy"**
3. **Wait for deployment to complete**

## 🎯 Expected Result
After fixing:
- ✅ Frontend connects to deployed backend
- ✅ No more CORS errors
- ✅ Login functionality works
- ✅ All API calls go to Vercel backend

## 🔍 Verification
1. **Check browser console** - no more CORS errors
2. **Try logging in** - should work properly
3. **Check network tab** - requests should go to your Vercel backend URL

## 🚀 Quick Action
1. **Copy your backend URL from Vercel**
2. **Update VITE_API_URL in frontend project**
3. **Redeploy frontend**
4. **Test login functionality**

The CORS error will be resolved once the frontend points to the correct backend URL! 🎯
