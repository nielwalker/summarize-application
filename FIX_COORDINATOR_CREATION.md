# 🔧 Fix Coordinator Creation Issues

## Problems Identified
1. **CORS errors** - Frontend can't access backend APIs
2. **500 Internal Server Errors** - Backend database/connection issues
3. **Failed to fetch errors** - Network connectivity problems

## ✅ Step-by-Step Fix

### Step 1: Verify Backend URL
1. **Go to your Vercel dashboard**
2. **Find your backend project**
3. **Copy the exact URL** (e.g., `https://summarize-application-j4i8.vercel.app`)
4. **Update frontend environment variable:**
   - Go to frontend project → Settings → Environment Variables
   - Update `VITE_API_URL` to your exact backend URL

### Step 2: Check Database Tables
Make sure you've created the database tables in Supabase:

1. **Go to Supabase Dashboard**
2. **Go to SQL Editor**
3. **Run this SQL:**

```sql
-- Create Coordinator table
CREATE TABLE "Coordinator" (
    "id" SERIAL PRIMARY KEY,
    "userName" TEXT UNIQUE NOT NULL,
    "sections" TEXT[] NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create StudentEnrollment table
CREATE TABLE "StudentEnrollment" (
    "studentId" TEXT PRIMARY KEY,
    "userName" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "companyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create WeeklyReport table
CREATE TABLE "WeeklyReport" (
    "id" SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "studentId" TEXT,
    "weekNumber" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "activities" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "learnings" TEXT NOT NULL
);

-- Create Company table
CREATE TABLE "Company" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
```

### Step 3: Redeploy Backend
1. **Go to your backend project in Vercel**
2. **Click "Redeploy"**
3. **Wait for deployment to complete**

### Step 4: Test Backend Directly
1. **Go to your backend URL** (e.g., `https://summarize-application-j4i8.vercel.app`)
2. **You should see the status page**
3. **Test API endpoints:**
   - `https://your-backend.vercel.app/api/admin` (should return data)
   - `https://your-backend.vercel.app/api/reports` (should return data)

### Step 5: Update Frontend Environment
1. **Go to frontend project in Vercel**
2. **Settings → Environment Variables**
3. **Update `VITE_API_URL`** to your exact backend URL
4. **Redeploy frontend**

### Step 6: Test Coordinator Creation
1. **Go to your frontend URL**
2. **Login as chairman** (any student ID + role "chairman")
3. **Try creating a coordinator**
4. **Check browser console for errors**

## 🔍 Troubleshooting

### If Still Getting CORS Errors:
1. **Check that `VITE_API_URL` is exactly your backend URL**
2. **Make sure there are no trailing slashes**
3. **Verify the backend is accessible directly**

### If Still Getting 500 Errors:
1. **Check Vercel function logs** for specific error messages
2. **Verify database connection** in Supabase
3. **Check that all environment variables are set**

### If Still Getting Failed to Fetch:
1. **Check network connectivity**
2. **Verify backend URL is correct**
3. **Check for any firewall or network restrictions**

## 🎯 Expected Results
After fixes:
- ✅ No CORS errors
- ✅ No 500 errors
- ✅ Coordinator creation works
- ✅ All chairman dashboard features work

## 🚀 Quick Action
1. **Verify backend URL**
2. **Create database tables**
3. **Redeploy both frontend and backend**
4. **Test coordinator creation**

The coordinator creation should work once these issues are resolved! 🎯
