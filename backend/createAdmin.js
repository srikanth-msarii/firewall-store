import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'; // Adjust path if needed
import path from 'path';

// 1. Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// 2. Admin credentials (you can change or read from process.argv)
const email = "admin@firewall-store.com";
const password = "J524D(7R<bm";

if (!email || !password) {
  console.error('ERROR: Missing admin email or password.');
  process.exit(1);
}

if (password.length < 6) {
  console.error('ERROR: Password must be at least 6 characters.');
  process.exit(1);
}

const createAdmin = async () => {
  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI not found in .env file.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // 3. Check if admin already exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log(`Admin already exists with email: ${email}`);
      console.log('No new admin created.');
      return;
    }

    // 4. Create new admin user
    const newAdmin = new User({
      email,
      password,
      isAdmin: true,
    });

    await newAdmin.save();

    console.log('----------------------------------------');
    console.log(`SUCCESS: New admin created: ${newAdmin.email}`);
    console.log('----------------------------------------');

  } catch (error) {
    console.error('An error occurred:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

// Run the script
createAdmin();
