import {
  UserId,
  UserPresence,
  AttendanceRecord,
  InternshipRecord,
  AcademicCourse,
  LeaveRequest,
  DocumentItem,
  MeetingItem,
  ChatMessage,
  NotificationItem,
  HabitItem,
  FocusSession,
  IdeaItem,
  ADRRecord,
  FinanceItem,
  JournalEntry,
  JobApplication,
  ClientProject,
  DeviceSession,
  FiveStatusModel,
} from '../types/workOs';

class WorkOsStorage {
  private STORAGE_KEY_PREFIX = 'sm_work_os_';

  // Get current session user
  public getCurrentUser(): { id: UserId; name: string; email: string; role: string } {
    const raw = localStorage.getItem('sm_auth_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // Fallback
      }
    }
    return {
      id: 'sreesh',
      name: 'Sreesh M',
      email: 'sreesh716@gmail.com',
      role: 'Systems Architect & Co-Founder',
    };
  }

  // --- ATTENDANCE & WORKING HOURS ---
  public getAttendanceRecords(userId?: UserId): AttendanceRecord[] {
    const key = `${this.STORAGE_KEY_PREFIX}attendance`;
    const raw = localStorage.getItem(key);
    let records: AttendanceRecord[] = raw ? JSON.parse(raw) : [];

    if (records.length === 0) {
      // Seed realistic initial records
      records = [
        {
          id: 'att-seed-1',
          userId: 'sreesh',
          date: '2026-11-07',
          clockInTime: '2026-11-07T09:05:00.000Z',
          clockOutTime: '2026-11-07T17:45:00.000Z',
          totalDurationMinutes: 520,
          breakDurationMinutes: 45,
          breaks: [{ start: '2026-11-07T13:00:00.000Z', end: '2026-11-07T13:45:00.000Z', reason: 'Lunch' }],
          status: 'present',
          verificationType: 'self_reported',
          notes: 'Built Antigravity graph traversal benchmarks.',
        },
        {
          id: 'att-seed-2',
          userId: 'mrithula',
          date: '2026-11-07',
          clockInTime: '2026-11-07T09:15:00.000Z',
          clockOutTime: '2026-11-07T17:50:00.000Z',
          totalDurationMinutes: 515,
          breakDurationMinutes: 45,
          breaks: [{ start: '2026-11-07T13:10:00.000Z', end: '2026-11-07T13:55:00.000Z', reason: 'Lunch' }],
          status: 'present',
          verificationType: 'self_reported',
          notes: 'Figma token architecture synchronization.',
        },
      ];
      localStorage.setItem(key, JSON.stringify(records));
    }

    if (userId) {
      return records.filter((r) => r.userId === userId);
    }
    return records;
  }

  public getActiveClockIn(userId: UserId): AttendanceRecord | null {
    const today = new Date().toISOString().split('T')[0];
    const records = this.getAttendanceRecords(userId);
    return records.find((r) => r.userId === userId && r.date === today && !r.clockOutTime) || null;
  }

  public clockIn(userId: UserId, notes?: string): AttendanceRecord {
    const records = this.getAttendanceRecords();
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Check if already clocked in today
    const existing = records.find((r) => r.userId === userId && r.date === today && !r.clockOutTime);
    if (existing) return existing;

    // Detect late check-in (after 9:30 AM configured time)
    const hours = now.getHours();
    const mins = now.getMinutes();
    const isLate = hours > 9 || (hours === 9 && mins > 30);

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId,
      date: today,
      clockInTime: now.toISOString(),
      totalDurationMinutes: 0,
      breakDurationMinutes: 0,
      breaks: [],
      status: isLate ? 'late' : 'present',
      verificationType: 'self_reported',
      notes: notes || '',
      auditTrail: [
        {
          action: 'CLOCK_IN',
          timestamp: now.toISOString(),
          performedBy: userId,
        },
      ],
    };

    records.unshift(newRecord);
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}attendance`, JSON.stringify(records));
    this.updateUserPresence(userId, { status: 'working' });
    return newRecord;
  }

  public clockOut(userId: UserId): AttendanceRecord | null {
    const records = this.getAttendanceRecords();
    const today = new Date().toISOString().split('T')[0];
    const recordIndex = records.findIndex((r) => r.userId === userId && r.date === today && !r.clockOutTime);

    if (recordIndex === -1) return null;

    const record = records[recordIndex];
    const clockOut = new Date();
    const clockIn = new Date(record.clockInTime);
    const diffMinutes = Math.max(0, Math.floor((clockOut.getTime() - clockIn.getTime()) / 60000));

    record.clockOutTime = clockOut.toISOString();
    record.totalDurationMinutes = diffMinutes - record.breakDurationMinutes;
    record.auditTrail = record.auditTrail || [];
    record.auditTrail.push({
      action: 'CLOCK_OUT',
      timestamp: clockOut.toISOString(),
      performedBy: userId,
    });

    records[recordIndex] = record;
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}attendance`, JSON.stringify(records));
    this.updateUserPresence(userId, { status: 'offline' });
    return record;
  }

  public startBreak(userId: UserId, reason = 'Break'): boolean {
    const records = this.getAttendanceRecords();
    const today = new Date().toISOString().split('T')[0];
    const record = records.find((r) => r.userId === userId && r.date === today && !r.clockOutTime);
    if (!record) return false;

    // Check if already in active break
    const activeBreak = record.breaks.find((b) => !b.end);
    if (activeBreak) return false;

    record.breaks.push({
      start: new Date().toISOString(),
      reason,
    });

    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}attendance`, JSON.stringify(records));
    this.updateUserPresence(userId, { status: 'on_break', customStatus: reason });
    return true;
  }

  public endBreak(userId: UserId): boolean {
    const records = this.getAttendanceRecords();
    const today = new Date().toISOString().split('T')[0];
    const record = records.find((r) => r.userId === userId && r.date === today && !r.clockOutTime);
    if (!record) return false;

    const activeBreak = record.breaks.find((b) => !b.end);
    if (!activeBreak) return false;

    const now = new Date();
    activeBreak.end = now.toISOString();

    const start = new Date(activeBreak.start);
    const breakMins = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 60000));
    record.breakDurationMinutes += breakMins;

    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}attendance`, JSON.stringify(records));
    this.updateUserPresence(userId, { status: 'working', customStatus: undefined });
    return true;
  }

  // --- REAL-TIME AVAILABILITY PRESENCE ---
  public getUserPresence(userId: UserId): UserPresence {
    const key = `${this.STORAGE_KEY_PREFIX}presence_${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // Fallback
      }
    }
    return {
      userId,
      status: userId === 'sreesh' ? 'working' : 'available',
      customStatus: userId === 'sreesh' ? 'Building Personal Work OS' : 'Reviewing design tokens',
      currentProject: userId === 'sreesh' ? 'SREESH × MRITHULA' : 'Atelier Design System',
      currentTask: userId === 'sreesh' ? 'Architecting Work OS Modules' : 'Component hierarchy audit',
      updatedAt: 'Just now',
    };
  }

  public updateUserPresence(userId: UserId, updates: Partial<UserPresence>): UserPresence {
    const current = this.getUserPresence(userId);
    const merged: UserPresence = {
      ...current,
      ...updates,
      updatedAt: 'Just now',
    };
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}presence_${userId}`, JSON.stringify(merged));
    return merged;
  }

  // --- INTERNSHIPS ---
  public getInternships(userId?: UserId): InternshipRecord[] {
    const key = `${this.STORAGE_KEY_PREFIX}internships`;
    const raw = localStorage.getItem(key);
    let list: InternshipRecord[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      list = [
        {
          id: 'intern-1',
          userId: 'sreesh',
          companyName: 'Cloud & AI Engineering Systems',
          roleTitle: 'Software Engineering Intern',
          internshipType: 'Full-Time',
          location: 'Bengaluru / Hybrid',
          startDate: '2025-06-01',
          endDate: '2025-11-30',
          status: 'active',
          supervisorName: 'Technical Director',
          dailyLogs: [
            {
              id: 'log-1',
              date: '2026-11-06',
              hoursSpent: 7.5,
              tasksDone: 'Implemented vector search indexing and SQLite connection pools.',
              learnings: 'Observed 40% memory optimization using deterministic connection pooling.',
            },
          ],
          weeklyReports: [
            {
              weekNumber: 22,
              summary: 'Completed end-to-end multi-agent orchestration pipeline testing.',
              deliverables: ['PR #142 Merged', 'Benchmarking Report (99.8% SLA)'],
            },
          ],
        },
        {
          id: 'intern-2',
          userId: 'mrithula',
          companyName: 'Studio Atelier Design Lab',
          roleTitle: 'Product Design Intern',
          internshipType: 'Remote',
          location: 'Bengaluru / Remote',
          startDate: '2025-07-01',
          endDate: '2025-12-15',
          status: 'active',
          supervisorName: 'Design Systems Lead',
          dailyLogs: [
            {
              id: 'log-2',
              date: '2026-11-06',
              hoursSpent: 7.0,
              tasksDone: 'Refined dark/light semantic color tokens and WCAG AA contrast rules.',
              learnings: 'Mapped Figma variable collections directly to Style-Dictionary outputs.',
            },
          ],
          weeklyReports: [
            {
              weekNumber: 18,
              summary: 'Released Atelier Design Token v1.4 with zero accessibility regressions.',
              deliverables: ['Design Spec v1.4', 'Storybook Theme Sync'],
            },
          ],
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    if (userId) return list.filter((i) => i.userId === userId);
    return list;
  }

  // --- ACADEMICS (Separate from office attendance) ---
  public getAcademicCourses(userId?: UserId): AcademicCourse[] {
    const key = `${this.STORAGE_KEY_PREFIX}academics`;
    const raw = localStorage.getItem(key);
    let list: AcademicCourse[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      list = [
        {
          id: 'acad-1',
          userId: 'sreesh',
          code: 'CS601',
          title: 'Distributed Systems & Cloud Computing',
          semester: 'Semester 7',
          credits: 4,
          attendanceStats: {
            totalClasses: 36,
            attendedClasses: 33,
            percentage: 91.6,
          },
          assignments: [
            { id: 'asg-1', title: 'Raft Consensus Protocol Implementation', dueDate: '2026-11-18', status: 'submitted', score: '98/100' },
            { id: 'asg-2', title: 'MapReduce Distributed WordCount Benchmark', dueDate: '2026-11-28', status: 'pending' },
          ],
          exams: [
            { id: 'ex-1', title: 'Distributed Systems Midterm', date: '2026-12-04' },
          ],
        },
        {
          id: 'acad-2',
          userId: 'sreesh',
          code: 'CS604',
          title: 'Machine Learning & Neural Architectures',
          semester: 'Semester 7',
          credits: 4,
          attendanceStats: {
            totalClasses: 34,
            attendedClasses: 31,
            percentage: 91.1,
          },
          assignments: [
            { id: 'asg-3', title: 'Transformer Attention Mechanism from Scratch', dueDate: '2026-11-20', status: 'pending' },
          ],
          exams: [
            { id: 'ex-2', title: 'Neural Networks End-Semester', date: '2026-12-10' },
          ],
        },
        {
          id: 'acad-3',
          userId: 'mrithula',
          code: 'DS502',
          title: 'Human-Computer Interaction & Ergonomics',
          semester: 'Semester 7',
          credits: 4,
          attendanceStats: {
            totalClasses: 35,
            attendedClasses: 33,
            percentage: 94.2,
          },
          assignments: [
            { id: 'asg-4', title: 'Heuristic Usability Evaluation Report', dueDate: '2026-11-19', status: 'submitted', score: '95/100' },
          ],
          exams: [
            { id: 'ex-3', title: 'HCI Comprehensive Exam', date: '2026-12-05' },
          ],
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    if (userId) return list.filter((c) => c.userId === userId);
    return list;
  }

  // --- LEAVE & VACATION MANAGEMENT ---
  public getLeaveRequests(userId?: UserId): LeaveRequest[] {
    const key = `${this.STORAGE_KEY_PREFIX}leave`;
    const raw = localStorage.getItem(key);
    let list: LeaveRequest[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      list = [
        {
          id: 'leave-1',
          userId: 'sreesh',
          startDate: '2026-12-03',
          endDate: '2026-12-05',
          leaveType: 'exam_prep',
          reason: 'Distributed Systems semester midterm examinations.',
          status: 'approved',
          createdAt: '2026-11-01',
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    if (userId) return list.filter((l) => l.userId === userId);
    return list;
  }

  public submitLeaveRequest(req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>): LeaveRequest {
    const list = this.getLeaveRequests();
    const newReq: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      status: 'approved', // For a 2-person studio, auto-approved without bureaucratic friction
      createdAt: new Date().toISOString().split('T')[0],
    };
    list.unshift(newReq);
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}leave`, JSON.stringify(list));
    return newReq;
  }

  // --- DOCUMENT VAULT ---
  public getDocuments(userId?: UserId): DocumentItem[] {
    const key = `${this.STORAGE_KEY_PREFIX}documents`;
    const raw = localStorage.getItem(key);
    let list: DocumentItem[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      list = [
        {
          id: 'doc-1',
          title: 'Sreesh_M_Resume.pdf',
          category: 'resume',
          ownerId: 'sreesh',
          fileType: 'PDF',
          sizeBytes: 124500,
          uploadedAt: '2026-11-08',
          isPrivate: false,
        },
        {
          id: 'doc-2',
          title: 'Mrithula_M_Resume.pdf',
          category: 'resume',
          ownerId: 'mrithula',
          fileType: 'PDF',
          sizeBytes: 118200,
          uploadedAt: '2026-11-08',
          isPrivate: false,
        },
        {
          id: 'doc-3',
          title: 'Antigravity_Neural_OS_Architecture_Whitepaper.pdf',
          category: 'project',
          ownerId: 'shared',
          fileType: 'PDF',
          sizeBytes: 345000,
          uploadedAt: '2026-11-05',
          isPrivate: false,
        },
        {
          id: 'doc-4',
          title: 'Atelier_Design_Tokens_Specification.pdf',
          category: 'project',
          ownerId: 'mrithula',
          fileType: 'PDF',
          sizeBytes: 215000,
          uploadedAt: '2026-11-06',
          isPrivate: false,
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    if (userId) return list.filter((d) => d.ownerId === userId || d.ownerId === 'shared');
    return list;
  }

  // --- HABITS & DISCIPLINE ---
  public getHabits(userId?: UserId): HabitItem[] {
    const key = `${this.STORAGE_KEY_PREFIX}habits`;
    const raw = localStorage.getItem(key);
    let list: HabitItem[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      list = [
        {
          id: 'habit-1',
          userId: 'sreesh',
          title: 'LeetCode / Algorithmic Problem Solving',
          category: 'coding',
          frequency: 'daily',
          currentStreak: 18,
          bestStreak: 45,
          completedDates: [today],
          targetPerWeek: 7,
          createdAt: '2026-10-01',
        },
        {
          id: 'habit-2',
          userId: 'sreesh',
          title: 'Distributed Systems & Database Research (1hr)',
          category: 'system_design',
          frequency: 'weekdays',
          currentStreak: 12,
          bestStreak: 24,
          completedDates: [today],
          targetPerWeek: 5,
          createdAt: '2026-10-05',
        },
        {
          id: 'habit-3',
          userId: 'mrithula',
          title: 'Daily UI Micro-Interaction & Figma Prototype',
          category: 'studio',
          frequency: 'daily',
          currentStreak: 21,
          bestStreak: 30,
          completedDates: [today],
          targetPerWeek: 7,
          createdAt: '2026-10-01',
        },
        {
          id: 'habit-4',
          userId: 'mrithula',
          title: 'Design Critique & Creative Direction Study',
          category: 'learning',
          frequency: 'weekdays',
          currentStreak: 14,
          bestStreak: 28,
          completedDates: [today],
          targetPerWeek: 5,
          createdAt: '2026-10-08',
        },
        {
          id: 'habit-5',
          userId: 'both',
          title: 'Co-Founder Daily Standup & Roadmap Review',
          category: 'studio',
          frequency: 'weekdays',
          currentStreak: 32,
          bestStreak: 32,
          completedDates: [today],
          targetPerWeek: 5,
          createdAt: '2026-09-15',
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    if (userId) return list.filter((h) => h.userId === userId || h.userId === 'both');
    return list;
  }

  public toggleHabit(habitId: string, dateStr: string): HabitItem | null {
    const habits = this.getHabits();
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return null;

    const exists = habit.completedDates.includes(dateStr);
    if (exists) {
      habit.completedDates = habit.completedDates.filter((d) => d !== dateStr);
      habit.currentStreak = Math.max(0, habit.currentStreak - 1);
    } else {
      habit.completedDates.push(dateStr);
      habit.currentStreak += 1;
      if (habit.currentStreak > habit.bestStreak) {
        habit.bestStreak = habit.currentStreak;
      }
    }

    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}habits`, JSON.stringify(habits));
    return habit;
  }

  public createHabit(habit: Omit<HabitItem, 'id' | 'createdAt' | 'currentStreak' | 'bestStreak' | 'completedDates'>): HabitItem {
    const habits = this.getHabits();
    const newHabit: HabitItem = {
      ...habit,
      id: `habit-${Date.now()}`,
      currentStreak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    habits.push(newHabit);
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}habits`, JSON.stringify(habits));
    return newHabit;
  }

  // --- FOCUS & DEEP WORK SESSIONS ---
  public getFocusSessions(userId?: UserId): FocusSession[] {
    const key = `${this.STORAGE_KEY_PREFIX}focus`;
    const raw = localStorage.getItem(key);
    let list: FocusSession[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      list = [
        {
          id: 'foc-1',
          userId: 'sreesh',
          mode: 'deep_work',
          durationMinutes: 50,
          completedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          taskTitle: 'Web Audio Ambient Soundscape Generator',
          notes: 'Finished white/pink/binaural filter graphs.',
        },
        {
          id: 'foc-2',
          userId: 'mrithula',
          mode: 'pomodoro',
          durationMinutes: 25,
          completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          taskTitle: 'Editorial Layout Grid Refinement',
          notes: 'Fine-tuned asymmetric typographic margins.',
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    if (userId) return list.filter((f) => f.userId === userId);
    return list;
  }

  public logFocusSession(session: Omit<FocusSession, 'id' | 'completedAt'>): FocusSession {
    const list = this.getFocusSessions();
    const newSession: FocusSession = {
      ...session,
      id: `foc-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    list.unshift(newSession);
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}focus`, JSON.stringify(list));
    return newSession;
  }

  // --- IDEAS VAULT & ADRs ---
  public getIdeas(): IdeaItem[] {
    const key = `${this.STORAGE_KEY_PREFIX}ideas`;
    const raw = localStorage.getItem(key);
    let list: IdeaItem[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      list = [
        {
          id: 'idea-1',
          userId: 'sreesh',
          title: 'Zero-Copy SharedArrayBuffer Audio Visualizer',
          description: 'Render 60fps real-time frequency FFT spectra directly into WebGL canvas without thread blocking.',
          category: 'experiment',
          impact: 'high',
          effort: 'medium',
          status: 'inbox',
          createdAt: '2026-11-06',
        },
        {
          id: 'idea-2',
          userId: 'mrithula',
          title: 'Generative Editorial Typography Engine',
          description: 'A dynamic responsive typographic system that subtly alters glyph kerning and ligatures based on viewport velocity.',
          category: 'product',
          impact: 'high',
          effort: 'high',
          status: 'inbox',
          createdAt: '2026-11-07',
        },
        {
          id: 'idea-3',
          userId: 'sreesh',
          title: 'Supabase Vector Memory Bridge for Personal OS',
          description: 'Store embeddings of our academic notes, daily diaries, and whitepapers to enable semantic Q&A.',
          category: 'research',
          impact: 'high',
          effort: 'medium',
          status: 'inbox',
          createdAt: '2026-11-08',
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    return list;
  }

  public createIdea(idea: Omit<IdeaItem, 'id' | 'createdAt' | 'status'>): IdeaItem {
    const list = this.getIdeas();
    const newIdea: IdeaItem = {
      ...idea,
      id: `idea-${Date.now()}`,
      status: 'inbox',
      createdAt: new Date().toISOString().split('T')[0],
    };
    list.unshift(newIdea);
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}ideas`, JSON.stringify(list));
    return newIdea;
  }

  public getADRs(): ADRRecord[] {
    const key = `${this.STORAGE_KEY_PREFIX}adrs`;
    const raw = localStorage.getItem(key);
    let list: ADRRecord[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      list = [
        {
          id: 'ADR-001',
          title: 'Dual Architectural Layering (Public Editorial + Private Work OS)',
          status: 'accepted',
          authorId: 'sreesh',
          coAuthorId: 'mrithula',
          deciders: 'Sreesh M & Mrithula M',
          date: '2026-11-08',
          context: 'We required a unified identity that functions both as an award-winning creative studio portfolio and an internal enterprise-grade management tool for attendance, academics, internships, and tasks.',
          decision: 'Build two interconnected sub-systems in a single Vite/React/TypeScript architecture: Public routes (`/`, `/sreesh`, `/mrithula`, `/projects`) and authenticated private routes (`/app/*`).',
          consequences: 'Eliminates friction between external client showcases and internal day-to-day operations while keeping private documents and timesheets completely secure.',
        },
        {
          id: 'ADR-002',
          title: 'Zero Involuntary Surveillance & Self-Reported Attendance Honor Code',
          status: 'accepted',
          authorId: 'mrithula',
          coAuthorId: 'sreesh',
          deciders: 'Sreesh M & Mrithula M',
          date: '2026-11-08',
          context: 'Standard corporate attendance software often incorporates invasive keystroke logging, involuntary webcam captures, or background tracking.',
          decision: 'Enforce explicit voluntary self-reporting. Time tracking is activated solely by co-founder initiation, with clear differentiation between self-reported and employer-verified logs.',
          consequences: 'Builds a culture of mutual trust, psychological safety, and absolute agency over personal data.',
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    return list;
  }

  public createADR(adr: Omit<ADRRecord, 'id' | 'date'>): ADRRecord {
    const list = this.getADRs();
    const nextNum = list.length + 1;
    const newADR: ADRRecord = {
      ...adr,
      id: `ADR-${String(nextNum).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    };
    list.unshift(newADR);
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}adrs`, JSON.stringify(list));
    return newADR;
  }

  // --- STUDIO FINANCE & SUBSCRIPTIONS ---
  public getFinances(): FinanceItem[] {
    const key = `${this.STORAGE_KEY_PREFIX}finances`;
    const raw = localStorage.getItem(key);
    let list: FinanceItem[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      list = [
        {
          id: 'fin-1',
          name: 'sreeshmrithula.com & Domains',
          category: 'domain',
          amount: 1499,
          currency: 'INR',
          billingCycle: 'yearly',
          nextBillingDate: '2027-11-01',
          paidBy: 'sreesh',
          splitRatio: '50/50',
          url: 'https://porkbun.com',
        },
        {
          id: 'fin-2',
          name: 'Vercel Pro Team',
          category: 'infrastructure',
          amount: 20,
          currency: 'USD',
          billingCycle: 'monthly',
          nextBillingDate: '2026-12-01',
          paidBy: 'shared',
          splitRatio: '50/50',
          url: 'https://vercel.com',
        },
        {
          id: 'fin-3',
          name: 'Supabase Pro Platform',
          category: 'infrastructure',
          amount: 25,
          currency: 'USD',
          billingCycle: 'monthly',
          nextBillingDate: '2026-12-05',
          paidBy: 'shared',
          splitRatio: '50/50',
          url: 'https://supabase.com',
        },
        {
          id: 'fin-4',
          name: 'Figma Professional Workspace',
          category: 'software',
          amount: 15,
          currency: 'USD',
          billingCycle: 'monthly',
          nextBillingDate: '2026-12-10',
          paidBy: 'mrithula',
          splitRatio: '50/50',
          url: 'https://figma.com',
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    return list;
  }

  public createFinance(item: Omit<FinanceItem, 'id'>): FinanceItem {
    const list = this.getFinances();
    const newItem: FinanceItem = {
      ...item,
      id: `fin-${Date.now()}`,
    };
    list.push(newItem);
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}finances`, JSON.stringify(list));
    return newItem;
  }

  // --- MESSAGES & CO-FOUNDER QUICK SYNC ---
  public getChatMessages(): ChatMessage[] {
    const key = `${this.STORAGE_KEY_PREFIX}messages`;
    const raw = localStorage.getItem(key);
    let list: ChatMessage[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      list = [
        {
          id: 'msg-1',
          senderId: 'sreesh',
          content: 'Hey Mrithula! I just finished wiring the custom Web Audio synthesizer and attendance ledger. Check out the clock-in timers!',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          read: true,
        },
        {
          id: 'msg-2',
          senderId: 'mrithula',
          content: 'Awesome! I updated the editorial typography scale and responsive margin rules. Everything looks super crisp on mobile and 4K displays.',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          read: true,
        },
        {
          id: 'msg-3',
          senderId: 'sreesh',
          content: 'Our college semester 7 attendance stats and internship deliverables are now isolated in their own dedicated modules too.',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          read: true,
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    return list;
  }

  public sendChatMessage(senderId: UserId, content: string): ChatMessage {
    const list = this.getChatMessages();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    list.push(newMsg);
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}messages`, JSON.stringify(list));
    return newMsg;
  }

  // --- PRIVATE DAILY JOURNAL & REFLECTIONS ---
  public getJournalEntries(userId: UserId): JournalEntry[] {
    const key = `${this.STORAGE_KEY_PREFIX}journal_${userId}`;
    const raw = localStorage.getItem(key);
    let list: JournalEntry[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      list = [
        {
          id: `jr-${userId}-1`,
          userId,
          date: today,
          title: 'Architecting the Sovereign Personal Work OS',
          content: 'Reflecting on the architecture: separating our personal academic life from professional studio work creates immense clarity. Built the Web Audio procedural sound generator today for deep focus sprints.',
          mood: 'focused',
          energyLevel: 5,
          tags: ['architecture', 'flow-state', 'systems'],
          isPrivate: true,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }
    return list;
  }

  public createJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'isPrivate'>): JournalEntry {
    const list = this.getJournalEntries(entry.userId);
    const newEntry: JournalEntry = {
      ...entry,
      id: `jr-${Date.now()}`,
      isPrivate: true,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newEntry);
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}journal_${entry.userId}`, JSON.stringify(list));
    return newEntry;
  }

  // --- CAREER & PLACEMENT TRACKER ---
  public getJobApplications(userId?: UserId): JobApplication[] {
    const key = `${this.STORAGE_KEY_PREFIX}job_applications`;
    const raw = localStorage.getItem(key);
    let list: JobApplication[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      list = [
        {
          id: 'job-1',
          userId: 'sreesh',
          companyName: 'Google',
          roleTitle: 'Software Engineer - Systems & Cloud Infrastructure',
          location: 'Bengaluru / Hyderabad',
          workType: 'Hybrid',
          salaryRange: '₹32 - 45 LPA',
          stage: 'technical',
          appliedDate: '2026-10-15',
          interviewDate: '2026-11-14',
          jobUrl: 'https://careers.google.com',
          recruiterContact: 'talent-in@google.com',
          notes: 'Focus on distributed graph traversal, concurrency models, and low-latency API design.',
          rounds: [
            { roundName: 'Online Assessment (DSA)', date: '2026-10-22', status: 'passed', questionsAsked: 'Graph shortest path with state transitions; Sliding window segment tree.' },
            { roundName: 'Technical Round 1 (Data Structures)', date: '2026-11-04', status: 'passed', questionsAsked: 'Trie with frequency decay; In-memory LRU cache with concurrency locks.' },
            { roundName: 'Technical Round 2 (System Design)', date: '2026-11-14', status: 'scheduled' },
          ],
        },
        {
          id: 'job-2',
          userId: 'sreesh',
          companyName: 'Atlassian',
          roleTitle: 'Software Engineer - Core Platform',
          location: 'Bengaluru',
          workType: 'Remote',
          salaryRange: '₹28 - 36 LPA',
          stage: 'oa',
          appliedDate: '2026-10-28',
          jobUrl: 'https://atlassian.com/careers',
          rounds: [
            { roundName: 'Online Assessment', date: '2026-11-09', status: 'scheduled' },
          ],
        },
        {
          id: 'job-3',
          userId: 'mrithula',
          companyName: 'Linear / Remote Studio',
          roleTitle: 'Principal Product Designer & Frontend Engineer',
          location: 'San Francisco (Remote)',
          workType: 'Remote',
          salaryRange: '$90,000 - $120,000 USD',
          stage: 'technical',
          appliedDate: '2026-10-18',
          interviewDate: '2026-11-12',
          notes: 'Presenting the SREESH × MRITHULA editorial design token architecture and 60fps micro-interaction library.',
          rounds: [
            { roundName: 'Portfolio Review & Creative Direction', date: '2026-10-25', status: 'passed' },
            { roundName: 'Live Design Systems Pairing', date: '2026-11-12', status: 'scheduled' },
          ],
        },
        {
          id: 'job-4',
          userId: 'mrithula',
          companyName: 'CRED',
          roleTitle: 'Product Designer - High Craft Web & Mobile',
          location: 'Bengaluru',
          workType: 'On-Site',
          salaryRange: '₹26 - 34 LPA',
          stage: 'hr',
          appliedDate: '2026-10-10',
          interviewDate: '2026-11-10',
          rounds: [
            { roundName: 'Design Critique & Take-home', date: '2026-10-20', status: 'passed' },
            { roundName: 'Leadership & Craft Debrief', date: '2026-11-02', status: 'passed' },
            { roundName: 'Executive HR Round', date: '2026-11-10', status: 'scheduled' },
          ],
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    if (userId) return list.filter((j) => j.userId === userId);
    return list;
  }

  public createJobApplication(app: Omit<JobApplication, 'id'>): JobApplication {
    const list = this.getJobApplications();
    const newApp: JobApplication = {
      ...app,
      id: `job-${Date.now()}`,
    };
    list.unshift(newApp);
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}job_applications`, JSON.stringify(list));
    return newApp;
  }

  public updateJobApplicationStage(id: string, stage: JobApplication['stage']): void {
    const list = this.getJobApplications();
    const item = list.find((j) => j.id === id);
    if (item) {
      item.stage = stage;
      localStorage.setItem(`${this.STORAGE_KEY_PREFIX}job_applications`, JSON.stringify(list));
    }
  }

  // --- CLIENT & FREELANCE STUDIO HUB ---
  public getClientProjects(): ClientProject[] {
    const key = `${this.STORAGE_KEY_PREFIX}client_projects`;
    const raw = localStorage.getItem(key);
    let list: ClientProject[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      list = [
        {
          id: 'client-1',
          clientName: 'Aurelia Luxury Travel',
          projectTitle: 'Bespoke Travel Booking Portal & Editorial Brand',
          status: 'in_progress',
          budgetAmount: 185000,
          currency: 'INR',
          paidAmount: 92500,
          deliverables: ['Custom design token system', 'Next.js 14 booking engine', 'Sanity CMS integration'],
          timeline: 'Oct 2026 - Dec 2026',
          leadContact: 'concierge@aureliaholidays.com',
          assignedTo: 'both',
          createdAt: '2026-10-01',
        },
        {
          id: 'client-2',
          clientName: 'NeuraHealth Informatics',
          projectTitle: 'HIPAA-Ready Patient Health Metric Dashboard',
          status: 'proposal',
          budgetAmount: 240000,
          currency: 'INR',
          paidAmount: 0,
          deliverables: ['Secure FHIR API pipeline', 'Accessibility WCAG 2.2 AA audit', 'Interactive WebGL vitals viewer'],
          timeline: 'Dec 2026 - Feb 2027',
          leadContact: 'partnerships@neurahealth.io',
          assignedTo: 'sreesh',
          createdAt: '2026-11-02',
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }
    return list;
  }

  public createClientProject(proj: Omit<ClientProject, 'id' | 'createdAt'>): ClientProject {
    const list = this.getClientProjects();
    const newProj: ClientProject = {
      ...proj,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    list.unshift(newProj);
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}client_projects`, JSON.stringify(list));
    return newProj;
  }

  // --- MULTI-DEVICE SESSION MANAGEMENT (MAC, IPHONE, WINDOWS) ---
  public detectCurrentDevice(): { name: string; type: DeviceSession['deviceType']; os: string; browser: string } {
    if (typeof window === 'undefined') {
      return { name: 'Windows Workstation', type: 'windows', os: 'Windows 11', browser: 'Chrome' };
    }
    const ua = navigator.userAgent;
    let type: DeviceSession['deviceType'] = 'windows';
    let name = 'Windows Laptop';
    let os = 'Windows 11';
    let browser = 'Chrome';

    if (/iPhone|iPad|iPod/i.test(ua)) {
      type = 'iphone';
      name = 'iPhone 16 Pro';
      os = 'iOS 18.1';
      browser = 'Mobile Safari';
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
      type = 'mac';
      name = 'MacBook Pro 16"';
      os = 'macOS Sequoia';
      browser = 'Safari / Chrome';
    } else if (/Windows/i.test(ua)) {
      type = 'windows';
      name = 'Windows Workstation';
      os = 'Windows 11 Enterprise';
      browser = 'Chrome 130';
    }

    return { name, type, os, browser };
  }

  public getDeviceSessions(userId: UserId): DeviceSession[] {
    const key = `${this.STORAGE_KEY_PREFIX}devices_${userId}`;
    const raw = localStorage.getItem(key);
    let list: DeviceSession[] = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      const current = this.detectCurrentDevice();
      const now = new Date();

      list = [
        {
          id: `dev-${userId}-current`,
          userId,
          deviceName: current.name,
          deviceType: current.type,
          browser: current.browser,
          os: current.os,
          location: 'Bengaluru, India',
          isCurrentDevice: true,
          sessionStatus: 'active',
          lastActive: 'Just now',
          loginTime: new Date(now.getTime() - 3600000 * 2).toISOString(),
          isTrusted: true,
          appVersion: 'v2.4.0 (PWA/Web)',
        },
        {
          id: `dev-${userId}-mac`,
          userId,
          deviceName: 'MacBook Pro 16" (Studio)',
          deviceType: 'mac',
          browser: 'Safari 18.0',
          os: 'macOS Sequoia 15.1',
          location: 'Bengaluru, India',
          isCurrentDevice: current.type === 'mac',
          sessionStatus: 'active',
          lastActive: '18 minutes ago',
          loginTime: new Date(now.getTime() - 3600000 * 24).toISOString(),
          isTrusted: true,
          appVersion: 'v2.4.0 (Desktop Native)',
        },
        {
          id: `dev-${userId}-iphone`,
          userId,
          deviceName: 'iPhone 16 Pro Max',
          deviceType: 'iphone',
          browser: 'Safari PWA',
          os: 'iOS 18.1',
          location: 'Bengaluru, India',
          isCurrentDevice: current.type === 'iphone',
          sessionStatus: 'active',
          lastActive: '45 minutes ago',
          loginTime: new Date(now.getTime() - 3600000 * 48).toISOString(),
          isTrusted: true,
          appVersion: 'v2.4.0 (PWA Client)',
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }

    return list;
  }

  public revokeDeviceSession(userId: UserId, sessionId: string): void {
    const list = this.getDeviceSessions(userId);
    const updated = list.map((s) => (s.id === sessionId ? { ...s, sessionStatus: 'revoked' as const } : s));
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}devices_${userId}`, JSON.stringify(updated));
  }

  public revokeOtherDeviceSessions(userId: UserId): void {
    const list = this.getDeviceSessions(userId);
    const updated = list.map((s) => (s.isCurrentDevice ? s : { ...s, sessionStatus: 'revoked' as const }));
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}devices_${userId}`, JSON.stringify(updated));
  }

  // --- 5-STATUS MULTI-DIMENSION RECONCILIATION ENGINE ---
  public getFiveStatusSnapshot(userId: UserId): FiveStatusModel {
    const presence = this.getUserPresence(userId);
    const clockIn = this.getActiveClockIn(userId);
    const currentDevice = this.detectCurrentDevice();

    let attendanceStatus: FiveStatusModel['attendanceStatus'] = 'checked_out';
    if (clockIn) {
      const activeBreak = clockIn.breaks.find((b) => !b.end);
      attendanceStatus = activeBreak ? 'on_break' : 'checked_in';
    }

    let appStatus: FiveStatusModel['appStatus'] = 'active';
    if (typeof document !== 'undefined' && document.hidden) {
      appStatus = 'background';
    }

    return {
      loginStatus: 'signed_in',
      appStatus,
      workStatus: presence.status,
      attendanceStatus,
      deviceStatus: {
        deviceName: currentDevice.name,
        deviceType: currentDevice.type,
        lastSyncTime: 'Just now',
      },
    };
  }
}

export const workOs = new WorkOsStorage();

