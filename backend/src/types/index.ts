export enum UserRole {
  ADMIN = 'admin',
  IT_DIRECTOR = 'it_director',
  IT_TEAM = 'it_team',
  CLIENT = 'client'
}

export enum TicketStatus {
  OPEN = 'Open',
  PENDING_DIRECTOR = 'Pending_Director',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed'
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum TicketSource {
  EMAIL = 'Email',
  PHONE = 'Phone',
  CHAT = 'Chat',
  PORTAL = 'Portal',
  API = 'API'
}

export enum AgentStatus {
  ONLINE = 'Online',
  AWAY = 'Away',
  OFFLINE = 'Offline',
  AT_CAPACITY = 'At Capacity'
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Client {
  id: string;
  userId: string;
  company: string;
  phone?: string;
  address?: string;
  segment?: string;
  status: 'Active' | 'At Risk' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  userId: string;
  role: 'IT_Director' | 'IT_Team';
  team?: string;
  status: AgentStatus;
  maxTickets: number;
  canAssignTickets?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  clientId: string;
  createdBy: string;
  reviewedBy?: string;
  assignedTo?: string;
  priority: TicketPriority;
  status: TicketStatus;
  type: string;
  source: TicketSource;
  tags: string[];
  queue?: string;
  sla?: string;
  dueDate?: Date;
  reviewedAt?: Date;
  assignedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  isInternal: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  ticketId?: string;
  commentId?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Queue {
  id: string;
  name: string;
  description?: string;
  agents: string[];
  sla?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SLA {
  id: string;
  name: string;
  firstResponseTime: number; // minutes
  resolutionTime: number; // hours
  businessHours?: {
    start: string;
    end: string;
    days: number[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  agentsOnline: number;
  unassignedTickets: number;
  queuesBreachingSoon: number;
  avgLoadPerAgent: number;
  newTickets: number;
  resolvedTickets: number;
  backlog: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

