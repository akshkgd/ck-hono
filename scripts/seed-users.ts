import argon2 from 'argon2';
import 'dotenv/config';
import { UserRepository } from '../src/modules/users/user.repository.js';

const firstNames = [
  "Aarav", "Ananya", "Kabir", "Diya", "Ishan", "Aisha", "Vihaan", "Priya", "Arjun", "Sneha",
  "Rohan", "Aditi", "Dev", "Riya", "Ayaan", "Neha", "Sai", "Kavya", "Aditya", "Pooja",
  "Aryan", "Shreya", "Rahul", "Tanvi", "Amit", "Nikita", "Vikram", "Kiara", "Sameer", "Ishita",
  "Sanjay", "Meera", "Vijay", "Divya", "Ajay", "Nisha", "Akash", "Swati", "Harish", "Preeti",
  "Manoj", "Kiran", "Suresh", "Lata", "Ramesh", "Gita", "Rajesh", "Sunita", "Anil", "Rekha"
];

const lastNames = [
  "Sharma", "Verma", "Gupta", "Patel", "Mehta", "Singh", "Joshi", "Reddy", "Nair", "Rao",
  "Kapoor", "Iyer", "Chowdary", "Sen", "Banerjee", "Das", "Kumar", "Mishra", "Dubey", "Pandey"
];

const occupations = [
  { type: "student", title: "Undergraduate Student", org: "IIT Bombay" },
  { type: "professional", title: "Software Engineer", org: "TCS" },
  { type: "professional", title: "Product Manager", org: "Infosys" },
  { type: "academic", title: "Research Scholar", org: "IISc Bangalore" },
  { type: "other", title: "Freelancer", org: "Self-Employed" }
];

async function seed() {
  console.log("Hashing password for dummy users...");
  const passwordHash = await argon2.hash("Password123!");
  const repo = new UserRepository();
  
  const dummyUsers = [];

  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    const mobile = `+91${7000000000 + i * 5947321 % 299999999}`;
    
    const occupation = occupations[i % occupations.length];
    const isStudent = occupation.type === "student";
    const expYears = isStudent ? 0 : (i % 12) + 1;
    
    let role: 'student' | 'admin' | 'user' | 'moderator' = 'user';
    if (isStudent) {
      role = 'student';
    } else if (i === 0) {
      role = 'admin';
    } else if (i === 1) {
      role = 'moderator';
    }

    dummyUsers.push({
      email,
      password: passwordHash,
      name,
      mobile,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${firstName}`,
      bio: `Hi, I am ${name}. I am a ${occupation.title} based in India.`,
      linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${i}`,
      githubUrl: `https://github.com/${firstName.toLowerCase()}-${i}`,
      occupationType: occupation.type as 'student' | 'professional' | 'academic' | 'other',
      occupationTitle: occupation.title,
      organization: occupation.org,
      experienceYears: expYears,
      role,
      status: 'active' as 'active' | 'inactive' | 'suspended',
      emailVerified: i % 5 !== 0,
      xp: (i % 10) * 150 + 50,
      currentStreak: i % 6,
      longestStreak: (i % 6) + (i % 4),
      metadata: { initialized: true }
    });
  }

  console.log(`Seeding 50 dummy Indian users into the database...`);
  try {
    await repo.createMany(dummyUsers);
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
}

seed();
