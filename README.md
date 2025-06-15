# AI-Powered Personal Finance Tracker

A modern, intelligent personal finance tracker built with React, TypeScript, Supabase, and AI-powered predictive analytics. Track your income and expenses with real user authentication and get smart predictions about your future spending patterns.

## 🚀 Features

### Core Functionality
- **Real User Authentication**: Secure signup/login with Supabase Auth
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Category Organization**: Pre-defined categories for better expense tracking
- **Real-time Dashboard**: Live statistics and financial overview
- **Data Export**: Export transactions to CSV format
- **Dark Mode**: Toggle between light and dark themes

### AI-Powered Insights
- **Expense Predictions**: AI forecasts next month's expenses by category
- **Trend Analysis**: Identify spending patterns and trends
- **Confidence Scoring**: Each prediction comes with a confidence level
- **Smart Alerts**: Get notified about unusual spending patterns

### User Experience
- **Secure Authentication**: Real user accounts with email verification
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **Optional Fields**: Description field is optional for quick entry
- **Smooth Animations**: Micro-interactions and transitions
- **Indian Rupee Support**: Native INR currency formatting

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Charts**: Chart.js with React integration
- **State Management**: React Context API + Custom Hooks
- **Icons**: Lucide React
- **Build Tool**: Vite
- **AI/ML**: Custom JavaScript implementation for predictions

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- A Supabase account

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ai-finance-tracker
npm install
```

### 2. Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env` and fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database
Run the SQL migration in your Supabase SQL editor:
```sql
-- Copy the contents of supabase/migrations/create_transactions_table.sql
-- and run it in your Supabase SQL editor
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## 🌐 Deployment

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect the Vite framework
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📊 Database Schema

### Transactions Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `amount` (Numeric, Required)
- `category` (Text, Required)
- `description` (Text, Optional)
- `date` (Date, Required)
- `type` (Text, 'income' or 'expense')
- `created_at` (Timestamp)

## 🔐 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Email Verification**: Optional email confirmation for new accounts
- **Secure Authentication**: Powered by Supabase Auth
- **Data Validation**: Client and server-side validation

## 🎯 Key Improvements

1. **Real Authentication**: No more demo accounts - users create real accounts
2. **Optional Description**: Quick transaction entry without mandatory description
3. **Backend Integration**: Supabase provides real database and authentication
4. **Production Ready**: Configured for Netlify and Vercel deployment
5. **Better UX**: Improved error handling and loading states

## 📈 AI Prediction Algorithm

The AI system uses several techniques to predict future expenses:

1. **Linear Regression**: Analyzes spending trends over time
2. **Moving Averages**: Smooths out data for better predictions
3. **Seasonal Patterns**: Considers monthly spending variations
4. **Confidence Scoring**: Calculates prediction reliability based on data consistency

## 🚀 Future Enhancements

- **Budget Management**: Set and track budget limits with alerts
- **Receipt Scanning**: OCR integration for automatic transaction entry
- **Investment Tracking**: Portfolio management and performance analysis
- **Multi-currency Support**: Handle different currencies and exchange rates
- **Mobile App**: React Native version for iOS and Android

## 📝 Environment Variables

Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using React, TypeScript, Supabase, and AI**

*This project showcases modern web development practices, real authentication, database integration, and AI-powered features - perfect for demonstrating full-stack capabilities to potential employers.*