import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Transaction } from './models/Transaction.js';
import { SupportTicket } from './models/SupportTicket.js';
import { SupportMessage } from './models/SupportMessage.js';

let mongodInstance = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.startsWith('mongodb')) {
    try {
      console.log('[MongoDB] Connecting to provided MONGODB_URI...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('[MongoDB] Connected successfully to external MongoDB.');
      await seedDatabase();
      return;
    } catch (err) {
      console.warn('[MongoDB] Failed to connect to external MONGODB_URI. Falling back to in-memory MongoDB server...', err.message);
    }
  }

  // Use MongoMemoryServer as robust local/fallback database
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    console.log('[MongoDB] Spawning in-memory MongoDB instance at:', memoryUri);
    await mongoose.connect(memoryUri);
    console.log('[MongoDB] Connected successfully to Mongoose DB.');
    await seedDatabase();
  } catch (err) {
    console.error('[MongoDB] Critical connection error:', err);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('[MongoDB] Error disconnecting:', err);
  }
}

async function seedDatabase() {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log(`[MongoDB] Database already contains ${userCount} users. Skipping seed.`);
    return;
  }

  console.log('[MongoDB] Seeding initial users and financial dataset...');

  // 1. Create Master Admin
  const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASS, 10);
  const adminUser = await User.create({
    name: 'Zen FinTrack Administrator',
    email: process.env.ADMIN_EMAIL,
    password: adminPasswordHash,
    role: 'ADMIN',
    status: 'Active',
  });
 
  const userPasswordHash = await bcrypt.hash(process.env.USER_PASS, 10);
  const demoUser = await User.create({
    name: 'Karthick R',
    email: process.env.USER_EMAIL,
    password: userPasswordHash,
    role: 'USER',
    status: 'Active',
  });

  console.log(`[MongoDB] Created admin (${adminUser.email}) and demo user (${demoUser.email})`);

  // 3. Seed Realistic Transactions across multiple periods for Demo User
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  // Format month helpers
  const prevMonthDate = new Date(currentYear, currentMonth - 2, 1);
  const prevPeriod = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
  const currPeriod = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  // Prior Month Records
  const t1 = await Transaction.create({
    userId: demoUser._id,
    type: 'INCOME',
    amount: 75000,
    title: 'Monthly Tech Salary',
    description: 'Direct deposit for senior software development services',
    category: 'Salary',
    transactionDate: `${prevPeriod}-01`,
  });

  const t2 = await Transaction.create({
    userId: demoUser._id,
    type: 'EXPENSE',
    amount: 22000,
    title: 'Apartment Lease & Maintenance',
    description: 'Monthly flat rent paid via NEFT transfer',
    category: 'Bills',
    transactionDate: `${prevPeriod}-05`,
  });

  const t3 = await Transaction.create({
    userId: demoUser._id,
    type: 'EXPENSE',
    amount: 8500,
    title: 'Organic Food & Supermarket',
    description: 'Monthly grocery replenishment at Nature Basket',
    category: 'Food',
    transactionDate: `${prevPeriod}-10`,
  });

  const t4 = await Transaction.create({
    userId: demoUser._id,
    type: 'EXPENSE',
    amount: 3200,
    title: 'Fuel & Metro Recharge',
    description: 'Commute and local travel card recharge',
    category: 'Transport',
    transactionDate: `${prevPeriod}-15`,
  });

  // Current Month Records
  const t5 = await Transaction.create({
    userId: demoUser._id,
    type: 'INCOME',
    amount: 80000,
    title: 'Monthly Tech Salary + Bonus',
    description: 'Salary with performance milestone bonus',
    category: 'Salary',
    transactionDate: `${currPeriod}-01`,
  });

  const t6 = await Transaction.create({
    userId: demoUser._id,
    type: 'EXPENSE',
    amount: 22000,
    title: 'Apartment Lease',
    description: 'Rent for current cycle',
    category: 'Bills',
    transactionDate: `${currPeriod}-03`,
  });

  const t7 = await Transaction.create({
    userId: demoUser._id,
    type: 'EXPENSE',
    amount: 6400,
    title: 'Weekly Pantry Supplies',
    description: 'Fresh vegetables, fruits and pantry stock',
    category: 'Food',
    transactionDate: `${currPeriod}-08`,
  });

  const t8 = await Transaction.create({
    userId: demoUser._id,
    type: 'EXPENSE',
    amount: 12000,
    title: 'Ergonomic Standing Desk',
    description: 'Home office furniture upgrade',
    category: 'Shopping',
    transactionDate: `${currPeriod}-12`,
  });

  // Example Mistake & Linked Correction
  // Original restaurant bill recorded as 5000 instead of 3500
  const t9 = await Transaction.create({
    userId: demoUser._id,
    type: 'EXPENSE',
    amount: 5000,
    title: 'Team Dinner Bistro',
    description: 'Initial recorded receipt',
    category: 'Food',
    transactionDate: `${currPeriod}-16`,
  });

  // Linked correction adjustment of -1500
  await Transaction.create({
    userId: demoUser._id,
    type: 'CORRECTION',
    amount: -1500,
    title: 'Correction: Team Dinner Bistro',
    description: 'Corrected amount to ₹3500. Reason: Bill split calculation error',
    category: 'Food',
    transactionDate: `${currPeriod}-16`,
    referenceTransactionId: t9._id,
  });

  // 4. Seed Support Conversation
  const ticket1 = await SupportTicket.create({
    userId: demoUser._id,
    subject: 'Question on savings rollover between cycles',
    status: 'IN_PROGRESS',
  });

  await SupportMessage.create({
    ticketId: ticket1._id,
    senderId: demoUser._id,
    senderName: demoUser.name,
    senderRole: 'USER',
    message: 'Hello! I noticed my remaining balance rolled over into my accumulated savings automatically. Is there any fee or lock-in period for this?',
  });

  await SupportMessage.create({
    ticketId: ticket1._id,
    senderId: adminUser._id,
    senderName: 'Zen Administrator',
    senderRole: 'ADMIN',
    message: 'Greetings Karthick! Zen FinTrack operates on a 100% free, local/cloud-isolated ledger principle. There are no fees or lock-ins. Any unspent balance at the end of each monthly period rolls directly into your cumulative savings pool.',
  });

  console.log('[MongoDB] Database seeding completed successfully.');
}
