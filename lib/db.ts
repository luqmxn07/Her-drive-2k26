import { neon } from "@neondatabase/serverless";

let isInitialized = false;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}

export async function initDb() {
  if (isInitialized) return;
  const sql = getDb();
  if (!sql) {
    console.warn("[Neon DB] DATABASE_URL environment variable is not defined.");
    return;
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(30),
        interest_type VARCHAR(20) NOT NULL DEFAULT 'passenger',
        status VARCHAR(20) NOT NULL DEFAULT 'waitlisted',
        consent BOOLEAN NOT NULL DEFAULT false,
        consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ip_hash VARCHAR(64),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_entries_email_lower 
      ON waitlist_entries (LOWER(email));
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_waitlist_entries_created_at 
      ON waitlist_entries (created_at DESC);
    `;

    isInitialized = true;
    console.log("[Neon DB] Tables and indexes verified/created successfully.");
  } catch (error) {
    console.error("[Neon DB] Initialization error:", error);
  }
}
