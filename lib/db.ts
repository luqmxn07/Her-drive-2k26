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
    // 1. Waitlist Entries Table
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
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Ensure notes column exists in case waitlist_entries was previously created without it
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='waitlist_entries' AND column_name='notes'
        ) THEN
          ALTER TABLE waitlist_entries ADD COLUMN notes TEXT;
        END IF;
      END $$;
    `;

    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_entries_email_lower 
      ON waitlist_entries (LOWER(email));
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_waitlist_entries_created_at 
      ON waitlist_entries (created_at DESC);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_waitlist_entries_status 
      ON waitlist_entries (status);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_waitlist_entries_interest_type 
      ON waitlist_entries (interest_type);
    `;

    // 2. Admin Users Table (Source of truth for admin credentials & RBAC)
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(60) NOT NULL,
        last_name VARCHAR(60) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'VIEWER',
        is_active BOOLEAN NOT NULL DEFAULT true,
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_email_lower 
      ON admin_users (LOWER(email));
    `;

    // 3. Admin Audit Logs Table (Immutable security & administrative compliance stream)
    await sql`
      CREATE TABLE IF NOT EXISTS admin_audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_id UUID,
        admin_email VARCHAR(255) NOT NULL,
        action VARCHAR(64) NOT NULL,
        resource_type VARCHAR(64) NOT NULL,
        resource_id VARCHAR(64),
        details JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
      ON admin_audit_logs (created_at DESC);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action 
      ON admin_audit_logs (action);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_email 
      ON admin_audit_logs (admin_email);
    `;

    isInitialized = true;
    console.log("[Neon DB] Waitlist, Admin Users, and Audit Log tables verified/initialized.");
  } catch (error) {
    console.error("[Neon DB] Initialization error:", error);
  }
}
