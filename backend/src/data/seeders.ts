import { UserModel } from '../models/User';
import { ClientModel } from '../models/Client';
import { AgentModel } from '../models/Agent';
import { TicketModel } from '../models/Ticket';
import { UserRole, TicketStatus, TicketPriority, TicketSource, AgentStatus } from '../types';

export const seedDatabase = async () => {
  console.log('🌱 Sembrando base de datos...');

  // Crear Usuario Administrador
  await UserModel.create({
    email: 'admin@tasksystemcore.com',
    password: 'admin123',
    name: 'Usuario Administrador',
    role: UserRole.ADMIN
  });

  // Crear Usuarios Agentes
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

  // Crear Usuarios Clientes
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

  // Crear Clientes
  const clientRecord1 = await ClientModel.create({
    userId: client1.id,
    company: 'Acme Inc.',
    phone: '+1-555-0101',
    segment: 'Empresa',
    status: 'Active'
  });

  const clientRecord2 = await ClientModel.create({
    userId: client2.id,
    company: 'Globex',
    phone: '+1-555-0102',
    segment: 'Prueba',
    status: 'Active'
  });

  const clientRecord3 = await ClientModel.create({
    userId: client3.id,
    company: 'Umbrella Corp.',
    phone: '+1-555-0103',
    segment: 'VIP',
    status: 'Active'
  });

  // Crear Agentes
  const agentRecord1 = await AgentModel.create({
    userId: agent1.id,
    team: 'Equipo de Soporte 1',
    status: AgentStatus.ONLINE,
    maxTickets: 15
  });

  const agentRecord2 = await AgentModel.create({
    userId: agent2.id,
    team: 'Equipo de Soporte 1',
    status: AgentStatus.ONLINE,
    maxTickets: 12
  });

  await AgentModel.create({
    userId: agent3.id,
    team: 'Equipo de Soporte 2',
    status: AgentStatus.AT_CAPACITY,
    maxTickets: 10
  });

  // Crear Tickets
  await TicketModel.create({
    subject: 'Fallo de pago en checkout',
    description: 'Los clientes están experimentando fallos de pago al intentar completar el checkout. El mensaje de error muestra que el desafío 3D Secure está fallando.',
    clientId: clientRecord1.id,
    priority: TicketPriority.HIGH,
    status: TicketStatus.OPEN,
    type: 'Facturación',
    source: TicketSource.EMAIL,
    tags: ['facturación', 'pago', 'urgente']
  });

  await TicketModel.create({
    subject: 'Fallo de pago en plan anual',
    description: 'Fallo de pago al actualizar al plan anual. Falló 3D Secure.',
    clientId: clientRecord1.id,
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.RESOLVED,
    type: 'Facturación',
    source: TicketSource.EMAIL,
    tags: ['facturación', 'pago']
  });

  await TicketModel.create({
    subject: 'Tarjeta rechazada por el banco',
    description: 'La tarjeta de crédito está siendo rechazada por el banco. Se necesita validación.',
    clientId: clientRecord2.id,
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.OPEN,
    type: 'Pagos',
    source: TicketSource.PORTAL,
    tags: ['pago', 'validación']
  });

  await TicketModel.create({
    subject: 'No se puede acceder al panel de control',
    description: 'El usuario no puede iniciar sesión en el panel de control. Obtiene error 403.',
    clientId: clientRecord3.id,
    priority: TicketPriority.HIGH,
    status: TicketStatus.ASSIGNED,
    assignedTo: agentRecord1.id,
    type: 'Técnico',
    source: TicketSource.CHAT,
    tags: ['acceso', 'panel']
  });

  await TicketModel.create({
    subject: 'Solicitud de función: Modo oscuro',
    description: 'Me gustaría solicitar la función de modo oscuro para la aplicación.',
    clientId: clientRecord1.id,
    priority: TicketPriority.LOW,
    status: TicketStatus.IN_PROGRESS,
    assignedTo: agentRecord2.id,
    type: 'Solicitud de Función',
    source: TicketSource.PORTAL,
    tags: ['función', 'ui']
  });

  console.log('✅ Base de datos sembrada exitosamente!');
  console.log('📧 Administrador: admin@tasksystemcore.com / admin123');
  console.log('👤 Agente: leslie@tasksystemcore.com / agent123');
  console.log('👤 Cliente: jane@acme.com / client123');
};
