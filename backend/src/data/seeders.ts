import { UserModel } from '../models/User';
import { ClientModel } from '../models/Client';
import { AgentModel } from '../models/Agent';
import { TicketModel } from '../models/Ticket';
import { UserRole, TicketStatus, TicketPriority, TicketSource, AgentStatus } from '../types';

export const seedDatabase = async () => {
  console.log('🌱 Seeding database...');

  // Create Admin User
  await UserModel.create({
    email: 'admin@tasksystemcore.com',
    password: 'admin123',
    name: 'Admin User',
    role: UserRole.ADMIN
  });

  // Create Agent Users
  const agent1 = await UserModel.create({
    email: 'leslie@tasksystemcore.com',
    password: 'agent123',
    name: 'Leslie Alexander',
    role: UserRole.AGENT
  });

  const agent2 = await UserModel.create({
    email: 'devon@tasksystemcore.com',
    password: 'agent123',
    name: 'Devon Lane',
    role: UserRole.AGENT
  });

  const agent3 = await UserModel.create({
    email: 'jenny@tasksystemcore.com',
    password: 'agent123',
    name: 'Jenny Wilson',
    role: UserRole.AGENT
  });

  // Create Client Users
  const client1 = await UserModel.create({
    email: 'jane@acme.com',
    password: 'client123',
    name: 'Jane Cooper',
    role: UserRole.CLIENT
  });

  const client2 = await UserModel.create({
    email: 'robert@globex.com',
    password: 'client123',
    name: 'Robert Fox',
    role: UserRole.CLIENT
  });

  const client3 = await UserModel.create({
    email: 'theresa@umbrella.com',
    password: 'client123',
    name: 'Theresa Webb',
    role: UserRole.CLIENT
  });

  // Create Clients
  const clientRecord1 = ClientModel.create({
    userId: client1.id,
    company: 'Acme Inc.',
    phone: '+1-555-0101',
    segment: 'Enterprise',
    status: 'Active'
  });

  const clientRecord2 = ClientModel.create({
    userId: client2.id,
    company: 'Globex',
    phone: '+1-555-0102',
    segment: 'Trial',
    status: 'Active'
  });

  const clientRecord3 = ClientModel.create({
    userId: client3.id,
    company: 'Umbrella Corp.',
    phone: '+1-555-0103',
    segment: 'VIP',
    status: 'Active'
  });

  // Create Agents
  const agentRecord1 = AgentModel.create({
    userId: agent1.id,
    team: 'Support Team 1',
    status: AgentStatus.ONLINE,
    maxTickets: 15
  });

  const agentRecord2 = AgentModel.create({
    userId: agent2.id,
    team: 'Support Team 1',
    status: AgentStatus.ONLINE,
    maxTickets: 12
  });

  AgentModel.create({
    userId: agent3.id,
    team: 'Support Team 2',
    status: AgentStatus.AT_CAPACITY,
    maxTickets: 10
  });

  // Create Tickets
  TicketModel.create({
    subject: 'Payment failing on checkout',
    description: 'Customers are experiencing payment failures when trying to complete checkout. Error message shows 3D Secure challenge failing.',
    clientId: clientRecord1.id,
    priority: TicketPriority.HIGH,
    status: TicketStatus.OPEN,
    type: 'Billing',
    source: TicketSource.EMAIL,
    tags: ['billing', 'payment', 'urgent']
  });

  TicketModel.create({
    subject: 'Payment failure on annual plan',
    description: 'Payment failure when upgrading to annual plan. 3D Secure failed.',
    clientId: clientRecord1.id,
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.RESOLVED,
    type: 'Billing',
    source: TicketSource.EMAIL,
    tags: ['billing', 'payment']
  });

  TicketModel.create({
    subject: 'Card declined by bank',
    description: 'Credit card is being declined by the bank. Need validation.',
    clientId: clientRecord2.id,
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.OPEN,
    type: 'Payments',
    source: TicketSource.PORTAL,
    tags: ['payment', 'validation']
  });

  TicketModel.create({
    subject: 'Unable to access dashboard',
    description: 'User cannot log in to the dashboard. Getting 403 error.',
    clientId: clientRecord3.id,
    priority: TicketPriority.HIGH,
    status: TicketStatus.ASSIGNED,
    assignedTo: agentRecord1.id,
    type: 'Technical',
    source: TicketSource.CHAT,
    tags: ['access', 'dashboard']
  });

  TicketModel.create({
    subject: 'Feature request: Dark mode',
    description: 'Would like to request dark mode feature for the application.',
    clientId: clientRecord1.id,
    priority: TicketPriority.LOW,
    status: TicketStatus.IN_PROGRESS,
    assignedTo: agentRecord2.id,
    type: 'Feature Request',
    source: TicketSource.PORTAL,
    tags: ['feature', 'ui']
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin: admin@tasksystemcore.com / admin123');
  console.log('👤 Agent: leslie@tasksystemcore.com / agent123');
  console.log('👤 Client: jane@acme.com / client123');
};

