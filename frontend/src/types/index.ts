export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Agent' | 'Client';
  avatar?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  client: string;
  clientCompany: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  type: string;
  source: 'Email' | 'Phone' | 'Chat' | 'Portal';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  sla?: string;
  tags?: string[];
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  role?: string;
  openTickets: number;
  priority: 'Low' | 'Medium' | 'High';
  lastActivity: string;
  status: 'Active' | 'At Risk' | 'Inactive';
  segment?: string;
}

export interface Agent {
  id: string;
  name: string;
  open: number;
  highUrgent: number;
  avgTimeToFirstReply: string;
  status: 'Online' | 'Away' | 'Offline' | 'At Capacity';
  team?: string;
}

export interface DashboardMetrics {
  agentsOnline: number;
  unassignedTickets: number;
  queuesBreachingSoon: number;
  avgLoadPerAgent: number;
}

export interface ReportMetrics {
  newTickets: number;
  resolved: number;
  backlog: number;
  newTicketsChange: number;
  resolvedChange: number;
  backlogChange: number;
}

