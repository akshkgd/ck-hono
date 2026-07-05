import 'dotenv/config';
import { ContentLibraryRepository } from '../src/modules/content-library/content-library.repository.js';

const fullStackTopics = [
  {
    title: "HTML Semantic Markup Guide",
    desc: "A comprehensive guide to writing clean, accessible HTML using semantic tags like article, section, header, and footer.",
    type: "article" as const,
    contentType: "primary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Always check MDN docs for tag definitions.", "Use section only if there is a natural heading."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 15 }
  },
  {
    title: "CSS Flexbox Sandbox",
    desc: "Learn CSS flexbox layout alignment, wrapping, and direction through interactive exercises.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=css-flexbox",
    solutionCode: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
    hints: ["justify-content aligns along main axis.", "align-items aligns along cross axis."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 30 }
  },
  {
    title: "CSS Grid Responsive Layout",
    desc: "Construct a fully responsive gallery layout using CSS Grid auto-fit and minmax formulas.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=css-grid",
    solutionCode: ".gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 16px;\n}",
    hints: ["Use repeat(auto-fit, ...) for wrapping.", "minmax prevents cards from shrinking too much."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 45 }
  },
  {
    title: "JavaScript Promises and Async/Await",
    desc: "Deep dive into JS asynchronous behavior, promise lifecycle, resolving, rejecting, and async/await syntax sugar.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=js-async",
    solutionCode: "async function fetchData() {\n  try {\n    const res = await fetch('url');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}",
    hints: ["Async functions always return a Promise.", "Use try-catch block for handling async errors."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 20 }
  },
  {
    title: "Fetching Web APIs Practice",
    desc: "An assignment to fetch weather data from a mock REST API endpoint and display it in the console.",
    type: "assignment" as const,
    contentType: "primary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Verify endpoint returns valid JSON.", "Always handle network connection failures."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 60 }
  },
  {
    title: "DOM Manipulation Checklist",
    desc: "A hands-on coding task to dynamically append task items to a list on button click.",
    type: "assignment" as const,
    contentType: "primary" as const,
    videoLink: null,
    solutionCode: "const btn = document.querySelector('#btn');\nbtn.addEventListener('click', () => {\n  const li = document.createElement('li');\n  li.textContent = 'New Task';\n  document.querySelector('#list').appendChild(li);\n});",
    hints: ["querySelector gets elements.", "addEventListener registers click handler."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 40 }
  },
  {
    title: "React Functional Components",
    desc: "Understand how React rendering works and how functional components replace class components.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=react-components",
    solutionCode: "export function Welcome({ name }) {\n  return <h1>Hello, {name}</h1>;\n}",
    hints: ["Props must be read-only.", "Return JSX inside components."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 15 }
  },
  {
    title: "React useState & useEffect Hook",
    desc: "Master state preservation and mounting/updating side-effects using standard React hook APIs.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=react-hooks",
    solutionCode: "import { useState, useEffect } from 'react';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    document.title = `Clicked ${count} times`;\n  }, [count]);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}",
    hints: ["Dependency array controls hook re-triggering.", "useState returns current state and set function."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 25 }
  },
  {
    title: "React Custom Hook for Fetching",
    desc: "Write a reusable custom React hook `useFetch` to modularize network request states.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=react-custom-hook",
    solutionCode: "import { useState, useEffect } from 'react';\nexport function useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  useEffect(() => {\n    fetch(url).then(res => res.json()).then(data => {\n      setData(data);\n      setLoading(false);\n    });\n  }, [url]);\n  return { data, loading };\n}",
    hints: ["Start custom hook names with 'use'.", "Keep hooks functional and stateless of business rules."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 50 }
  },
  {
    title: "React Context API Setup",
    desc: "Resolve prop drilling in React by establishing a global state Context provider.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=react-context",
    solutionCode: "import { createContext, useContext, useState } from 'react';\nconst AuthContext = createContext(null);\nexport function AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;\n}\nexport const useAuth = () => useContext(AuthContext);",
    hints: ["Create context, export custom context hook.", "Wrap App component inside provider."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 45 }
  },
  {
    title: "React Performance & Memoization",
    desc: "An article covering when to apply React.memo, useMemo, and useCallback optimization hooks.",
    type: "article" as const,
    contentType: "secondary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Do not over-use memoization; it has memory overhead.", "React.memo skips re-rendering on unchanged props."],
    metadata: { difficulty: "advanced", estimatedTimeMinutes: 20 }
  },
  {
    title: "Node.js Event Loop Architecture",
    desc: "A detailed article explaining the phase cycle of the Node.js event loop: timers, poll, check, close.",
    type: "article" as const,
    contentType: "secondary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Microtasks queue is processed after each phase.", "libuv manages async pool execution."],
    metadata: { difficulty: "advanced", estimatedTimeMinutes: 30 }
  },
  {
    title: "Express Server Boilerplate",
    desc: "Create and start a minimalist Express.js server listening on port 3000.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=express-start",
    solutionCode: "import express from 'express';\nconst app = express();\napp.get('/', (req, res) => res.send('OK'));\napp.listen(3000, () => console.log('Running'));",
    hints: ["Ensure express is in package.json.", "Use server listening callback to verify startup."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 15 }
  },
  {
    title: "Express CRUD REST API for Users",
    desc: "Build HTTP endpoints matching standard REST patterns: GET, POST, PUT, DELETE for users.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=express-crud",
    solutionCode: "app.get('/users', (req, res) => res.json(users));\napp.post('/users', (req, res) => {\n  users.push(req.body);\n  res.status(201).json(req.body);\n});",
    hints: ["Return appropriate status codes: 201 for Created, 200 for OK.", "Access body elements from req.body."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 50 }
  },
  {
    title: "Express Middleware pattern",
    desc: "Explore Express.js routing middleware flow, next() function parameter, and req/res mutations.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=express-middleware",
    solutionCode: "function requestLogger(req, res, next) {\n  console.log(`${req.method} ${req.path}`);\n  next();\n}",
    hints: ["Always call next() to prevent requests from hanging.", "Middlewares can mutate req and res directly."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 20 }
  },
  {
    title: "Express Global Error Handler",
    desc: "Establish a central catch-all error handling middleware block to format internal system errors.",
    type: "assignment" as const,
    contentType: "primary" as const,
    videoLink: null,
    solutionCode: "app.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: 'Internal Server Error' });\n});",
    hints: ["Error handling middleware MUST take 4 parameters: (err, req, res, next).", "Do not expose raw error stack traces to public users."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 45 }
  },
  {
    title: "JWT Authentication in Node.js",
    desc: "Establish secure API sign-in routes using JSON Web Tokens (JWT) for stateless session token claims.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=jwt-auth",
    solutionCode: "import jwt from 'jsonwebtoken';\nconst token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });",
    hints: ["Store JWT token inside Bearer authorization header.", "Never encode plain passwords inside JWT payloads."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 30 }
  },
  {
    title: "Cookies vs LocalStorage for Session Storage",
    desc: "Comprehensive article analyzing XSS and CSRF vulnerability trade-offs for token storage.",
    type: "article" as const,
    contentType: "secondary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["HttpOnly cookies prevent XSS theft.", "LocalStorage is prone to malicious script extraction."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 15 }
  },
  {
    title: "Password Hashing with Argon2",
    desc: "Integrate Argon2 cryptographic hashing algorithms to secure customer passwords inside databases.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=argon2-hash",
    solutionCode: "import argon2 from 'argon2';\nconst hash = await argon2.hash(password);\nconst valid = await argon2.verify(hash, password);",
    hints: ["Argon2 is highly memory-hard and time-hard.", "Never store plain passwords."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 25 }
  },
  {
    title: "SQL Basics: SELECT and JOINs",
    desc: "An interactive SQL lab writing JOIN queries to fetch and correlate order records and user records.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=sql-joins",
    solutionCode: "SELECT users.name, orders.amount\nFROM users\nINNER JOIN orders ON users.id = orders.user_id;",
    hints: ["INNER JOIN returns only matching rows from both tables.", "Alias table names for cleaner code structures."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 30 }
  },
  {
    title: "PostgreSQL Database Schema Design",
    desc: "An article walking through normalization rules, foreign key constraints, and schema structuring.",
    type: "article" as const,
    contentType: "primary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Normalize data to 3NF to prevent duplicate records.", "Ensure foreign keys index appropriately."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 25 }
  },
  {
    title: "Drizzle ORM setup & migrations",
    desc: "Learn to declare TypeScript Drizzle schemas, generate SQL migration files, and execute schema migrations.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=drizzle-migrations",
    solutionCode: "import { pgTable, serial, text } from 'drizzle-orm/pg-core';\nexport const users = pgTable('users', {\n  id: serial('id').primaryKey(),\n  name: text('name')\n});",
    hints: ["Use drizzle-kit push during active sandbox testing.", "Keep migration histories versioned in git."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 30 }
  },
  {
    title: "MongoDB Basic CRUD Operations",
    desc: "Write collection insertion, search filters, array pushing, and deletion statements in MongoDB shell.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=mongodb-crud",
    solutionCode: "db.users.insertOne({ name: 'Amit', age: 25 });\ndb.users.find({ age: { $gt: 20 } });",
    hints: ["MongoDB uses BSON records.", "Use operators like $gt, $lt, $in for querying data."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 40 }
  },
  {
    title: "Mongoose Schema Validations",
    desc: "Configure customized data validations, default rules, and pre-save hooks in Mongoose ODM.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=mongoose-validation",
    solutionCode: "const userSchema = new mongoose.Schema({\n  email: { type: String, required: true, unique: true }\n});",
    hints: ["Pre-save hooks can hash passwords automatically.", "Handle duplicate key errors (11000) inside Express middleware."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 45 }
  },
  {
    title: "Database Indexing for O(1) Lookups",
    desc: "An article clarifying B-Tree indexes, compound indexes, and how Postgres evaluates index scans.",
    type: "article" as const,
    contentType: "secondary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Indexes speed up reads but slow down writes.", "Filter fields (WHERE, JOIN) are primary candidates for indexing."],
    metadata: { difficulty: "advanced", estimatedTimeMinutes: 35 }
  },
  {
    title: "Database Transactions in PostgreSQL",
    desc: "A video guide on ACID properties and writing transactional statements (BEGIN, COMMIT, ROLLBACK).",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=db-transactions",
    solutionCode: "BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
    hints: ["Transactions prevent partial write issues.", "Rollback happens automatically if a sub-query fails."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 20 }
  },
  {
    title: "N+1 Query Problem Prevention",
    desc: "Understand what causes N+1 query loop problems and how to solve them via eager loading and joins.",
    type: "article" as const,
    contentType: "secondary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Never execute database queries inside loop blocks.", "Pre-load associations using JOIN clauses."],
    metadata: { difficulty: "advanced", estimatedTimeMinutes: 25 }
  },
  {
    title: "Dockerizing Fullstack Applications",
    desc: "Build customized Dockerfiles and compile Docker Compose files orchestrating Node backend, React frontend, and Postgres.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=docker-compose",
    solutionCode: "version: '3.8'\nservices:\n  db:\n    image: postgres\n    ports:\n      - '5432:5432'",
    hints: ["Use multi-stage builds for React production bundles.", "Map persistent data directories using volumes."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 45 }
  },
  {
    title: "GitHub Actions CI/CD Pipeline Setup",
    desc: "Write Github action YAML workflows validating builds, running vitest files, and deploying via SSH.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=github-actions",
    solutionCode: "name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: npm install",
    hints: ["Encrypt credentials inside GitHub Secrets.", "Cache node_modules directories to speed up pipelines."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 30 }
  },
  {
    title: "VPS Deployments (DigitalOcean Droplet)",
    desc: "A step-by-step article explaining firewall setup, Node deployment via PM2, and Nginx proxy settings.",
    type: "article" as const,
    contentType: "primary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Use SSH keys instead of root passwords.", "Configure Nginx as a reverse proxy mapping port 80 to your Node app."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 40 }
  },
  {
    title: "CORS Header Configurations",
    desc: "A video guide about Cross-Origin Resource Sharing rules and configuring CORS middleware policies.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=cors-config",
    solutionCode: "import cors from 'cors';\napp.use(cors({\n  origin: 'https://myfrontend.com',\n  credentials: true\n}));",
    hints: ["Do not use '*' as origin if credentials (cookies/tokens) are passed.", "Ensure Preflight OPTIONS requests return a 204 status code."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 20 }
  },
  {
    title: "Rate Limiting REST APIs",
    desc: "Prevent denial of service (DoS) attacks by locking IP address request quotas inside Express middleware.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=rate-limit",
    solutionCode: "import rateLimit from 'express-rate-limit';\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100\n});",
    hints: ["Use Redis as a backing store for rate limit states in production.", "Pass rate limit headers (X-RateLimit-Limit) in responses."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 40 }
  },
  {
    title: "Writing Unit Tests with Vitest",
    desc: "Configure Vitest test environments, mock external services, and write basic unit assertions.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=vitest-basics",
    solutionCode: "import { test, expect } from 'vitest';\ntest('sums numbers', () => {\n  expect(sum(1, 2)).toBe(3);\n});",
    hints: ["Mock external APIs to prevent test fragility.", "Keep assertions simple and descriptive."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 25 }
  },
  {
    title: "REST API Route testing with Supertest",
    desc: "Launch integration testing assertions checking Express route endpoints, headers, and responses.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=supertest-routes",
    solutionCode: "import request from 'supertest';\nimport app from './app';\nrequest(app).get('/v1/users').expect(200);",
    hints: ["Do not run server listen functions during test suites.", "Clear database tables after each test run."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 45 }
  },
  {
    title: "LocalStorage State Persistence",
    desc: "A coding lab focused on syncing application state to localStorage and loading it on initialization.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: null,
    solutionCode: "const saveState = (state) => localStorage.setItem('state', JSON.stringify(state));\nconst loadState = () => JSON.parse(localStorage.getItem('state'));",
    hints: ["Wrap parse actions in try-catch blocks to prevent crashes on corrupt JSON.", "LocalStorage size is limited to ~5MB."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 30 }
  },
  {
    title: "JWT Token Refresh Flow",
    desc: "A video explaining access tokens (short expiry) and refresh tokens (long expiry) pattern flow.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=jwt-refresh",
    solutionCode: "app.post('/refresh', (req, res) => {\n  const token = req.cookies.refreshToken;\n  // verify token and generate new access token\n});",
    hints: ["Store refresh tokens in secure HttpOnly cookies.", "Configure refresh token rotation (RTR) to prevent reuse."],
    metadata: { difficulty: "advanced", estimatedTimeMinutes: 35 }
  },
  {
    title: "Websockets Chat Server Setup",
    desc: "Create a simple real-time chat application using ws or Socket.io libraries.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=websockets-chat",
    solutionCode: "import { WebSocketServer } from 'ws';\nconst wss = new WebSocketServer({ port: 8080 });\nwss.on('connection', ws => {\n  ws.on('message', msg => console.log('received: %s', msg));\n});",
    hints: ["Websockets run over TCP.", "Handle connection close events cleanly to free up resources."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 60 }
  },
  {
    title: "Redis Caching for Slow API Endpoints",
    desc: "Connect backend application endpoints to Redis instances to cache and read expensive SQL query results.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=redis-cache",
    solutionCode: "import Redis from 'ioredis';\nconst redis = new Redis();\nconst cached = await redis.get('key');",
    hints: ["Configure TTL (time to live) to prevent stale cache blocks.", "Invalidate keys immediately on update mutations."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 30 }
  },
  {
    title: "Next.js React Server Components Introduction",
    desc: "An article introducing RSC paradigm, server components, client components, and async rendering.",
    type: "article" as const,
    contentType: "primary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["RSCs render on the server side and send HTML.", "Mark client-interactive elements with the 'use client' directive."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 20 }
  },
  {
    title: "Next.js Routing and Page Layouts",
    desc: "Learn to declare dynamic route paths, layout nesting, and loading screens inside Next.js App Router.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=next-routing",
    solutionCode: "// app/blog/[slug]/page.tsx\nexport default function Page({ params }) {\n  return <div>Post: {params.slug}</div>;\n}",
    hints: ["Folders map to URL paths.", "Use nested layout.tsx files to keep persistent UI states."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 30 }
  },
  {
    title: "Next.js Data Fetching & Caching Strategy",
    desc: "Explore Next.js extended fetch API, static generation, on-demand revalidation, and static vs dynamic routes.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=next-fetching",
    solutionCode: "const res = await fetch('url', { next: { revalidate: 3600 } });",
    hints: ["Fetch responses are cached automatically.", "Use revalidateTag to trigger cache updates dynamically."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 40 }
  },
  {
    title: "Tailwind CSS Styling Basics",
    desc: "An article explaining Tailwind utility-first styling patterns, configuration files, and purging setups.",
    type: "article" as const,
    contentType: "primary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Use tailwind config file to expand base styling rules.", "Do not write arbitrary custom values directly in JSX, map them to theme tokens."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 15 }
  },
  {
    title: "Git Branching and PR Best Practices",
    desc: "An article detailing Git branch naming rules, branch merging, squash commits, and pull requests reviews.",
    type: "article" as const,
    contentType: "secondary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Do not commit directly to main/master branches.", "Write descriptive commit messages following Conventional Commits guidelines."],
    metadata: { difficulty: "beginner", estimatedTimeMinutes: 20 }
  },
  {
    title: "Server-Side Rendering vs Static Generation",
    desc: "Understand differences, execution environments, and CWV optimization benefits of SSR vs SSG.",
    type: "article" as const,
    contentType: "secondary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Use SSG for static pages (blog, marketing).", "Use SSR for highly dynamic user-dependent dashboards."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 15 }
  },
  {
    title: "File Uploading to AWS S3",
    desc: "A coding lab configuring AWS SDK v3 to store uploaded user image files directly inside Amazon S3 buckets.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=aws-s3-upload",
    solutionCode: "import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\nconst s3 = new S3Client({ region: 'us-east-1' });",
    hints: ["Never put AWS credential keys inside client-side JS bundles.", "Generate presigned URLs for client-side direct uploads."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 45 }
  },
  {
    title: "Webpack vs Vite Bundler comparison",
    desc: "An article reviewing Webpack compilation vs Vite ES modules development server efficiency.",
    type: "article" as const,
    contentType: "secondary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["Vite uses native ESM in development.", "Webpack builds an aggregated dependency graph on start."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 25 }
  },
  {
    title: "Performance Audits using Google Lighthouse",
    desc: "Learn to audit page loads, analyze Core Web Vitals (LCP, FID, CLS), and optimize image size.",
    type: "video" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=lighthouse-audits",
    solutionCode: null,
    hints: ["Use modern image formats (WebP/AVIF).", "Defer non-critical third-party scripts."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 20 }
  },
  {
    title: "Secure Headers Configuration",
    desc: "An article explaining secure headers: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options.",
    type: "article" as const,
    contentType: "secondary" as const,
    videoLink: null,
    solutionCode: null,
    hints: ["CSP prevents XSS script executions.", "Helmet middleware handles headers automatically in Node."],
    metadata: { difficulty: "intermediate", estimatedTimeMinutes: 30 }
  },
  {
    title: "PostgreSQL Cursor Pagination Implementation",
    desc: "Write cursor-based pagination queries using unique ID markers and comparison filters to query logs.",
    type: "coding lab" as const,
    contentType: "primary" as const,
    videoLink: "https://youtube.com/watch?v=cursor-pagination",
    solutionCode: "SELECT * FROM logs\nWHERE id > $1\nORDER BY id ASC\nLIMIT $2;",
    hints: ["Cursor pagination is O(1) for offset paging.", "Requires sorting columns to have strict uniqueness."],
    metadata: { difficulty: "advanced", estimatedTimeMinutes: 50 }
  },
  {
    title: "Custom React State Management Library",
    desc: "An assignment building a custom state store dispatcher following subscription patterns.",
    type: "assignment" as const,
    contentType: "primary" as const,
    videoLink: null,
    solutionCode: "export function createStore(initialState) {\n  let state = initialState;\n  const listeners = new Set();\n  return {\n    getState: () => state,\n    subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); }\n  };\n}",
    hints: ["Use Set object to hold listener functions.", "Trigger state render on listener dispatch callbacks."],
    metadata: { difficulty: "advanced", estimatedTimeMinutes: 90 }
  }
];

async function seed() {
  const repo = new ContentLibraryRepository();

  console.log(`Clearing content library before seeding...`);
  console.log(`Seeding 50 dummy Full Stack items into content library...`);
  try {
    await repo.createMany(fullStackTopics);
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding content library:", error);
    process.exit(1);
  }
}

seed();
