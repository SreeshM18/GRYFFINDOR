export type UserId = 'sreesh' | 'mrithula';

export type UserStatusType =
  | 'available'
  | 'working'
  | 'busy'
  | 'on_break'
  | 'do_not_disturb'
  | 'offline'
  | 'away';

export interface UserPresence {
  userId: UserId;
  status: UserStatusType;
  customStatus?: string;
  currentProject?: string;
  currentTask?: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  userId: UserId;
  date: string; // YYYY-MM-DD
  clockInTime: string; // ISO string
  clockOutTime?: string; // ISO string
  totalDurationMinutes: number;
  breakDurationMinutes: number;
  breaks: {
    start: string;
    end?: string;
    reason?: string;
  }[];
  status: 'present' | 'late' | 'half_day' | 'absent' | 'leave' | 'holiday';
  verificationType: 'self_reported' | 'employer_verified';
  notes?: string;
  auditTrail?: {
    action: string;
    timestamp: string;
    performedBy: UserId;
    reason?: string;
  }[];
}

export interface InternshipRecord {
  id: string;
  userId: UserId;
  companyName: string;
  roleTitle: string;
  internshipType: 'Full-Time' | 'Part-Time' | 'Remote' | 'On-Site';
  location: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'upcoming';
  supervisorName?: string;
  dailyLogs: {
    id: string;
    date: string;
    hoursSpent: number;
    tasksDone: string;
    learnings: string;
  }[];
  weeklyReports: {
    weekNumber: number;
    summary: string;
    deliverables: string[];
  }[];
}

export interface AcademicCourse {
  id: string;
  userId: UserId;
  code: string;
  title: string;
  semester: string;
  credits: number;
  instructor?: string;
  attendanceStats: {
    totalClasses: number;
    attendedClasses: number;
    percentage: number;
  };
  assignments: {
    id: string;
    title: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded';
    score?: string;
  }[];
  exams: {
    id: string;
    title: string;
    date: string;
    syllabusNotes?: string;
  }[];
}

export interface LeaveRequest {
  id: string;
  userId: UserId;
  startDate: string;
  endDate: string;
  leaveType: 'academic' | 'casual' | 'sick' | 'vacation' | 'exam_prep';
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'resume' | 'certificate' | 'internship' | 'academic' | 'project' | 'legal';
  ownerId: UserId | 'shared';
  fileType: string;
  sizeBytes: number;
  fileUrl?: string;
  uploadedAt: string;
  isPrivate: boolean;
}

export interface MeetingItem {
  id: string;
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  agenda: string;
  notes?: string;
  actionItems: {
    id: string;
    text: string;
    assignedTo: UserId;
    done: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: UserId;
  content: string;
  timestamp: string;
  read: boolean;
  attachmentName?: string;
}

export interface NotificationItem {
  id: string;
  recipientId: UserId | 'both';
  title: string;
  message: string;
  type: 'deadline' | 'attendance' | 'task' | 'meeting' | 'system';
  timestamp: string;
  read: boolean;
}
