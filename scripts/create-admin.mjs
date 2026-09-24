#!/usr/bin/env node

/**
 * HERDRIVE — SECURE ADMIN ACCOUNT PROVISIONING SCRIPT
 * 
 * Usage:
 *   node scripts/create-admin.mjs <email> <password> <firstName> <lastName> [role]
 * 
 * Example:
 *   node scripts/create-admin.mjs admin@herdrive.com "SuperSecurePass123!" Priya Sharma SUPER_ADMIN
 * 
 * Roles: SUPER_ADMIN, ADMIN, VIEWER (Default: SUPER_ADMIN)
 */

import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

const args = process.argv.slice(2);

if (args.length < 4) {
  console.error(`
===================================================================
HERDRIVE Secure Admin Account Creation Tool
===================================================================
ERROR: Insufficient arguments provided.

Usage:
  node scripts/create-admin.mjs <email> <password> <firstName> <lastName> [role]

Parameters:
  email       : Valid admin operator email address
  password    : Strong password (min 8 characters)
  firstName   : Operator's first name
  lastName    : Operator's last name
  role        : SUPER_ADMIN | ADMIN | VIEWER (Default: SUPER_ADMIN)

Example:
  node scripts/create-admin.mjs admin@herdrive.com "PriyaSecurePass@2026" Priya Sharma SUPER_ADMIN
===================================================================
  `);
  process.exit(1);
}

const [emailRaw, password, firstNameRaw, lastNameRaw, roleRaw = "SUPER_ADMIN"] = args;
const email = emailRaw.trim().toLowerCase();
const firstName = firstNameRaw.trim();
const lastName = lastNameRaw.trim();
const role = roleRaw.trim().toUpperCase();

// 1. Validations
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error("ERROR: Invalid email address format.");
  process.exit(1);
}

if (!password || password.length < 8) {
  console.error("ERROR: Password must be at least 8 characters long.");
  process.exit(1);
}

const validRoles = ["SUPER_ADMIN", "ADMIN", "VIEWER"];
if (!validRoles.includes(role)) {
  console.error(`ERROR: Invalid role "${role}". Must be one of: ${validRoles.join(", ")}`);
  process.exit(1);
}

// 2. Database Connection
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("ERROR: DATABASE_URL environment variable is required to create admin accounts.");
  console.error("Provide it via: DATABASE_URL=\"postgresql://...\" node scripts/create-admin.mjs ...");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function main() {
  console.log(`[HERDRIVE Security] Provisioning administrative account for: ${email}`);
  console.log(`[HERDRIVE Security] Role: ${role}`);
  console.log("[HERDRIVE Security] Hashing password with bcrypt (Cost factor 12)...");

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  console.log("[HERDRIVE Security] Connecting to Neon PostgreSQL...");

  // Ensure tables exist
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

  // Upsert or insert
  const existing = await sql`
    SELECT id, email, role FROM admin_users WHERE LOWER(email) = ${email} LIMIT 1;
  `;

  if (existing.length > 0) {
    console.log(`[HERDRIVE Security] User already exists (ID: ${existing[0].id}). Updating password and role...`);
    const updated = await sql`
      UPDATE admin_users
      SET 
        password_hash = ${passwordHash},
        first_name = ${firstName},
        last_name = ${lastName},
        role = ${role},
        is_active = true,
        updated_at = NOW()
      WHERE id = ${existing[0].id}
      RETURNING id, email, role, created_at;
    `;

    await sql`
      INSERT INTO admin_audit_logs (
        admin_id, admin_email, action, resource_type, resource_id, details
      ) VALUES (
        ${updated[0].id}, ${email}, 'ADMIN_UPDATED_VIA_CLI', 'admin_users', ${updated[0].id},
        ${JSON.stringify({ role, actor: 'CLI_TOOL' })}
      );
    `;

    console.log("===================================================================");
    console.log("SUCCESS: Administrative account successfully updated.");
    console.log(`ID         : ${updated[0].id}`);
    console.log(`Email      : ${updated[0].email}`);
    console.log(`Role       : ${updated[0].role}`);
    console.log("===================================================================");
  } else {
    const created = await sql`
      INSERT INTO admin_users (
        email,
        password_hash,
        first_name,
        last_name,
        role,
        is_active
      ) VALUES (
        ${email},
        ${passwordHash},
        ${firstName},
        ${lastName},
        ${role},
        true
      )
      RETURNING id, email, role, created_at;
    `;

    await sql`
      INSERT INTO admin_audit_logs (
        admin_id, admin_email, action, resource_type, resource_id, details
      ) VALUES (
        ${created[0].id}, ${email}, 'ADMIN_CREATED_VIA_CLI', 'admin_users', ${created[0].id},
        ${JSON.stringify({ role, actor: 'CLI_TOOL' })}
      );
    `;

    console.log("===================================================================");
    console.log("SUCCESS: Administrative account successfully created in Neon PostgreSQL.");
    console.log(`ID         : ${created[0].id}`);
    console.log(`Email      : ${created[0].email}`);
    console.log(`Role       : ${created[0].role}`);
    console.log("===================================================================");
  }
}

main().catch((err) => {
  console.error("FATAL ERROR creating admin account:", err);
  process.exit(1);
});
