import 'dotenv/config';
import { db } from './db/index.js';
import { users } from './db/schema.js';

async function checkUsers() {
  try {
    const allUsers = await db.select().from(users).limit(5);
    console.log("Found users in DB:", allUsers.map(u => ({ id: u.id, email: u.email, role: u.role })));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
  process.exit(0);
}

checkUsers();
