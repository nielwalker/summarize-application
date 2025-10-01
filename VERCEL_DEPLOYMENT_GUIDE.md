# 🚀 Vercel Deployment Guide
## Student Practicum Report Management System

This guide will help you deploy your application on Vercel so your friend can access it from anywhere.

## 📋 Prerequisites

1. **GitHub Account** (for code repository)
2. **Vercel Account** (free at https://vercel.com)
3. **Supabase Account** (for database - free tier available)
4. **OpenAI API Key** (for AI summaries)

## 🗂️ Project Structure for Vercel

```
summarize application/
├── frontend/          # React frontend (will be deployed separately)
├── summarit/          # Next.js backend (Vercel deployment)
├── vercel.json        # Vercel configuration
└── VERCEL_DEPLOYMENT_GUIDE.md
```

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Ensure your repository is public** or connected to your Vercel account

### Step 2: Set Up Supabase Database (Production)

1. **Go to https://supabase.com**
2. **Create a new project** (if you don't have one)
3. **Get your database credentials**:
   - Go to Settings → Database
   - Copy the connection string
   - Go to Settings → API
   - Copy the service role key

### Step 3: Deploy Backend to Vercel

1. **Go to https://vercel.com**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import your repository**
5. **Configure the project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `summarit`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 4: Configure Environment Variables

In your Vercel project dashboard:

1. **Go to Settings → Environment Variables**
2. **Add the following variables**:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres.dfmcfpxwccazbwilyaxh:YOUR_PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

# Supabase Configuration
SUPABASE_URL=https://dfmcfpxwccazbwilyaxh.supabase.co
SUPABASE_KEY=your-supabase-service-role-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Application URLs
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend-domain.vercel.app
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.vercel.app
```

### Step 5: Deploy Frontend to Vercel

1. **Create a new Vercel project** for the frontend
2. **Import the same repository**
3. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add environment variables**:
```env
VITE_API_URL=https://your-backend-domain.vercel.app
```

### Step 6: Initialize Database

1. **Connect to your Supabase database**
2. **Run the Prisma commands**:
   ```bash
   cd summarit
   npx prisma generate
   npx prisma db push
   ```

## 🌐 Access URLs

After deployment, your application will be available at:

- **Frontend**: `https://your-frontend-project.vercel.app`
- **Backend API**: `https://your-backend-project.vercel.app`

## 🔑 Default Login Credentials

### Chairman Login:
- **Student ID**: Any valid student ID
- **Role**: chairman

### Coordinator Login:
- **Student ID**: Any valid student ID
- **Role**: coordinator

### Student Login:
- **Student ID**: Must be registered by chairman first
- **Role**: student

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check that all dependencies are in package.json
   - Ensure environment variables are set correctly

2. **Database Connection Issues**:
   - Verify DATABASE_URL is correct
   - Check Supabase project is active

3. **CORS Errors**:
   - Ensure VITE_API_URL points to your backend URL
   - Check that backend allows your frontend domain

4. **API Errors**:
   - Check Vercel function logs
   - Verify all environment variables are set

## 📱 Sharing with Your Friend

### Method 1: Direct URL Sharing
1. **Get your Vercel URLs** from the dashboard
2. **Share the frontend URL** with your friend
3. **Provide login credentials** (chairman/coordinator/student)

### Method 2: Custom Domain (Optional)
1. **Go to Vercel project settings**
2. **Add a custom domain** (if you have one)
3. **Update DNS settings** as instructed

## 🔒 Security Notes

1. **Environment Variables**: Never commit real API keys to GitHub
2. **Database Access**: Use Supabase's built-in security features
3. **API Keys**: Rotate keys regularly
4. **HTTPS**: Vercel automatically provides SSL certificates

## 📊 Monitoring

1. **Vercel Dashboard**: Monitor deployments and performance
2. **Supabase Dashboard**: Monitor database usage
3. **Function Logs**: Check for errors in Vercel dashboard

## 🎯 Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Supabase database configured
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Database initialized
- [ ] URLs shared with friend
- [ ] Test login functionality

## 🆘 Support

If you encounter issues:

1. **Check Vercel deployment logs**
2. **Verify environment variables**
3. **Test database connection**
4. **Check CORS settings**

## 🎉 Success!

Once deployed, your friend can access the application at:
`https://your-frontend-project.vercel.app`

The application will work exactly like your local version but accessible from anywhere in the world!
