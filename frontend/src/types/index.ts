export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'IT_Director' | 'IT_Team' | 'Client';
  avatar?: string;
  department?: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  client: string;
  clientCompany: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  type: string;
  source: 'Email' | 'Phone' | 'Chat' | 'Portal';
  status: 'Open' | 'Pending_Director' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  createdBy: string; // Cliente que crea el ticket
  reviewedBy?: string; // Director TI que revisa
  assignedTo?: string; // Miembro del Equipo TI asignado
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  assignedAt?: string;
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
  email: string;
  role: 'IT_Director' | 'IT_Team';
  openTickets: number;
  highPriority: number;
  avgResponseTime: string;
  status: 'Online' | 'Away' | 'Offline' | 'At Capacity';
  team?: string;
  canAssignTickets?: boolean; // Solo para IT_Director
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

