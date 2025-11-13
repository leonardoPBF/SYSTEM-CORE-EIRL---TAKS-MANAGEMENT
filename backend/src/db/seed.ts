import { db } from './index';
import { users, clients, agents, tickets, comments } from './schema';
import bcrypt from 'bcrypt';

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
    await db.insert(users).values({
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
      role: 'it_team',
      isActive: true,
    }).returning();

    const agent2Password = await bcrypt.hash('agent123', 10);
    const [agent2User] = await db.insert(users).values({
      email: 'devon@tasksystemcore.com',
      password: agent2Password,
      name: 'Devon Lane',
      role: 'it_team',
      isActive: true,
    }).returning();

    const agent3Password = await bcrypt.hash('agent123', 10);
    const [agent3User] = await db.insert(users).values({
      email: 'jenny@tasksystemcore.com',
      password: agent3Password,
      name: 'Jenny Wilson',
      role: 'it_team',
      isActive: true,
    }).returning();

    // Nuevos agentes adicionales
    const agent4Password = await bcrypt.hash('agent123', 10);
    const [agent4User] = await db.insert(users).values({
      email: 'carlos@tasksystemcore.com',
      password: agent4Password,
      name: 'Carlos Rodríguez',
      role: 'it_team',
      isActive: true,
    }).returning();

    const agent5Password = await bcrypt.hash('agent123', 10);
    const [agent5User] = await db.insert(users).values({
      email: 'maria@tasksystemcore.com',
      password: agent5Password,
      name: 'María García',
      role: 'it_team',
      isActive: true,
    }).returning();

    const agent6Password = await bcrypt.hash('agent123', 10);
    const [agent6User] = await db.insert(users).values({
      email: 'juan@tasksystemcore.com',
      password: agent6Password,
      name: 'Juan Martínez',
      role: 'it_team',
      isActive: true,
    }).returning();

    const agent7Password = await bcrypt.hash('agent123', 10);
    const [agent7User] = await db.insert(users).values({
      email: 'ana@tasksystemcore.com',
      password: agent7Password,
      name: 'Ana López',
      role: 'it_team',
      isActive: true,
    }).returning();

    const agent8Password = await bcrypt.hash('agent123', 10);
    const [agent8User] = await db.insert(users).values({
      email: 'pedro@tasksystemcore.com',
      password: agent8Password,
      name: 'Pedro Sánchez',
      role: 'it_team',
      isActive: true,
    }).returning();

    const agent9Password = await bcrypt.hash('agent123', 10);
    const [agent9User] = await db.insert(users).values({
      email: 'laura@tasksystemcore.com',
      password: agent9Password,
      name: 'Laura Fernández',
      role: 'it_team',
      isActive: true,
    }).returning();

    console.log('✅ Usuarios agentes creados (9 agentes)');

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
      role: 'it_team',
      team: 'Equipo de Soporte 1',
      status: 'online',
      maxTickets: 15,
    }).returning();

    const [agentRecord2] = await db.insert(agents).values({
      userId: agent2User.id,
      role: 'it_team',
      team: 'Equipo de Soporte 1',
      status: 'online',
      maxTickets: 12,
    }).returning();

    const [agentRecord3] = await db.insert(agents).values({
      userId: agent3User.id,
      role: 'it_team',
      team: 'Equipo de Soporte 2',
      status: 'at_capacity',
      maxTickets: 10,
    }).returning();

    // Nuevos agentes adicionales
    const [agentRecord4] = await db.insert(agents).values({
      userId: agent4User.id,
      role: 'it_team',
      team: 'Equipo de Soporte 1',
      status: 'online',
      maxTickets: 12,
    }).returning();

    const [agentRecord5] = await db.insert(agents).values({
      userId: agent5User.id,
      role: 'it_team',
      team: 'Equipo de Soporte 2',
      status: 'online',
      maxTickets: 14,
    }).returning();

    const [agentRecord6] = await db.insert(agents).values({
      userId: agent6User.id,
      role: 'it_team',
      team: 'Equipo de Soporte 2',
      status: 'away',
      maxTickets: 10,
    }).returning();

    const [agentRecord7] = await db.insert(agents).values({
      userId: agent7User.id,
      role: 'it_team',
      team: 'Equipo de Soporte 3',
      status: 'online',
      maxTickets: 13,
    }).returning();

    const [agentRecord8] = await db.insert(agents).values({
      userId: agent8User.id,
      role: 'it_team',
      team: 'Equipo de Soporte 3',
      status: 'offline',
      maxTickets: 11,
    }).returning();

    const [agentRecord9] = await db.insert(agents).values({
      userId: agent9User.id,
      role: 'it_team',
      team: 'Equipo de Soporte 3',
      status: 'online',
      maxTickets: 15,
    }).returning();

    console.log('✅ Agentes creados (9 agentes en total)');

    // Crear Tickets
    const [ticket1] = await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-001`,
      subject: 'Fallo de pago en checkout',
      description: 'Los clientes están experimentando fallos de pago al intentar completar el checkout. El mensaje de error muestra que el desafío 3D Secure está fallando.',
      clientId: clientRecord1.id,
      createdBy: client1User.id,
      priority: 'high',
      status: 'open',
      type: 'Facturación',
      source: 'email',
      tags: ['facturación', 'pago', 'urgente'],
    }).returning();

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-002`,
      subject: 'Fallo de pago en plan anual',
      description: 'Fallo de pago al actualizar al plan anual. Falló 3D Secure.',
      clientId: clientRecord1.id,
      createdBy: client1User.id,
      priority: 'medium',
      status: 'resolved',
      type: 'Facturación',
      source: 'email',
      tags: ['facturación', 'pago'],
    }).returning();

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-003`,
      subject: 'Tarjeta rechazada por el banco',
      description: 'La tarjeta de crédito está siendo rechazada por el banco. Se necesita validación.',
      clientId: clientRecord2.id,
      createdBy: client2User.id,
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
      createdBy: client3User.id,
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
      createdBy: client1User.id,
      assignedTo: agentRecord2.id,
      priority: 'low',
      status: 'in_progress',
      type: 'Solicitud de Función',
      source: 'portal',
      tags: ['función', 'ui'],
    }).returning();

    // Tickets adicionales para nuevos agentes
    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-006`,
      subject: 'Error al exportar reportes',
      description: 'El botón de exportar reportes no funciona correctamente.',
      clientId: clientRecord2.id,
      createdBy: client2User.id,
      assignedTo: agentRecord3.id,
      priority: 'high',
      status: 'assigned',
      type: 'Técnico',
      source: 'email',
      tags: ['reportes', 'bug'],
    });

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-007`,
      subject: 'Problema de rendimiento en dashboard',
      description: 'El dashboard tarda mucho en cargar los datos.',
      clientId: clientRecord3.id,
      createdBy: client3User.id,
      assignedTo: agentRecord3.id,
      priority: 'urgent',
      status: 'in_progress',
      type: 'Performance',
      source: 'chat',
      tags: ['performance', 'dashboard'],
    });

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-008`,
      subject: 'Solicitud de cambio de plan',
      description: 'Quiero cambiar mi plan actual a uno superior.',
      clientId: clientRecord1.id,
      createdBy: client1User.id,
      assignedTo: agentRecord4.id,
      priority: 'medium',
      status: 'assigned',
      type: 'Consulta',
      source: 'portal',
      tags: ['plan', 'upgrade'],
    });

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-009`,
      subject: 'No recibo notificaciones por email',
      description: 'Las notificaciones por correo no están llegando.',
      clientId: clientRecord2.id,
      createdBy: client2User.id,
      assignedTo: agentRecord4.id,
      priority: 'high',
      status: 'in_progress',
      type: 'Técnico',
      source: 'email',
      tags: ['notificaciones', 'email'],
    });

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-010`,
      subject: 'Integración con API externa',
      description: 'Necesito ayuda para integrar mi sistema con la API.',
      clientId: clientRecord3.id,
      createdBy: client3User.id,
      assignedTo: agentRecord5.id,
      priority: 'medium',
      status: 'assigned',
      type: 'Consulta',
      source: 'portal',
      tags: ['api', 'integración'],
    });

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-011`,
      subject: 'Error 500 en módulo de inventario',
      description: 'Al acceder al módulo de inventario aparece error 500.',
      clientId: clientRecord1.id,
      createdBy: client1User.id,
      assignedTo: agentRecord5.id,
      priority: 'urgent',
      status: 'in_progress',
      type: 'Incidente',
      source: 'chat',
      tags: ['error', 'inventario', 'crítico'],
    });

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-012`,
      subject: 'Actualización de datos de contacto',
      description: 'Necesito actualizar los datos de contacto de mi empresa.',
      clientId: clientRecord2.id,
      createdBy: client2User.id,
      assignedTo: agentRecord6.id,
      priority: 'low',
      status: 'assigned',
      type: 'General',
      source: 'portal',
      tags: ['datos', 'contacto'],
    });

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-013`,
      subject: 'Capacitación para nuevos usuarios',
      description: 'Solicito una sesión de capacitación para mi equipo.',
      clientId: clientRecord3.id,
      createdBy: client3User.id,
      assignedTo: agentRecord7.id,
      priority: 'medium',
      status: 'assigned',
      type: 'Consulta',
      source: 'email',
      tags: ['capacitación', 'training'],
    });

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-014`,
      subject: 'Problema con permisos de usuario',
      description: 'Un usuario no puede acceder a ciertas funcionalidades.',
      clientId: clientRecord1.id,
      createdBy: client1User.id,
      assignedTo: agentRecord7.id,
      priority: 'high',
      status: 'in_progress',
      type: 'Técnico',
      source: 'chat',
      tags: ['permisos', 'acceso'],
    });

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-015`,
      subject: 'Backup de datos históricos',
      description: 'Necesito un backup de todos los datos del último año.',
      clientId: clientRecord2.id,
      createdBy: client2User.id,
      assignedTo: agentRecord9.id,
      priority: 'medium',
      status: 'assigned',
      type: 'Solicitud',
      source: 'email',
      tags: ['backup', 'datos'],
    });

    await db.insert(tickets).values({
      ticketNumber: `TKT-${Date.now()}-016`,
      subject: 'Mejora en interfaz de búsqueda',
      description: 'La búsqueda podría ser más intuitiva y rápida.',
      clientId: clientRecord3.id,
      createdBy: client3User.id,
      assignedTo: agentRecord9.id,
      priority: 'low',
      status: 'in_progress',
      type: 'Solicitud de Función',
      source: 'portal',
      tags: ['ui', 'búsqueda', 'mejora'],
    });

    console.log('✅ Tickets creados (16 tickets en total)');

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
    console.log('👤 Agentes TI (9 miembros):');
    console.log('   - leslie@tasksystemcore.com / agent123');
    console.log('   - devon@tasksystemcore.com / agent123');
    console.log('   - jenny@tasksystemcore.com / agent123');
    console.log('   - carlos@tasksystemcore.com / agent123');
    console.log('   - maria@tasksystemcore.com / agent123');
    console.log('   - juan@tasksystemcore.com / agent123');
    console.log('   - ana@tasksystemcore.com / agent123');
    console.log('   - pedro@tasksystemcore.com / agent123');
    console.log('   - laura@tasksystemcore.com / agent123');
    console.log('👤 Cliente: jane@acme.com / client123');
  } catch (error) {
    console.error('❌ Error sembrando base de datos:', error);
    throw error;
  }
}

