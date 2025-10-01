# 🔧 Fix Vercel Project Name Conflict

## Problem
```
Project "summarize-application-hxee" already exists, please use a new name.
```

## Solution
You need to use a different project name for your Vercel deployment.

## 🚀 Quick Fix Steps

### Option 1: Use a Different Name
1. **Go to Vercel Dashboard**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Set a unique project name:**
   - `summarize-application-backend`
   - `student-practicum-backend`
   - `summarize-app-api`
   - `practicum-reports-backend`
   - Or any other unique name you prefer

### Option 2: Delete Existing Project
1. **Go to Vercel Dashboard**
2. **Find the existing "summarize-application-hxee" project**
3. **Go to Settings → General**
4. **Scroll down and click "Delete Project"**
5. **Confirm deletion**
6. **Create new project with the same name**

### Option 3: Use Your Own Domain
1. **Create project with any name**
2. **Go to Settings → Domains**
3. **Add a custom domain** (if you have one)

## 🎯 Recommended Approach

### For Backend (summarit folder):
- **Project Name**: `summarize-application-backend`
- **Root Directory**: `summarit`
- **Framework**: Next.js

### For Frontend (frontend folder):
- **Project Name**: `summarize-application-frontend`
- **Root Directory**: `frontend`
- **Framework**: Vite

## 📝 Step-by-Step Instructions

### Step 1: Create Backend Project
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. **Project Name**: `summarize-application-backend`
5. **Root Directory**: `summarit`
6. **Framework**: Next.js
7. Add environment variables
8. Deploy!

### Step 2: Create Frontend Project
1. Create another Vercel project
2. Import the same repository
3. **Project Name**: `summarize-application-frontend`
4. **Root Directory**: `frontend`
5. **Framework**: Vite
6. Add `VITE_API_URL` environment variable
7. Deploy!

## 🔧 Environment Variables

### Backend Environment Variables:
```env
DATABASE_URL=postgresql://postgres.dfmcfpxwccazbwilyaxh:W9jq-H%23NhqRGzYA@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://dfmcfpxwccazbwilyaxh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbWNmcHh3Y2NhemJ3aWx5YXhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTI3MTA1OSwiZXhwIjoyMDc0ODQ3MDU5fQ.lpZYQL38ImwKAUlp6tPol_ubVtqPYKdBTC-U95-HUu4
OPENAI_API_KEY=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
```

### Frontend Environment Variable:
```env
VITE_API_URL=https://summarize-application-backend.vercel.app
```

## 🎉 Expected Results

After successful deployment:
- **Backend URL**: `https://summarize-application-backend.vercel.app`
- **Frontend URL**: `https://summarize-application-frontend.vercel.app`
- **Your friend accesses**: The frontend URL

## 🚀 Quick Action

1. **Use a different project name** (recommended)
2. **Set Root Directory correctly** (`summarit` for backend, `frontend` for frontend)
3. **Add environment variables**
4. **Deploy both projects**

This will resolve the project name conflict and give you working deployments! 🎯
