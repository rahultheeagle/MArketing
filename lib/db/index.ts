import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Fallback for development without database
const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/campaignpulse';

let client: any;
let db: any;

try {
  client = postgres(connectionString);
  db = drizzle(client, { schema });
} catch (error) {
  console.warn('Database connection failed, using mock data');
  // Mock database for development
  db = {
    select: () => ({ from: () => ({ orderBy: () => [] }) }),
    insert: () => ({ values: () => ({ returning: () => [{ id: 1 }] }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [{ id: 1 }] }) }) })
  };
}

export { db };
export * from './schema';