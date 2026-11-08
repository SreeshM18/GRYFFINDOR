-- ==============================================================================
-- SREESH × MRITHULA — Production PostgreSQL Schema & Supabase Configuration
-- Multi-Disciplinary Digital Studio & Dual-Identity Platform
-- ==============================================================================

-- 1. PROFILES TABLE (Independent credentials & public metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL, -- 'sreesh' or 'mrithula'
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  resume_url TEXT,
  email TEXT NOT NULL,
  github_url TEXT,
  linkedin_url TEXT,
  accent_color TEXT DEFAULT '#8B465A',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE (Solo Sreesh, Solo Mrithula, or Collaborative)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ai', 'fullstack', 'creative-ui', 'systems', 'research')),
  author_id TEXT NOT NULL CHECK (author_id IN ('sreesh', 'mrithula', 'collaborative')),
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'ongoing', 'archived')),
  year INT NOT NULL,
  metrics TEXT,
  github_url TEXT,
  live_url TEXT,
  cover_image TEXT,
  architecture_diagram TEXT,
  challenge TEXT,
  solution TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  key_features TEXT[] DEFAULT '{}',
  results TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ACHIEVEMENTS & CREDENTIALS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL CHECK (recipient IN ('sreesh', 'mrithula', 'both')),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hackathon', 'certification', 'award', 'internship')),
  description TEXT NOT NULL,
  certificate_url TEXT,
  verification_url TEXT,
  downloadable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TIMELINE MILESTONES TABLE
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL CHECK (recipient IN ('sreesh', 'mrithula', 'both')),
  year TEXT NOT NULL,
  organization TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('education', 'project', 'hackathon', 'internship', 'milestone')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WORKSPACE KANBAN TASKS TABLE (Private to Sreesh & Mrithula)
CREATE TABLE IF NOT EXISTS public.workspace_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT NOT NULL CHECK (assigned_to IN ('sreesh', 'mrithula', 'unassigned')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WORKSPACE NOTES (Markdown Knowledge Base)
CREATE TABLE IF NOT EXISTS public.workspace_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  author_slug TEXT NOT NULL CHECK (author_slug IN ('sreesh', 'mrithula')),
  is_shared BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONTACT INQUIRIES (Private Encrypted Studio Inbox)
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('collaboration', 'hire_sreesh', 'hire_mrithula', 'general')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS FOR SHOWCASE PORTIONS
CREATE POLICY "Public Profiles Read" ON public.profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Public Projects Read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Achievements Read" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public Timeline Read" ON public.timeline_events FOR SELECT USING (true);

-- PUBLIC WRITE FOR INQUIRIES (Rate-limited via Edge / Frontend captcha)
CREATE POLICY "Public Inquiry Insertion" ON public.contact_inquiries FOR INSERT WITH CHECK (true);

-- AUTHENTICATED STUDIO MEMBERS ONLY (SREESH & MRITHULA)
CREATE POLICY "Members Manage Profiles" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Members Manage Projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Members Manage Achievements" ON public.achievements FOR ALL TO authenticated USING (true);
CREATE POLICY "Members Manage Tasks" ON public.workspace_tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Members Manage Notes" ON public.workspace_notes FOR ALL TO authenticated USING (true);
CREATE POLICY "Members Read Inquiries" ON public.contact_inquiries FOR ALL TO authenticated USING (true);

