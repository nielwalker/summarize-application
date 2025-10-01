@echo off
echo ========================================
echo Quick Vercel Deployment
echo ========================================
echo.

echo Step 1: Push to GitHub
echo --------------------------------
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
echo.

echo Step 2: Open Vercel
echo --------------------------------
echo Opening Vercel in your browser...
start https://vercel.com
echo.

echo Step 3: Deploy Backend
echo --------------------------------
echo 1. Click "New Project"
echo 2. Import your GitHub repository
echo 3. Set Root Directory to: summarit
echo 4. Framework: Next.js
echo 5. Add environment variables (see VERCEL_DEPLOYMENT_GUIDE.md)
echo 6. Deploy!
echo.

echo Step 4: Deploy Frontend
echo --------------------------------
echo 1. Create another project
echo 2. Import same repository
echo 3. Set Root Directory to: frontend
echo 4. Framework: Vite
echo 5. Add VITE_API_URL environment variable
echo 6. Deploy!
echo.

echo Step 5: Initialize Database
echo --------------------------------
echo After both deployments, run:
echo npx prisma db push
echo.

echo ========================================
echo Deployment URLs will be:
echo Frontend: https://your-frontend.vercel.app
echo Backend: https://your-backend.vercel.app
echo ========================================
echo.
pause
