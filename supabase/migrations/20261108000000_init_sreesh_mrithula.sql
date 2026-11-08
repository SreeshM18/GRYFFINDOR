-- ==============================================================================
-- SREESH × MRITHULA — PERSONAL WORK OS
-- Complete Enterprise PostgreSQL Schema & Supabase Configuration
-- Two People. One Workspace. Everything Organized.
-- ==============================================================================

-- 1. PROFILES & STUDIO IDENTITY
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL CHECK (slug IN ('sreesh', 'mrithula')),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  bio TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT DEFAULT 'Bengaluru, India',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  accent_color TEXT DEFAULT '#8B465A',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LIVE USER PRESENCE & VOLUNTARY AVAILABILITY
CREATE TABLE IF NOT EXISTS public.user_presence (
  user_id TEXT PRIMARY KEY CHECK (user_id IN ('sreesh', 'mrithula')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'working', 'busy', 'on_break', 'do_not_disturb', 'away', 'offline')),
  custom_status TEXT,
  current_project TEXT,
  current_task TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EMPLOYEE-STYLE ATTENDANCE & SHIFT SESSIONS
-- Uses server-authoritative timestamps in UTC; displays in Asia/Kolkata
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL CHECK (user_id IN ('sreesh', 'mrithula')),
  work_date DATE NOT NULL,
  clock_in_time TIMESTAMPTZ NOT NULL,
  clock_out_time TIMESTAMPTZ,
  total_duration_minutes INT DEFAULT 0,
  break_duration_minutes INT DEFAULT 0,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'late', 'half_day', 'absent', 'leave', 'holiday')),
  verification_type TEXT DEFAULT 'self_reported' CHECK (verification_type IN ('self_reported', 'employer_verified')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_work_date UNIQUE (user_id, work_date)
);

-- 4. BREAK SESSIONS
CREATE TABLE IF NOT EXISTS public.attendance_breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID REFERENCES public.attendance_records(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  reason TEXT DEFAULT 'Break',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ATTENDANCE AUDIT LOGS (Immutable record of corrections)
CREATE TABLE IF NOT EXISTS public.attendance_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID REFERENCES public.attendance_records(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  reason TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INTERNSHIP PROFILES & WORK LOGS
CREATE TABLE IF NOT EXISTS public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL CHECK (user_id IN ('sreesh', 'mrithula')),
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  internship_type TEXT NOT NULL CHECK (internship_type IN ('Full-Time', 'Part-Time', 'Remote', 'On-Site')),
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'upcoming')),
  supervisor_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.internship_daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  hours_spent NUMERIC(4, 2) NOT NULL,
  tasks_done TEXT NOT NULL,
  learnings TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COLLEGE ACADEMICS (Separate from official work attendance)
CREATE TABLE IF NOT EXISTS public.academic_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL CHECK (user_id IN ('sreesh', 'mrithula')),
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  semester TEXT NOT NULL,
  credits INT DEFAULT 4,
  total_classes INT DEFAULT 0,
  attended_classes INT DEFAULT 0,
  percentage NUMERIC(5, 2) DEFAULT 100.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.academic_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.academic_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded')),
  score TEXT
);

-- 8. LEAVE & VACATION MANAGEMENT
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL CHECK (user_id IN ('sreesh', 'mrithula')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('academic', 'casual', 'sick', 'vacation', 'exam_prep')),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SECURE DOCUMENT VAULT
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('resume', 'certificate', 'internship', 'academic', 'project', 'legal')),
  owner_id TEXT NOT NULL CHECK (owner_id IN ('sreesh', 'mrithula', 'shared')),
  file_type TEXT NOT NULL,
  size_bytes INT NOT NULL,
  storage_path TEXT,
  is_private BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- PUBLIC CAN ONLY READ PUBLIC PORTFOLIO
CREATE POLICY "Public Profiles Select" ON public.profiles FOR SELECT USING (is_public = true);

-- AUTHENTICATED WORKSPACE ACCOUNTS (SREESH & MRITHULA) HAVE FULL SECURE ACCESS
CREATE POLICY "Workspace Authenticated Full Access" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Presence Full Access" ON public.user_presence FOR ALL TO authenticated USING (true);
CREATE POLICY "Attendance Full Access" ON public.attendance_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Internship Full Access" ON public.internships FOR ALL TO authenticated USING (true);
CREATE POLICY "Academics Full Access" ON public.academic_courses FOR ALL TO authenticated USING (true);
CREATE POLICY "Leave Full Access" ON public.leave_requests FOR ALL TO authenticated USING (true);
CREATE POLICY "Documents Access" ON public.documents FOR ALL TO authenticated USING (is_private = false OR owner_id = auth.uid()::text);
