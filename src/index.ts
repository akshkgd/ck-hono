import { serve } from '@hono/node-server';
import 'dotenv/config';
import app from './app.js';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
