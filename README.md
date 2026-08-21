# Zen FinTrack

> **Simple tracking. Smarter saving.**

Zen FinTrack is a full-stack personal finance tracking application built with the **MERN stack**. It is designed to help users record income and expenses, preserve financial history, track accumulated savings, analyze spending, correct transaction mistakes without destroying the original record, and communicate with a single administrator through an integrated support system.

> **Note:** Zen FinTrack is a personal financial tracking application, not a banking or payment application.

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based authorization
- Exactly two roles:
  - `USER`
  - `ADMIN`
- Single-admin architecture
- User data isolation enforced on the backend

### 💰 Financial Tracking

Users can:

- Record income
- Record expenses
- View transaction history
- Search transactions
- Filter by type, category, date, and month
- View monthly and yearly financial history
- View current income
- View current expenses
- View remaining balance
- Track accumulated savings

### 🧾 Immutable Transaction History

Zen FinTrack intentionally avoids treating financial records like ordinary CRUD data.

Once a transaction is created:

- The transaction cannot be deleted
- The original amount cannot be changed
- The transaction type cannot be changed
- The title/name can be edited
- The description can be edited

This keeps the original financial history intact.

### 🔄 Mistake Correction System

If a user enters the wrong amount, the original transaction remains unchanged.

Instead, the user can:

1. Select the transaction
2. Choose **Report Mistake**
3. Enter the correct amount
4. Review the calculated difference
5. Confirm the correction

The system creates a separate `CORRECTION` transaction linked to the original record.

Example:

```text
Original expense:      ₹10,000
Correct amount:         ₹1,000
Correction:            -₹9,000
Effective expense:      ₹1,000
```

Corrections remain permanently visible in the transaction history.

### 💎 Savings & Monthly Rollover

Zen FinTrack separates the current financial state from historical transaction records.

When a new month's income is recorded:

```text
Previous positive remaining balance
                ↓
             Savings
                ↓
New month income
                ↓
New remaining balance
```

Savings accumulate across months and years.

A negative remaining balance is treated as a deficit and does **not** automatically reduce existing savings.

### 📊 Reports & Analytics

Available financial analysis includes:

- Monthly income
- Monthly expenses
- Remaining balance
- Expense by category
- Income vs. expenses
- Yearly summaries
- Savings history
- Month-by-month savings rollover

Interactive charts are implemented with **Recharts**.

### 💬 Support System

Users have access to a dedicated support page where they can:

- Create support requests
- Ask questions
- Report application problems
- Continue conversations in threaded tickets
- Reopen resolved conversations

Support statuses:

```text
OPEN
IN_PROGRESS
RESOLVED
```

The admin can manage support conversations and reply to users.

### 👤 Admin Management

The application uses a single-admin architecture.

The admin can:

- View registered users
- View user account/profile information
- View account status
- Delete user accounts
- Manage support requests
- Reply to support conversations
- Change support status

The admin **cannot access user financial data**, including:

- Income
- Expenses
- Transactions
- Savings
- Remaining balance
- Financial reports
- Financial history

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Material UI (MUI)
- Recharts
- JavaScript / JSX

### Backend

- Node.js
- Express.js
- JWT
- bcrypt
- JavaScript

### Database

- MongoDB
- Mongoose

All application data is designed to be persisted through MongoDB rather than temporary frontend or server-side arrays.

---

## 🎨 Design

Zen FinTrack uses a **Natural Tones** visual theme focused on clarity, trust, and simplicity.

### Design Characteristics

- Warm, natural color palette
- Clean card-based layouts
- Responsive interface
- Mobile-friendly navigation
- Accessible UI components
- Consistent Material UI components
- Clear financial indicators
- Minimal and uncluttered dashboards

### Typography

The design uses a combination of:

- Serif typography for expressive headings
- Sans-serif typography for application data and controls
- Monospace typography for currency and numerical integrity displays

---

## 🏗️ Architecture

```text
Zen FinTrack
│
├── Client
│   ├── React
│   ├── React Router
│   ├── Material UI
│   ├── Recharts
│   └── Axios
│
├── Server
│   ├── Express.js
│   ├── JWT Authentication
│   ├── Role Authorization
│   ├── Financial Engine
│   └── REST API
│
└── Database
    └── MongoDB + Mongoose
```

---

## 📁 Project Structure

```text
zen-fintrack/
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── SupportTicket.js
│   │   └── SupportMessage.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── reportController.js
│   │   ├── supportController.js
│   │   └── adminController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── supportRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── services/
│   │   └── financialEngine.js
│   │
│   └── db.js
│
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── support/
│   │   └── transactions/
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── TransactionsPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── SavingsPage.jsx
│   │   ├── SupportPage.jsx
│   │   └── AdminDashboardPage.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── utils/
│   │   └── formatters.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🗄️ Database Models

### Users

```text
_id
name
email
password
role
status
createdAt
updatedAt
```

### Transactions

```text
_id
userId
type
amount
title
description
category
transactionDate
referenceTransactionId
createdAt
updatedAt
```

Transaction types:

```text
INCOME
EXPENSE
CORRECTION
```

### Support Tickets

```text
_id
userId
subject
status
createdAt
updatedAt
```

### Support Messages

```text
_id
ticketId
senderId
senderRole
message
createdAt
```

---

## 🔒 Security Principles

Zen FinTrack treats financial data as private and sensitive application data.

The application implements:

- Password hashing
- JWT authentication
- Protected routes
- Role-based authorization
- Backend ownership validation
- Server-side input validation
- Environment variables for secrets
- Secure error handling
- User-level data isolation
- Admin financial-data isolation

The backend must never trust:

- Frontend role values
- Frontend user IDs
- Client-side financial calculations
- Client-side authorization

Financial calculations and authorization are validated on the server.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root/server environment according to the application's configuration.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

### Important

Never commit `.env` to GitHub.

Use `.env.example` as the template for required environment variables.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd zen-fintrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MongoDB

Create a MongoDB database and provide its connection string through:

```env
MONGODB_URI=your_mongodb_connection_string
```

### 4. Configure JWT

Add a secure secret:

```env
JWT_SECRET=your_secure_secret
```

### 5. Start the development server

```bash
npm run dev
```

### 6. Build for production

```bash
npm run build
```

### 7. Start the production server

```bash
npm start
```

> Exact scripts depend on the current `package.json` configuration.

---

## 🧭 Application Navigation

### User

```text
Zen FinTrack
│
├── Dashboard
├── Transactions
├── Reports
├── Savings
├── Support
└── Profile
```

### Admin

```text
Zen FinTrack Admin
│
├── Dashboard
├── Users
└── Support
```

The admin navigation intentionally does not expose financial dashboards or transaction pages.

---

## 🔄 Core Financial Logic

### Remaining Balance

```text
Remaining Balance
=
Income - Effective Expenses
```

Example:

```text
Income     = ₹50,000
Expenses   = ₹35,000
--------------------
Balance    = ₹15,000
```

### Positive Monthly Rollover

```text
July Remaining Balance
          ↓
       Savings
          ↓
August Income
          ↓
August Remaining Balance
```

### Deficit

```text
Income     = ₹30,000
Expenses   = ₹35,000
--------------------
Deficit    = -₹5,000
```

A deficit is reported to the user and does not automatically deduct from accumulated savings.

---

## 🧠 Product Philosophy

Zen FinTrack is built around:

```text
RECORD
   ↓
PRESERVE
   ↓
CORRECT
   ↓
CALCULATE
   ↓
REPORT
```

Instead of the traditional:

```text
CREATE
   ↓
EDIT
   ↓
DELETE
```

Financial history should remain trustworthy.

When a user makes a mistake, the original transaction stays intact and the correction becomes part of the permanent history.

---

## 🧪 Testing Areas

Important areas to test include:

- Registration
- Login
- Logout
- Authentication
- Role authorization
- User data isolation
- Admin data isolation
- Income calculations
- Expense calculations
- Remaining balance
- Monthly rollover
- Savings accumulation
- Year transition
- Transaction corrections
- Historical transactions
- Reports
- Support conversations
- User deletion

The financial calculation engine is especially important because incorrect rollover or correction logic can produce incorrect financial results.

---

## 📌 Development Roadmap

- [x] Project setup
- [x] Authentication
- [x] User/admin roles
- [x] Dashboard
- [x] Income tracking
- [x] Expense tracking
- [x] Immutable transactions
- [x] Transaction correction system
- [x] Financial calculation engine
- [x] Savings accumulation
- [x] Monthly/yearly rollover
- [x] Reports
- [x] Savings report
- [x] Support ticket system
- [x] Admin user management
- [x] Admin support panel
- [x] MongoDB/Mongoose persistence
- [x] JavaScript/JSX migration
- [x] Responsive UI
- [x] Natural Tones design theme

---

## 🎯 Project Goal

The goal of Zen FinTrack is to provide a reliable personal finance tracking experience focused on:

- Financial tracking
- Financial history
- Savings accumulation
- Transaction integrity
- Correction-based auditing
- User privacy
- Secure authentication
- Admin account management
- User support
- Professional responsive UI

Zen FinTrack is intended to feel like a real product rather than a basic MERN CRUD tutorial.

---

## 📄 License

Add your preferred license here before publishing the repository.

---

## 👨‍💻 Author

**Karthick**

**Zen FinTrack**  
*Simple tracking. Smarter saving.*
