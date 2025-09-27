# Week 1: Project Setup Guide

Welcome to Week 1! This week we'll set up the foundation of our e-commerce store with Next.js, Tailwind CSS, Shadcn UI, and Supabase.

## 🎯 Week 1 Goals

- [x] Set up Next.js 14 with TypeScript
- [x] Configure Tailwind CSS and Shadcn UI
- [x] Connect to Supabase
- [x] Design database schema
- [x] Create basic UI components
- [x] Deploy to Vercel

## 📋 Prerequisites

Before starting, make sure you have:
- Node.js 18+ installed
- A GitHub account
- A Supabase account
- A Vercel account

## 🚀 Step-by-Step Setup

### Step 1: Project Initialization

The project structure is already created for you! Here's what we have:

```
ecommerce-store/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   └── theme-provider.tsx
├── lib/                  # Utility functions
│   ├── db/              # Database configuration
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Helper functions
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
└── docs/               # Documentation
```

### Step 2: Install Dependencies

Run the following command to install all dependencies:

```bash
npm install
```

This will install:
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Supabase client
- Drizzle ORM
- Stripe SDK
- And many more!

### Step 3: Supabase Setup

#### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `ecommerce-store`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your location
6. Click "Create new project"

#### 3.2 Get Your Supabase Credentials

1. Go to Settings > API
2. Copy the following values:
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

#### 3.3 Update Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Database Setup

#### 4.1 Generate Database Schema

Run the following command to generate the database schema:

```bash
npm run db:generate
```

This creates the database tables based on our schema in `lib/db/schema.ts`.

#### 4.2 Apply Migrations

Apply the migrations to your Supabase database:

```bash
npm run db:migrate
```

#### 4.3 Verify Database Setup

1. Go to your Supabase dashboard
2. Navigate to Table Editor
3. You should see all the tables we created:
   - users
   - categories
   - products
   - orders
   - order_items
   - wishlist
   - reviews
   - cart

### Step 5: Run the Development Server

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

You should see a beautiful landing page with:
- Hero section
- Features section
- Call-to-action section
- Status badge showing "Week 1: Project Setup Complete"

### Step 6: Deploy to Vercel

#### 6.1 Push to GitHub

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit: Week 1 setup complete"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin https://github.com/yourusername/ecommerce-store.git
git branch -M main
git push -u origin main
```

#### 6.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - Copy all variables from your `.env.local` file
   - Add them in Vercel dashboard
6. Click "Deploy"

Your app will be live at `https://your-project-name.vercel.app`!

## 🎨 What We Built This Week

### 1. Modern UI Foundation
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Beautiful, accessible components
- **Dark Mode**: Built-in theme switching
- **Responsive Design**: Mobile-first approach

### 2. Database Architecture
- **PostgreSQL**: Robust relational database
- **Drizzle ORM**: Type-safe database queries
- **Comprehensive Schema**: All tables for e-commerce functionality

### 3. Project Structure
- **Next.js 14**: Latest React framework with App Router
- **TypeScript**: Type safety throughout the application
- **Modular Architecture**: Organized, maintainable code

### 4. Development Tools
- **Hot Reload**: Instant development feedback
- **TypeScript**: Compile-time error checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting

## 🔧 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading
- Make sure `.env.local` is in the project root
- Restart the development server after adding variables
- Check that variable names match exactly

#### 2. Database Connection Issues
- Verify your DATABASE_URL is correct
- Check that your Supabase project is active
- Ensure the database password is correct

#### 3. Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run build`
- Clear Next.js cache: `rm -rf .next`

#### 4. Vercel Deployment Issues
- Check that all environment variables are set in Vercel
- Verify your build command: `npm run build`
- Check the deployment logs for specific errors

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

## ✅ Week 1 Checklist

- [x] Project initialized with Next.js 14
- [x] Tailwind CSS configured
- [x] Shadcn UI components set up
- [x] Supabase project created
- [x] Database schema designed and migrated
- [x] Environment variables configured
- [x] Development server running
- [x] Deployed to Vercel
- [x] Basic UI components created

## 🎉 Congratulations!

You've successfully completed Week 1! Your e-commerce store foundation is now ready. 

**Next Week Preview**: We'll add authentication with Supabase Auth, implement role-based access control, and create protected routes for customers and admins.

## 🚀 Ready for Week 2?

Make sure you have:
- [x] A working development environment
- [x] Supabase project set up
- [x] Vercel deployment working
- [x] All environment variables configured

See you in Week 2! 🎯
