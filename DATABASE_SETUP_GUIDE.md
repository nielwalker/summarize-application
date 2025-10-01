# 🗄️ Database Setup for Vercel Deployment

## Problem
```
{"error":"Database connection failed. Please try again later.","details":"Unable to verify student registration."}
```

## Root Cause
The database tables haven't been created in your Supabase database yet.

## ✅ Solution

### Step 1: Verify Environment Variables
Make sure these are set in your Vercel backend project:
```env
DATABASE_URL=postgresql://postgres.dfmcfpxwccazbwilyaxh:W9jq-H%23NhqRGzYA@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://dfmcfpxwccazbwilyaxh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbWNmcHh3Y2NhemJ3aWx5YXhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTI3MTA1OSwiZXhwIjoyMDc0ODQ3MDU5fQ.lpZYQL38ImwKAUlp6tPol_ubVtqPYKdBTC-U95-HUu4
OPENAI_API_KEY=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
```

### Step 2: Initialize Database Tables
You need to run the Prisma migration to create the database tables.

#### Option A: Using Vercel CLI (Recommended)
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link your project:**
   ```bash
   cd summarit
   vercel link
   ```

4. **Run database migration:**
   ```bash
   npx prisma db push
   ```

#### Option B: Using Supabase Dashboard
1. **Go to your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Run this SQL to create tables:**

```sql
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

-- Create StudentEnrollment table
CREATE TABLE "StudentEnrollment" (
    "studentId" TEXT PRIMARY KEY,
    "userName" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "companyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Coordinator table
CREATE TABLE "Coordinator" (
    "id" SERIAL PRIMARY KEY,
    "userName" TEXT UNIQUE NOT NULL,
    "sections" TEXT[] NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Company table
CREATE TABLE "Company" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
```

### Step 3: Test Database Connection
1. **Go to your backend URL** (e.g., `https://your-backend.vercel.app`)
2. **You should see the status page**
3. **Try the login functionality**

### Step 4: Register a Test Student
1. **Login as chairman** (any student ID + role "chairman")
2. **Register a test student** with a student ID
3. **Try logging in as that student**

## 🎯 Expected Results
After setup:
- ✅ Database connection works
- ✅ Student registration works
- ✅ Login functionality works
- ✅ All features work properly

## 🚀 Quick Action
1. **Set environment variables in Vercel**
2. **Run database migration**
3. **Test the application**
4. **Register test students**

The database connection error will be resolved once the tables are created! 🎯
