# 🚀 Quick Setup Guide

## Environment Variables Setup

To get the application running, you need to create a `.env.local` file in the project root with your Supabase credentials.

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the project root with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Stripe Configuration (Optional for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder

# Resend Email Configuration (Optional for now)
RESEND_API_KEY=re_placeholder

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use an existing one
3. Go to Settings > API
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Get Database URL

1. In your Supabase project, go to Settings > Database
2. Copy the **Connection string** under "Connection parameters"
3. Replace `[YOUR-PASSWORD]` with your database password
4. Use this as your `DATABASE_URL`

### Step 4: Run Database Migrations

```bash
npm run db:generate
npm run db:migrate
```

### Step 5: Start the Application

```bash
npm run dev
```

## 🔧 Troubleshooting

### Error: "supabaseUrl is required"
- Make sure you've created the `.env.local` file
- Check that the environment variables are correctly named
- Restart the development server after adding environment variables

### Authentication not working
- Verify your Supabase credentials are correct
- Check that email authentication is enabled in Supabase
- Make sure the database migrations have been run

### Database connection issues
- Verify your DATABASE_URL is correct
- Check that your Supabase project is active
- Ensure the database password is correct

## 📚 Next Steps

Once you have the environment variables set up:

1. **Test Authentication**: Try signing up and signing in
2. **Test Protected Routes**: Access the dashboard
3. **Set up Google OAuth** (optional): Configure in Supabase Auth settings
4. **Continue to Week 3**: Start building the admin dashboard

## 🆘 Need Help?

If you're still having issues:
1. Check the console for specific error messages
2. Verify all environment variables are set correctly
3. Make sure your Supabase project is active
4. Try clearing the browser cache and restarting the dev server
