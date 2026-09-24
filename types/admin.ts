export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER';

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminJWTPayload {
  sub: string; // user id
  email: string;
  role: AdminRole;
  first_name: string;
  last_name: string;
  jti?: string;
  iat?: number;
  exp?: number;
}

export type WaitlistStatus = 'waitlisted' | 'contacted' | 'converted' | 'archived';

export interface AdminWaitlistEntry {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  interest_type: 'passenger' | 'driver' | 'both';
  status: WaitlistStatus;
  consent: boolean;
  consent_timestamp: string;
  ip_hash: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string | null;
  admin_email: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AdminDashboardStats {
  total: number;
  passengers: number;
  drivers: number;
  both: number;
  waitlisted: number;
  contacted: number;
  converted: number;
  archived: number;
  last24Hours: number;
  last7Days: number;
  trend: Array<{ date: string; count: number }>;
}
