import 'dotenv/config';
import argon2 from 'argon2';
import { db } from '../src/db/index.js';
import { users, batches, batchEnrollments, batchEnrollmentPayments, batchSections, contentLibrary, batchContent } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

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

const batchTemplates = [
  { topic: "Next.js", name: "Next.js 14 Web Development Cohort", description: "Master premium fullstack application design with Next.js 14, App Router, and Server Actions.", slug: "nextjs-14-cohort", price: 4999, certificateFee: 499, type: "cohort" as const, status: "active" as const },
  { topic: "React Native", name: "React Native Mobile App Bootcamp", description: "Build and publish cross-platform iOS and Android mobile apps.", slug: "react-native-bootcamp", price: 5999, certificateFee: 599, type: "cohort" as const, status: "active" as const },
  { topic: "Backend Engineering", name: "Node.js & Hono Backend Masterclass", description: "Construct high-performance, stateless APIs using Hono, Drizzle, and PostgreSQL.", slug: "hono-backend-masterclass", price: 3999, certificateFee: 399, type: "cohort" as const, status: "active" as const },
  { topic: "Databases", name: "PostgreSQL & Database Design Blueprint", description: "Learn normalization, indexing, query optimization, and schema migrations.", slug: "postgres-database-design", price: 2999, certificateFee: 299, type: "live" as const, status: "active" as const },
  { topic: "TypeScript", name: "Advanced TypeScript Deep Dive", description: "Unlock advanced typing, generics, template literals, and utility types.", slug: "advanced-typescript-deep-dive", price: 1999, certificateFee: 199, type: "live" as const, status: "active" as const },
  { topic: "DevOps", name: "Docker & Kubernetes Deployment Fundamentals", description: "Containerize applications and deploy them at scale on Kubernetes.", slug: "docker-kubernetes-deployment", price: 4999, certificateFee: 499, type: "cohort" as const, status: "private" as const },
  { topic: "System Design", name: "System Design & Scalability Blueprint", description: "Design architectures supporting millions of concurrent requests.", slug: "system-design-blueprint", price: 7999, certificateFee: 999, type: "live" as const, status: "active" as const },
  { topic: "UI Design", name: "Tailwind CSS & Premium UI Design Workshop", description: "Create stunning, responsive components with modern UI/UX principles.", slug: "tailwind-ui-design-workshop", price: 999, certificateFee: 199, type: "live" as const, status: "active" as const },
  { topic: "Data Science", name: "Python & Data Science Foundations", description: "Introduction to NumPy, Pandas, Matplotlib, and Machine Learning basics.", slug: "python-data-science-foundations", price: 3499, certificateFee: 399, type: "live" as const, status: "active" as const },
  { topic: "AI", name: "Introduction to AI & Large Language Models", description: "Integrate Gemini and OpenAI models into your software applications.", slug: "intro-to-ai-llms", price: 4499, certificateFee: 499, type: "cohort" as const, status: "active" as const }
];

async function seed() {
  console.log("Starting full database seeding...");

  try {
    // 1. Seed Users (if empty)
    let existingUsers = await db.select().from(users).limit(5);
    let seededUsersList: any[] = [];
    
    if (existingUsers.length === 0) {
      console.log("No users found. Seeding 50 dummy users first...");
      const passwordHash = await argon2.hash("Password123!");
      const dummyUsers = [];

      console.log("Hashing password for custom admins...");
      const rohanHash = await argon2.hash("rohan123");
      const akshkgdHash = await argon2.hash("nuttertools");

      dummyUsers.push({
        email: "rohan@gmail.com",
        password: rohanHash,
        name: "Rohan",
        mobile: "+919999999999",
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=Rohan`,
        bio: "Co-Founder & Administrator.",
        linkedinUrl: null,
        githubUrl: null,
        occupationType: "professional" as const,
        occupationTitle: "Administrator",
        organization: "Codekaro",
        experienceYears: 5,
        role: "admin" as const,
        status: "active" as const,
        emailVerified: true,
        xp: 1000,
        currentStreak: 5,
        longestStreak: 10,
        metadata: { isCustomAdmin: true }
      });

      dummyUsers.push({
        email: "akshkgd@gmail.com",
        password: akshkgdHash,
        name: "Aksh",
        mobile: "+918888888888",
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=Aksh`,
        bio: "Administrator & Core Developer.",
        linkedinUrl: null,
        githubUrl: null,
        occupationType: "professional" as const,
        occupationTitle: "Administrator",
        organization: "Codekaro",
        experienceYears: 5,
        role: "admin" as const,
        status: "active" as const,
        emailVerified: true,
        xp: 1000,
        currentStreak: 5,
        longestStreak: 10,
        metadata: { isCustomAdmin: true }
      });

      for (let i = 0; i < 50; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[i % lastNames.length];
        const name = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
        const mobile = `+91${7000000000 + i * 5947321 % 299999999}`;
        const occupation = occupations[i % occupations.length];
        const isStudent = occupation.type === "student";
        const expYears = isStudent ? 0 : (i % 12) + 1;
        
        let role: 'student' | 'admin' | 'user' | 'moderator' | 'teacher' = 'user';
        if (isStudent) {
          role = 'student';
        } else if (i === 0) {
          role = 'admin';
        } else if (i === 1) {
          role = 'moderator';
        } else if (i % 8 === 0) {
          role = 'teacher';
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
          occupationType: occupation.type as any,
          occupationTitle: occupation.title,
          organization: occupation.org,
          experienceYears: expYears,
          role,
          status: 'active' as any,
          emailVerified: i % 5 !== 0,
          xp: (i % 10) * 150 + 50,
          currentStreak: i % 6,
          longestStreak: (i % 6) + (i % 4),
          metadata: { initialized: true }
        });
      }
      
      seededUsersList = await db.insert(users).values(dummyUsers).returning();
      console.log(`Successfully seeded ${seededUsersList.length} users!`);
    } else {
      seededUsersList = await db.select().from(users);
      console.log(`Found ${seededUsersList.length} existing users. Skipping user seeding.`);
    }

    const adminUser = seededUsersList.find(u => u.role === 'admin') || seededUsersList[0];

    // 2. Seed Batches (if empty)
    let existingBatches = await db.select().from(batches).limit(5);
    let seededBatchesList: any[] = [];

    if (existingBatches.length === 0) {
      console.log("No batches found. Seeding 10 educational batches...");
      const dummyBatches = batchTemplates.map((b) => ({
        ...b,
        startDate: '2026-07-01',
        endDate: '2026-10-01',
        teacherId: adminUser.id,
        limit: 100,
        metadata: { level: "intermediate" }
      }));

      seededBatchesList = await db.insert(batches).values(dummyBatches).returning();
      console.log(`Successfully seeded ${seededBatchesList.length} batches!`);
    } else {
      seededBatchesList = await db.select().from(batches);
      console.log(`Found ${seededBatchesList.length} existing batches. Skipping batch seeding.`);
    }

    // 2.5 Seed Content Library & Batch curriculum (sections and content associations)
    let existingContent = await db.select().from(contentLibrary).limit(5);
    let seededContentList: any[] = [];

    if (existingContent.length === 0) {
      console.log("Seeding Content Library items...");
      const dummyContent = [
        {
          title: "Introduction to HTML & CSS",
          desc: "Learn the absolute basics of building web pages with semantic HTML elements and modern CSS layout properties.",
          type: "video" as const,
          contentType: "primary" as const,
          videoLink: "https://youtube.com/watch?v=html-css-basics",
          videoDuration: 1200,
          xp: 100,
          metadata: { category: "Frontend" }
        },
        {
          title: "Advanced Tailwind Responsive Design",
          desc: "Understand how to implement fluid layouts using Tailwind CSS breakpoints, container queries, and responsive grid layouts.",
          type: "video" as const,
          contentType: "primary" as const,
          videoLink: "https://youtube.com/watch?v=tailwind-responsive",
          videoDuration: 1800,
          xp: 150,
          metadata: { category: "CSS" }
        },
        {
          title: "Building a Flexbox Navigation Bar",
          desc: "A hands-on coding lab where you build a pixel-perfect, interactive navigation bar using Flexbox alignment rules.",
          type: "coding lab" as const,
          contentType: "primary" as const,
          solutionCode: "nav { display: flex; justify-content: space-between; align-items: center; }",
          xp: 200,
          metadata: { category: "Labs" }
        },
        {
          title: "DOM Manipulation & Event Listeners",
          desc: "Learn how to dynamically change page contents and respond to user clicks, keyboard inputs, and scroll actions.",
          type: "video" as const,
          contentType: "primary" as const,
          videoLink: "https://youtube.com/watch?v=dom-events",
          videoDuration: 2400,
          xp: 120,
          metadata: { category: "JavaScript" }
        },
        {
          title: "Create an Interactive To-Do List Application",
          desc: "Complete assignment: Build a functional To-Do list with Add, Edit, Delete and LocalStorage persistence functionality.",
          type: "assignment" as const,
          contentType: "primary" as const,
          assignment: "Build a To-Do list application matching the mockup in index.html.",
          xp: 300,
          metadata: { category: "Assignment" }
        },
        {
          title: "Understanding CSS Backdrops and Glassmorphism",
          desc: "An article exploring the properties of backdrop-filter, opacity, and blur to create modern Glassmorphism visual layouts.",
          type: "article" as const,
          contentType: "secondary" as const,
          xp: 50,
          metadata: { category: "Design" }
        },
        {
          title: "Asynchronous Javascript: Promises & Async/Await",
          desc: "Master async patterns, HTTP calls using fetch, and error handling using try-catch blocks.",
          type: "video" as const,
          contentType: "primary" as const,
          videoLink: "https://youtube.com/watch?v=async-js",
          videoDuration: 3000,
          xp: 180,
          metadata: { category: "JavaScript" }
        },
        {
          title: "Node.js Basics and File System Modules",
          desc: "Learn to read and write local files, manage paths, and run backend scripts using Node.",
          type: "video" as const,
          contentType: "primary" as const,
          videoLink: "https://youtube.com/watch?v=node-fs",
          videoDuration: 1500,
          xp: 110,
          metadata: { category: "Node" }
        }
      ];

      seededContentList = await db.insert(contentLibrary).values(dummyContent).returning();
      console.log(`Successfully seeded ${seededContentList.length} Content Library items!`);

      // Seed curriculum sections and associate contents for each batch
      if (seededBatchesList.length > 0) {
        console.log("Seeding curriculum sections and associating contents for each batch...");
        const sectionsData = [];
        for (const batch of seededBatchesList) {
          sectionsData.push(
            {
              title: "Module 1: Foundations & Architecture",
              batchId: batch.id,
              order: 1
            },
            {
              title: "Module 2: Core Engineering Practice",
              batchId: batch.id,
              order: 2
            }
          );
        }

        const seededSections = await db.insert(batchSections).values(sectionsData).returning();
        console.log(`Successfully seeded ${seededSections.length} batch sections!`);

        // Associate contents: for each section, map some content items
        const batchContentData = [];
        for (let i = 0; i < seededSections.length; i++) {
          const section = seededSections[i];
          // Pick two contents from the library
          const content1 = seededContentList[i % seededContentList.length];
          const content2 = seededContentList[(i + 1) % seededContentList.length];

          batchContentData.push(
            {
              batchId: section.batchId,
              sectionId: section.id,
              contentId: content1.id,
              order: 1,
              accessOn: 0, // Instant access
              canSubmitAssignment: content1.type === "assignment"
            },
            {
              batchId: section.batchId,
              sectionId: section.id,
              contentId: content2.id,
              order: 2,
              accessOn: 1, // Access on day 1
              canSubmitAssignment: content2.type === "assignment"
            }
          );
        }

        await db.insert(batchContent).values(batchContentData);
        console.log("Successfully linked curriculum content items to batch sections!");
      }
    } else {
      seededContentList = await db.select().from(contentLibrary);
      console.log(`Found ${seededContentList.length} existing Content Library items. Skipping content seeding.`);
    }

    // 3. Seed Enrollments & Payments (if empty)
    let existingEnrollments = await db.select().from(batchEnrollments).limit(5);

    if (existingEnrollments.length === 0) {
      console.log("Seeding batch enrollments and payment records...");

      const dummyEnrollments = [];
      const studentsOnly = seededUsersList.filter(u => u.role !== 'admin');

      // Loop through users, randomly enrolling them in 1-3 batches
      for (let i = 0; i < studentsOnly.length; i++) {
        const user = studentsOnly[i];
        const enrolCount = (i % 3) + 1; // 1, 2, or 3 enrollments
        
        // Shuffle batches
        const shuffledBatches = [...seededBatchesList].sort(() => 0.5 - Math.random());
        const selectedBatches = shuffledBatches.slice(0, enrolCount);

        for (const batch of selectedBatches) {
          const randType = i % 4 === 0 ? 'free' as const : (i % 4 === 1 ? 'Subscription' as const : 'oneTime' as const);
          const randStatus = i % 5 === 0 ? 0 : (i % 5 === 4 ? 2 : 1); // 0 Inactive, 2 Cancelled, 1 Active
          const progress = (i * 7) % 101;
          const timeSpent = progress * 150;
          const amountPayable = randType === 'free' ? 0 : batch.price;
          const amountPaid = randStatus === 1 ? amountPayable : (randStatus === 2 ? Math.floor(amountPayable / 2) : 0);
          
          let paymentStatus: 'created' | 'captured' | 'failed' | 'refunded' = 'created';
          if (amountPaid > 0) {
            paymentStatus = randStatus === 2 ? 'refunded' : 'captured';
          } else if (randType === 'free') {
            paymentStatus = 'captured';
          }

          dummyEnrollments.push({
            userId: user.id,
            batchId: batch.id,
            amountPayable,
            enrollmentType: randType,
            status: randStatus,
            progress,
            timeSpentSeconds: timeSpent,
            amountPaid,
            certificateFee: batch.certificateFee,
            paymentStatus,
            paymentMethod: randType === 'free' ? 'free' : (i % 2 === 0 ? 'UPI' : 'Razorpay'),
            paidAt: paymentStatus === 'captured' || paymentStatus === 'refunded' ? new Date(Date.now() - (i % 15) * 24 * 60 * 60 * 1000) : null,
            remark: "Manual seed data enrollment",
            metadata: { cohortGroup: `Group-${i % 4}` }
          });
        }
      }

      console.log(`Inserting ${dummyEnrollments.length} enrollment records...`);
      const insertedEnrollments = await db.insert(batchEnrollments).values(dummyEnrollments).returning();
      console.log(`Successfully seeded ${insertedEnrollments.length} enrollments!`);

      // Seed Payments for captured/refunded enrollments
      console.log("Seeding enrollment payments...");
      const dummyPayments = [];

      for (let i = 0; i < insertedEnrollments.length; i++) {
        const enroll = insertedEnrollments[i];
        
        if (enroll.amountPaid && enroll.amountPaid > 0) {
          const timestamp = enroll.paidAt || new Date();
          dummyPayments.push({
            batchEnrollmentId: enroll.id,
            amount: enroll.amountPaid,
            paidAt: timestamp,
            paymentMethod: enroll.paymentMethod || 'UPI',
            transactionId: `pay_tx_${Date.now().toString().slice(-6)}_${i}`,
            invoiceId: `inv_id_${Date.now().toString().slice(-6)}_${i}`,
            purpose: 'enrollment',
            isGstApplicable: true,
            remarks: "Initial enrollment payment record",
            metadata: { gateway: "Razorpay" }
          });

          // Add a renewal payment for subscriptions just to show historical payments
          if (enroll.enrollmentType === 'Subscription' && enroll.status === 1) {
            dummyPayments.push({
              batchEnrollmentId: enroll.id,
              amount: enroll.amountPaid,
              paidAt: new Date(timestamp.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days prior
              paymentMethod: enroll.paymentMethod || 'UPI',
              transactionId: `pay_tx_${Date.now().toString().slice(-6)}_sub_${i}`,
              invoiceId: `inv_id_${Date.now().toString().slice(-6)}_sub_${i}`,
              purpose: 'renewal',
              isGstApplicable: true,
              remarks: "Subscription renewal payment",
              metadata: { gateway: "Razorpay" }
            });
          }
        }
      }

      if (dummyPayments.length > 0) {
        console.log(`Inserting ${dummyPayments.length} payment records...`);
        const insertedPayments = await db.insert(batchEnrollmentPayments).values(dummyPayments).returning();
        console.log(`Successfully seeded ${insertedPayments.length} payment records!`);
      }
    } else {
      console.log(`Found existing enrollments. Skipping enrollment and payment seeding.`);
    }

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
}

seed();
