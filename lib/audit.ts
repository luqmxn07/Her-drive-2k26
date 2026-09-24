import { getDb, initDb } from "@/lib/db";

interface AuditLogParams {
  adminId?: string | null;
  adminEmail: string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  details?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Deep sanitization function to ensure NO passwords, secret tokens, or hashes are ever logged.
 */
function sanitizeAuditPayload(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeAuditPayload);

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (/password|secret|token|hash|cookie|authorization|auth/i.test(key)) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeAuditPayload(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export async function logAuditEvent({
  adminId = null,
  adminEmail,
  action,
  resourceType,
  resourceId = null,
  details = null,
  ipAddress = null,
  userAgent = null,
}: AuditLogParams): Promise<void> {
  const sql = getDb();
  if (!sql) {
    console.log(`[AUDIT EVENT] ${action} by ${adminEmail} on ${resourceType}${resourceId ? ` (${resourceId})` : ""}`);
    return;
  }

  try {
    await initDb();
    const cleanDetails = details ? JSON.stringify(sanitizeAuditPayload(details)) : null;

    await sql`
      INSERT INTO admin_audit_logs (
        admin_id,
        admin_email,
        action,
        resource_type,
        resource_id,
        details,
        ip_address,
        user_agent
      ) VALUES (
        ${adminId},
        ${adminEmail.toLowerCase().trim()},
        ${action},
        ${resourceType},
        ${resourceId},
        ${cleanDetails},
        ${ipAddress},
        ${userAgent}
      );
    `;
  } catch (err) {
    console.error("[Audit Logging Error]", err);
  }
}
