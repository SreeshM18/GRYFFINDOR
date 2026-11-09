-- ==============================================================================
-- 🦁 GRYFFINDOR OS — PRODUCTION SECURITY AUDIT TRAIL & LOGS
-- Immutable append-only audit trail for administrative, auth, and styling actions.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_resource TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'BLOCKED', 'WARNING')),
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (Sreesh & Mrithula) can view audit logs
CREATE POLICY "Audit Logs View Authenticated"
  ON public.security_audit_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated and Service Role can insert audit logs
CREATE POLICY "Audit Logs Insert Authenticated"
  ON public.security_audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Deny updates and deletes (Immutable audit trail)
CREATE POLICY "Audit Logs No Update"
  ON public.security_audit_logs
  FOR UPDATE
  USING (false);

CREATE POLICY "Audit Logs No Delete"
  ON public.security_audit_logs
  FOR DELETE
  USING (false);
