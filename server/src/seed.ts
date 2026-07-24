import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import { AuthService } from './services/authService.js';

async function runSeed() {
  console.log('--- Mediqo Database Seeding ---');
  await connectDB();
  const res = await AuthService.seedUsers();
  console.log(`Seeding complete. Result:`, res);
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
