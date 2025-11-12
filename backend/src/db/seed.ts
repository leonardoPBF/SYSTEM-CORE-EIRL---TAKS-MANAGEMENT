import { db } from './index';
import { users, clients, agents, tickets, comments } from './schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  console.log('🌱 Sembrando base de datos con Drizzle...');

  try {
    // Limpiar tablas (en orden inverso por foreign keys)
    await db.delete(comments);
    await db.delete(tickets);
    await db.delete(agents);
    await db.delete(clients);
    await db.delete(users);

    console.log('✅ Tablas limpiadas');

    // Crear Usuario Administrador
    const adminPassword = await bcrypt.hash('admin123', 10);
    const [admin] = await db.insert(users).values({
      email: 'admin@tasksystemcore.com',
      password: adminPassword,
      name: 'Usuario Administrador',
      role: 'admin',
      isActive: true,
    }).returning();

    console.log('✅ Usuario administrador creado');

    // Crear Usuarios Agentes
    const agent1Password = await bcrypt.hash('agent123', 10);
    const [agent1User] = await db.insert(users).values({
      email: 'leslie@tasksystemcore.com',
      password: agent1Password,
      name: 'Leslie Alexander',
      role: 'agent',
      isActive: true,
    }).returning();

    const agent2Password = await bcrypt.hash('agent123', 10);
    const [agent2User] = await db.insert(users).values({
      email: 'devon@tasksystemcore.com',
      password: agent2Password,
      name: 'Devon Lane',
      role: 'agent',
      isActive: true,
    }).returning();

    const agent3Password = await bcrypt.hash('agent123', 10);
    const [agent3User] = await db.insert(users).values({
      email: 'jenny@tasksystemcore.com',
      password: agent3Password,
      name: 'Jenny Wilson',
      role: 'agent',
      isActive: true,
    }).returning();

    console.log('✅ Usuarios agentes creados');

    // Crear Usuarios Clientes
    const client1Password = await bcrypt.hash('client123', 10);
    const [client1User] = await db.insert(users).values({
      email: 'jane@acme.com',
      password: client1Password,
      name: 'Jane Cooper',
      role: 'client',
      isActive: true,
    }).returning();

    const client2Password = await bcrypt.hash('client123', 10);
    const [client2User] = await db.insert(users).values({
      email: 'robert@globex.com',
      password: client2Password,
      name: 'Robert Fox',
      role: 'client',
      isActive: true,
    }).returning();

    const client3Password = await bcrypt.hash('client123', 10);
    const [client3User] = await db.insert(users).values({
      email: 'theresa@umbrella.com',
      password: client3Password,
      name: 'Theresa Webb',
      role: 'client',
      isActive: true,
    }).returning();

    console.log('✅ Usuarios clientes creados');

    // Crear Clientes
    const [clientRecord1] = await db.insert(clients).values({
      userId: client1User.id,
      company: 'Acme Inc.',
      phone: '+1-555-0101',
      segment: 'Empresa',
      status: 'Active',
    }).returning();

    const [clientRecord2] = await db.insert(clients).values({
      userId: client2User.id,
      company: 'Globex',
      phone: '+1-555-0102',
      segment: 'Prueba',
      status: 'Active',
    }).returning();

    const [clientRecord3] = await db.insert(clients).values({
      userId: client3User.id,
      company: 'Umbrella Corp.',
      phone: '+1-555-0103',
      segment: 'VIP',
      status: 'Active',
    }).returning();

    console.log('✅ Clientes creados');

    // Crear Agentes
    const [agentRecord1] = await db.insert(agents).values({
      userId: agent1User.id,
      team: 'Equipo de Soporte 1',
      status: 'online',
      maxTickets: 15,
    }).returning();

    const [agentRecord2] = await db.insert(agents).values({
      userId: agent2User.id,
      team: 'Equipo de Soporte 1',
      status: 'online',
      maxTickets: 12,
    }).returning();

    await db.insert(agents).values({
      userId: agent3User.id,
      team: 'Equipo de Soporte 2',
      status: 'at_capacity',
      maxTickets: 10,
    });

    console.log('✅ Agentes creados');

    // Crear Tickets
    const [ticket1] = await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-001`,
      subject: 'Fallo de pago en checkout',
      description: 'Los clientes están experimentando fallos de pago al intentar completar el checkout. El mensaje de error muestra que el desafío 3D Secure está fallando.',
      clientId: clientRecord1.id,
      priority: 'high',
      status: 'open',
      type: 'Facturación',
      source: 'email',
      tags: ['facturación', 'pago', 'urgente'],
    }).returning();

    const [ticket2] = await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-002`,
      subject: 'Fallo de pago en plan anual',
      description: 'Fallo de pago al actualizar al plan anual. Falló 3D Secure.',
      clientId: clientRecord1.id,
      priority: 'medium',
      status: 'resolved',
      type: 'Facturación',
      source: 'email',
      tags: ['facturación', 'pago'],
    }).returning();

    const [ticket3] = await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-003`,
      subject: 'Tarjeta rechazada por el banco',
      description: 'La tarjeta de crédito está siendo rechazada por el banco. Se necesita validación.',
      clientId: clientRecord2.id,
      priority: 'medium',
      status: 'open',
      type: 'Pagos',
      source: 'portal',
      tags: ['pago', 'validación'],
    }).returning();

    const [ticket4] = await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-004`,
      subject: 'No se puede acceder al panel de control',
      description: 'El usuario no puede iniciar sesión en el panel de control. Obtiene error 403.',
      clientId: clientRecord3.id,
      assignedTo: agentRecord1.id,
      priority: 'high',
      status: 'assigned',
      type: 'Técnico',
      source: 'chat',
      tags: ['acceso', 'panel'],
    }).returning();

    const [ticket5] = await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-005`,
      subject: 'Solicitud de función: Modo oscuro',
      description: 'Me gustaría solicitar la función de modo oscuro para la aplicación.',
      clientId: clientRecord1.id,
      assignedTo: agentRecord2.id,
      priority: 'low',
      status: 'in_progress',
      type: 'Solicitud de Función',
      source: 'portal',
      tags: ['función', 'ui'],
    }).returning();

    console.log('✅ Tickets creados');

    // Crear Comentarios
    await db.insert(comments).values({
      ticketId: ticket1.id,
      userId: client1User.id,
      content: 'Este problema está afectando a varios clientes. Necesitamos una solución urgente.',
      isInternal: false,
    });

    await db.insert(comments).values({
      ticketId: ticket1.id,
      userId: agent1User.id,
      content: 'Estoy investigando el problema. Parece ser un issue con el proveedor de pagos.',
      isInternal: true,
    });

    await db.insert(comments).values({
      ticketId: ticket4.id,
      userId: agent1User.id,
      content: 'He verificado los permisos del usuario. El problema está resuelto.',
      isInternal: false,
    });

    await db.insert(comments).values({
      ticketId: ticket5.id,
      userId: client1User.id,
      content: 'Esta sería una excelente adición. ¿Cuándo podríamos tenerla disponible?',
      isInternal: false,
    });

    await db.insert(comments).values({
      ticketId: ticket5.id,
      userId: agent2User.id,
      content: 'Gracias por la sugerencia. La estamos evaluando para una futura versión.',
      isInternal: false,
    });

    console.log('✅ Comentarios creados');

    console.log('✅ Base de datos sembrada exitosamente!');
    console.log('📧 Administrador: admin@tasksystemcore.com / admin123');
    console.log('👤 Agente: leslie@tasksystemcore.com / agent123');
    console.log('👤 Cliente: jane@acme.com / client123');
  } catch (error) {
    console.error('❌ Error sembrando base de datos:', error);
    throw error;
  }
}

