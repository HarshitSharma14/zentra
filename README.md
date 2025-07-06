# 💰 Zentra Finance - Personal Finance Visualizer

> A modern, comprehensive personal finance tracking application built with Next.js, offering real-time transaction management, intelligent budgeting, and insightful analytics. **No login required** - start tracking your finances instantly with localStorage-based user management.

**Live Demo**: [https://zentrafinance.vercel.app/](https://zentrafinance.vercel.app/) *(Try it now - no signup needed!)*

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-green?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## ✨ Features

### 🎯 **Smart Transaction Management**
- **Real-time tracking** of income and expenses
- **Advanced categorization** with custom categories
- **Running balance calculations** with automatic recalculation
- **Bulk operations** with optimized MongoDB queries
- **Search and filtering** capabilities

### 📊 **Intelligent Analytics**
- **Monthly spending analysis** with interactive pie charts
- **Daily spending trends** with responsive bar charts
- **Category-wise breakdowns** with percentage insights
- **Time-series navigation** across months and years
- **Real-time data visualization** with Recharts

### 🎯 **Advanced Budgeting System**
- **Monthly and yearly budget planning** with category allocation
- **Real-time spending vs budget tracking** with visual progress bars
- **Over-budget alerts** and remaining budget calculations
- **Auto-renewal options** for continuous budget management
- **Smart budget suggestions** based on spending patterns

### 🎨 **Modern User Experience**
- **No login required** - instant access with localStorage-based user management
- **Persistent data** across sessions without authentication hassles
- **Responsive design** that works on all devices
- **Dark/Light mode** with seamless transitions
- **Glassmorphism UI** with backdrop blur effects
- **Smooth animations** and micro-interactions
- **Intuitive navigation** with breadcrumb trails

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with modern hooks
- **Zustand** - Lightweight state management
- **Material UI** - Component library for complex dialogs
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component system
- **Recharts** - Data visualization library

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with aggregation pipelines
- **Mongoose** - ODM for MongoDB

### **Deployment**
- **Vercel** - Production deployment and hosting
- **MongoDB Atlas** - Cloud database hosting

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB database (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/zentra-finance.git
cd zentra-finance
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

6. **Start using immediately**
- No login required! The app creates a unique user ID stored in localStorage
- Choose to start with demo data (75 days of transactions) or begin fresh
- Your data persists across browser sessions automatically

---

## 🏗️ Project Architecture

### **State Management**
```
stores/
├── useFinanceStore.js          # Main Zustand store
└── slices/
    ├── userSlice.js           # User management
    ├── transactionSlice.js    # Transaction CRUD
    ├── budgetSlice.js         # Budget management
    ├── monthlyAnalysisSlice.js # Analytics
    └── uiSlice.js             # UI state
```

### **API Routes**
```
app/api/
├── user/
│   ├── create/                # User creation
│   ├── [userId]/             # User management
│   └── [userId]/category/    # Category management
├── transactions/
│   ├── [userId]/             # Transaction CRUD
│   ├── [userId]/[transactionId]/ # Individual transactions
│   └── recalculateBalances.js # Balance calculations
├── budget/
│   ├── [userId]/             # Budget CRUD
│   └── [userId]/[budgetType]/ # Budget deletion
└── analytics/
    └── monthly/[userId]/      # Monthly analytics
```

### **Components Structure**
```
components/
├── home/                     # Dashboard components
│   ├── HomePage.js
│   ├── SummaryCard.js
│   ├── MonthlyAnalysis.js
│   ├── CurrentBudget.js
│   └── AddTransactionDialog.js
├── transaction/              # Transaction management
│   ├── TransactionHistoryPage.js
│   └── TransactionList.js
└── budget/                   # Budget management
    ├── BudgetPage.js
    └── BudgetDialog.js
```

---

## 🎯 Key Features Deep Dive

### **Frictionless User Experience**
- **Zero authentication barriers** - no signup, login, or password management
- **Instant access** with automatic user creation via localStorage
- **Data persistence** across browser sessions without servers storing personal info
- **Privacy-focused** - your financial data stays on your device and chosen database

### **Transaction System**
- **Efficient running balance calculation** using MongoDB aggregation
- **Optimized recalculation** only affects transactions from specific dates
- **Bulk operations** for better performance
- **Real-time updates** across all components

### **Budget Intelligence**
- **Smart budget creation** based on spending analysis
- **Category-wise allocation** with visual progress tracking
- **Auto-renewal system** for continuous budget management
- **Over-budget notifications** with remaining amount calculations

### **Analytics Engine**
- **Real-time chart generation** with category breakdowns
- **Monthly comparison** with previous periods
- **Spending pattern analysis** across different time frames
- **Interactive visualizations** with hover effects and tooltips

### **Mock Data System**
- **75 days of realistic transactions** for demo purposes
- **Intelligent budget generation** based on actual spending patterns
- **Accurate summary calculations** from transaction history
- **Realistic financial scenarios** for testing and demonstrations

---

## 📱 Pages & Functionality

### **Dashboard (`/`)**
- Real-time financial summary
- Monthly analysis charts
- Quick transaction actions
- Budget overview cards

### **Transactions (`/transactions`)**
- Complete transaction history
- Advanced search and filtering
- Bulk operations support
- Real-time balance tracking

### **Budget (`/budget`)**
- Monthly and yearly budget management
- Category-wise budget allocation
- Real-time spending vs budget tracking
- Budget creation and editing dialogs

---

## 🎨 Design System

### **Color Palette**
- Uses modern OKLCH color space for better accessibility
- Consistent color scheme across light and dark modes
- Semantic color usage for different transaction types

### **Typography**
- Clear hierarchy with responsive font sizes
- Accessible font weights and line heights
- Consistent spacing and alignment

### **Components**
- Glassmorphism effects with backdrop blur
- Smooth transitions and micro-animations
- Responsive design patterns
- Accessible interaction states

---

## 🚀 Performance Optimizations

### **Database**
- **Efficient aggregation pipelines** for complex queries
- **Indexed collections** for faster lookups
- **Cursor-based pagination** for large datasets
- **Optimized running balance calculations**

### **Frontend**
- **Code splitting** with Next.js automatic optimization
- **Image optimization** with Next.js Image component
- **Lazy loading** for non-critical components
- **Memoized calculations** for expensive operations

### **State Management**
- **Zustand slices** for modular state organization
- **Optimistic updates** for better user experience
- **Efficient re-renders** with proper dependency arrays
- **Local state caching** for frequently accessed data

---

## 🔧 Development Highlights

### **Advanced Features**
- **Seamless user management** with localStorage-based authentication
- **Zero-friction onboarding** with optional demo data
- **Real-time running balance calculation** with efficient MongoDB operations
- **Intelligent budget suggestions** based on spending pattern analysis
- **Advanced search and filtering** with debounced inputs
- **Responsive data visualization** with interactive charts
- **Optimistic UI updates** for instant feedback

### **Code Quality**
- **Modular architecture** with clean separation of concerns
- **Type-safe operations** with proper validation
- **Error handling** with graceful fallbacks
- **Performance monitoring** with loading states
- **Accessibility compliance** with semantic HTML

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js team** for the amazing framework
- **Vercel** for seamless deployment
- **MongoDB** for robust database solutions
- **Recharts** for beautiful data visualizations
- **Material UI & Tailwind CSS** for UI components

---

## 📞 Contact

**Project Link**: [https://zentrafinance.vercel.app/](https://zentrafinance.vercel.app/)

---

<div align="center">

**Built with ❤️ using Next.js and modern web technologies**

*Empowering better financial decisions through intelligent data visualization*

</div>
