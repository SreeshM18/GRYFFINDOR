export type ProfileId = 'sreesh' | 'mrithula';

export interface Profile {
  id: ProfileId;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  focusAreas: string[];
  education: {
    institution: string;
    degree: string;
    period: string;
    details?: string;
  };
  email: string;
  location: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  accentColor: string;
  stats: {
    label: string;
    value: string;
    sub: string;
  }[];
  skills: {
    category: string;
    items: { name: string; level?: 'Expert' | 'Proficient' | 'Familiar'; verified: boolean }[];
  }[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: 'ai' | 'fullstack' | 'creative-ui' | 'systems' | 'research';
  author: 'sreesh' | 'mrithula' | 'collaborative';
  featured: boolean;
  year: number;
  tags: string[];
  metrics?: string;
  githubUrl?: string;
  liveUrl?: string;
  coverImage?: string;
  architectureDiagram?: string;
  challenge?: string;
  solution?: string;
  techStack?: string[];
  keyFeatures?: string[];
  results?: string[];
  status?: 'completed' | 'ongoing' | 'archived';
}

export interface Achievement {
  id: string;
  recipient: 'sreesh' | 'mrithula' | 'both';
  title: string;
  issuer: string;
  date: string;
  category: 'hackathon' | 'certification' | 'award' | 'internship';
  description: string;
  verificationUrl?: string;
  certificateImage?: string;
  downloadable?: boolean;
}

export interface TimelineEvent {
  id: string;
  recipient: 'sreesh' | 'mrithula' | 'both';
  year: string;
  dateStr?: string;
  title: string;
  organization: string;
  description: string;
  category: 'education' | 'project' | 'hackathon' | 'internship' | 'milestone';
}

export interface WorkspaceTask {
  id: string;
  title: string;
  description?: string;
  assignedTo: 'sreesh' | 'mrithula' | 'unassigned';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  projectId?: string;
  createdAt: string;
}

export interface WorkspaceNote {
  id: string;
  title: string;
  content: string;
  author: 'sreesh' | 'mrithula';
  tags: string[];
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  inquiryType: 'collaboration' | 'hire_sreesh' | 'hire_mrithula' | 'general';
  message: string;
  createdAt: string;
  read: boolean;
}
