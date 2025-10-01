@echo off
echo ========================================
echo Fix Vercel 404 Error
echo ========================================
echo.

echo The 404 error happens because Vercel is deploying the wrong directory.
echo You need to deploy frontend and backend as SEPARATE projects.
echo.

echo Step 1: Delete Current Deployment
echo --------------------------------
echo 1. Go to your Vercel dashboard
echo 2. Delete the current deployment
echo 3. We'll create two new projects
echo.

echo Step 2: Deploy Backend (summarit folder)
echo --------------------------------
echo 1. Go to https://vercel.com
echo 2. Click "New Project"
echo 3. Import your GitHub repository
echo 4. IMPORTANT: Set Root Directory to: summarit
echo 5. Framework: Next.js
echo 6. Add environment variables (see below)
echo 7. Deploy!
echo.

echo Step 3: Deploy Frontend (frontend folder)
echo --------------------------------
echo 1. Create another Vercel project
echo 2. Import same repository
echo 3. IMPORTANT: Set Root Directory to: frontend
echo 4. Framework: Vite
echo 5. Add VITE_API_URL environment variable
echo 6. Deploy!
echo.

echo Step 4: Environment Variables
echo --------------------------------
echo For Backend (summarit):
echo DATABASE_URL=your-supabase-connection-string
echo SUPABASE_URL=your-supabase-url
echo SUPABASE_KEY=your-supabase-service-key
echo OPENAI_API_KEY=your-openai-api-key
echo NEXT_PUBLIC_FRONTEND_URL=https://your-frontend-domain.vercel.app
echo.
echo For Frontend (frontend):
echo VITE_API_URL=https://your-backend-domain.vercel.app
echo.

echo ========================================
echo After deployment:
echo Backend: https://your-backend.vercel.app
echo Frontend: https://your-frontend.vercel.app
echo ========================================
echo.
pause
