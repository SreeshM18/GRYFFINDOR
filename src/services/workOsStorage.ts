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
}

export const workOs = new WorkOsStorage();
