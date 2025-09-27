# 🛒 Full-Stack E-Commerce Store

A modern, production-ready e-commerce store built with Next.js, Supabase, and Stripe. Perfect for students and developers looking to build a comprehensive portfolio project.

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Shadcn UI
- **Authentication:** Supabase Auth (email + social login)
- **Database:** Supabase PostgreSQL
- **ORM:** Drizzle ORM
- **Storage:** Supabase Storage
- **Payments:** Stripe
- **Emails:** Resend
- **Hosting:** Vercel
- **Analytics:** Recharts

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Week 1: Project Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd ecommerce-store

# Install dependencies
npm install
```

### Step 2: Environment Setup

1. Copy the environment example file:
```bash
cp env.example .env.local
```

2. Fill in your environment variables in `.env.local`:

#### Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Get your service role key from Settings > API (keep this secret!)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Database Setup
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### Step 3: Database Migration

1. Generate the database schema:
```bash
npm run db:generate
```

2. Apply the migrations to your Supabase database:
```bash
npm run db:migrate
```

### Step 4: Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

### Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## 📅 10-Week Development Roadmap

### Week 1: Project Setup ✅
- [x] Next.js + Tailwind + Shadcn UI setup
- [x] Supabase connection
- [x] Database schema design
- [x] Basic UI components
- [x] Vercel deployment

### Week 2: Authentication & Roles
- [ ] Supabase Auth integration
- [ ] Email + Google OAuth
- [ ] Role-based access control
- [ ] Protected routes

### Week 3: Database & Products
- [ ] Admin dashboard
- [ ] Product CRUD operations
- [ ] Image upload to Supabase Storage
- [ ] Category management

### Week 4: Catalog & Search
- [ ] Product listing page
- [ ] Filters and pagination
- [ ] Search functionality
- [ ] Product detail pages

### Week 5: Cart & Checkout
- [ ] Shopping cart state management
- [ ] Checkout flow
- [ ] Stripe payment integration
- [ ] Order processing

### Week 6: Orders & Notifications
- [ ] Order history
- [ ] Order status management
- [ ] Email notifications
- [ ] PDF invoices

### Week 7: Wishlist & Reviews
- [ ] Customer wishlist
- [ ] Product reviews and ratings
- [ ] Review moderation

### Week 8: Admin Dashboard & Analytics
- [ ] Sales analytics
- [ ] User management
- [ ] Inventory management
- [ ] Charts and reports

### Week 9: Final Touches
- [ ] Responsive design
- [ ] Dark/light mode
- [ ] SEO optimization
- [ ] Error handling

### Week 10: Deployment & Polish
- [ ] Production deployment
- [ ] Performance optimization
- [ ] Final testing
- [ ] Documentation

## 🗄️ Database Schema

The application uses the following main tables:

- **users** - User accounts with role-based access
- **categories** - Product categories
- **products** - Product catalog
- **orders** - Customer orders
- **order_items** - Individual items in orders
- **wishlist** - Customer wishlist items
- **reviews** - Product reviews and ratings
- **cart** - Persistent shopping cart

## 🚀 Getting Started with Each Week

Each week builds upon the previous one. Follow the weekly guides in the `/docs` folder for detailed step-by-step instructions.

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)

## 🤝 Contributing

This is a learning project! Feel free to:
- Add new features
- Improve existing code
- Fix bugs
- Add tests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you run into any issues:
1. Check the troubleshooting section in each week's guide
2. Look at the GitHub issues
3. Ask questions in the discussions

Happy coding! 🎉
