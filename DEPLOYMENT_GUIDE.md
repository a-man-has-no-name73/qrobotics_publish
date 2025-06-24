# 🚀 Vercel + Supabase Deployment Guide

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Your code should be pushed to GitHub

## 🗄️ Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name (e.g., "qrobotics-db")
3. Set a strong database password
4. Choose a region close to your users

### 1.2 Get Database Credentials
1. Go to **Settings > Database** in your Supabase dashboard
2. Copy the following values:
   - **Host**: `db.[YOUR-PROJECT-REF].supabase.co`
   - **Database name**: `postgres`
   - **User**: `postgres`
   - **Password**: Your chosen password
   - **Port**: `5432`

### 1.3 Get API Keys
1. Go to **Settings > API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL**: `https://[YOUR-PROJECT-REF].supabase.co`
   - **anon public key**: `eyJ...` (starts with eyJ)
   - **service_role key**: `eyJ...` (starts with eyJ)

### 1.4 Run Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire contents of `database/schema.sql`
3. Paste and run the SQL to create all tables, constraints, and triggers

## 🚀 Step 2: Deploy to Vercel

### 2.1 Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository: `a-man-has-no-name73/qrobotics_publish`

### 2.2 Configure Environment Variables
In the Vercel deployment settings, add these environment variables:

```bash
# Supabase Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
DATABASE_HOST=db.[YOUR-PROJECT-REF].supabase.co
DATABASE_USER=postgres
DATABASE_PASSWORD=[YOUR-PASSWORD]
DATABASE_NAME=postgres
DATABASE_PORT=5432

# Supabase API Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Production Settings
NODE_ENV=production
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0
```

### 2.3 Deploy
1. Click **"Deploy"**
2. Wait for the build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## 🧪 Step 3: Test Your Deployment

### 3.1 Test Database Connection
Visit: `https://your-app-name.vercel.app/api/test_db`

Expected response:
```json
{
  "status": "success",
  "message": "Database connection successful!",
  "connectionTest": [{"test": 1}],
  "databaseInfo": {
    "current_database": "postgres",
    "version": "PostgreSQL 15.x...",
    "table_count": "8"
  }
}
```

### 3.2 Test API Endpoints
- **Products**: `GET /api/product/getProducts`
- **Categories**: `GET /api/category/getCategory`
- **Create Product**: `POST /api/product/createProduct`

## 🔧 Configuration Files Added

### `.env.example`
Template for environment variables (safe to commit)

### `vercel.json`
Vercel deployment configuration:
- Sets function timeout to 10 seconds
- Optimizes for US East region
- Production environment settings

### Updated `lib/db.ts`
- Supports both `DATABASE_URL` and individual parameters
- Automatic SSL for production/Supabase
- Optimized connection settings for cloud deployment

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use environment variables** in Vercel dashboard only
3. **Rotate keys regularly** in Supabase dashboard
4. **Monitor usage** in both Supabase and Vercel dashboards

## 📊 Monitoring & Maintenance

### Supabase Dashboard
- Monitor database usage and performance
- View query logs and errors
- Manage database backups

### Vercel Dashboard
- Monitor function execution times
- View deployment logs and errors
- Track bandwidth and request usage

## 🆘 Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check DATABASE_URL format
   - Verify Supabase project is active
   - Ensure SSL settings are correct

2. **Schema Errors**
   - Verify all tables were created in Supabase
   - Check for case-sensitive table/column names
   - Run schema.sql again if needed

3. **API Errors**
   - Check Vercel function logs
   - Verify environment variables are set
   - Test database connection endpoint first

### Support Resources
- **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **PostgreSQL Docs**: [postgresql.org/docs](https://postgresql.org/docs)

---

🎉 **Your Qrobotics e-commerce platform is now ready for production!**
