import { db } from './index';
import { users, clients, agents, tickets, comments } from './schema';
import bcrypt from 'bcrypt';
import { checkTablesExist } from './init';

export async function seedDatabase() {
  console.log('🌱 Sembrando base de datos con Drizzle...');

  try {
    // Verificar conexión primero
    const { checkConnection } = await import('./init');
    try {
      await checkConnection();
      console.log('✅ Conexión a la base de datos establecida');
    } catch (error: any) {
      console.error('❌ Error de conexión:', error.message);
      throw error;
    }

    // Verificar si las tablas existen
    const tablesExist = await checkTablesExist();
    
    if (tablesExist) {
      // Limpiar tablas (en orden inverso por foreign keys)
      try {
        await db.delete(comments);
        await db.delete(tickets);
        await db.delete(agents);
        await db.delete(clients);
        await db.delete(users);
        console.log('✅ Tablas limpiadas');
      } catch (error: any) {
        console.warn('⚠️  Error al limpiar tablas:', error.message);
        // Continuar de todas formas
      }
    } else {
      console.log('ℹ️  Las tablas no existen aún.');
      console.log('💡 Ejecuta primero: npm run db:push');
      console.log('💡 O las tablas se crearán automáticamente con el primer insert');
      // Continuar de todas formas, las tablas se crearán con el primer insert
    }

    // Crear Usuario Administrador
    const adminPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      email: 'admin@tasksystemcore.com',
      password: adminPassword,
      name: 'Usuario Administrador',
      role: 'admin',
      isActive: true,
    }).returning();

    // Crear Director TI
    const directorPassword = await bcrypt.hash('director123', 10);
    const [directorUser] = await db.insert(users).values({
      email: 'director@tasksystemcore.com',
      password: directorPassword,
      name: 'Roberto Martínez',
      role: 'it_director',
      isActive: true,
    }).returning();

    console.log('✅ Usuario administrador y director TI creados');

    // Crear Usuarios Agentes
    const agentUsers = [];
    const agentData = [
      { email: 'leslie@tasksystemcore.com', name: 'Leslie Alexander', team: 'Equipo de Soporte 1', status: 'online', maxTickets: 15 },
      { email: 'devon@tasksystemcore.com', name: 'Devon Lane', team: 'Equipo de Soporte 1', status: 'online', maxTickets: 12 },
      { email: 'jenny@tasksystemcore.com', name: 'Jenny Wilson', team: 'Equipo de Soporte 2', status: 'at_capacity', maxTickets: 10 },
      { email: 'carlos@tasksystemcore.com', name: 'Carlos Rodríguez', team: 'Equipo de Soporte 1', status: 'online', maxTickets: 12 },
      { email: 'maria@tasksystemcore.com', name: 'María García', team: 'Equipo de Soporte 2', status: 'online', maxTickets: 14 },
      { email: 'juan@tasksystemcore.com', name: 'Juan Martínez', team: 'Equipo de Soporte 2', status: 'away', maxTickets: 10 },
      { email: 'ana@tasksystemcore.com', name: 'Ana López', team: 'Equipo de Soporte 3', status: 'online', maxTickets: 13 },
      { email: 'pedro@tasksystemcore.com', name: 'Pedro Sánchez', team: 'Equipo de Soporte 3', status: 'offline', maxTickets: 11 },
      { email: 'laura@tasksystemcore.com', name: 'Laura Fernández', team: 'Equipo de Soporte 3', status: 'online', maxTickets: 15 },
    ];

    for (const agentInfo of agentData) {
      const agentPassword = await bcrypt.hash('agent123', 10);
      const [agentUser] = await db.insert(users).values({
        email: agentInfo.email,
        password: agentPassword,
        name: agentInfo.name,
        role: 'it_team',
        isActive: true,
      }).returning();
      agentUsers.push({ user: agentUser, ...agentInfo });
    }

    console.log('✅ Usuarios agentes creados (9 agentes)');

    // Crear más clientes con datos variados
    const clientData = [
      { email: 'jane@acme.com', name: 'Jane Cooper', company: 'Acme Inc.', phone: '+51 999129123', segment: 'Empresa', address: '123 Main St, New York, NY' },
      { email: 'robert@globex.com', name: 'Robert Fox', company: 'Globex Corporation', phone: '+51 999129123', segment: 'Prueba', address: '456 Business Ave, Los Angeles, CA' },
      { email: 'theresa@umbrella.com', name: 'Theresa Webb', company: 'Umbrella Corp.', phone: '+51 999129123', segment: 'VIP', address: '789 Corporate Blvd, Chicago, IL' },
      { email: 'michael@techsol.com', name: 'Michael Chen', company: 'TechSolutions S.A.', phone: '+51 999129123', segment: 'Empresa', address: '321 Innovation Dr, San Francisco, CA' },
      { email: 'sarah@digital.com', name: 'Sarah Johnson', company: 'Digital Dynamics', phone: '+51 999129123', segment: 'VIP', address: '654 Tech Park, Austin, TX' },
      { email: 'david@innovate.com', name: 'David Brown', company: 'Innovate Labs', phone: '+51 999129123', segment: 'Empresa', address: '987 Startup St, Seattle, WA' },
      { email: 'emily@cloud.com', name: 'Emily Davis', company: 'Cloud Services Pro', phone: '+51 994429123', segment: 'Prueba', address: '147 Cloud Ave, Denver, CO' },
      { email: 'james@enterprise.com', name: 'James Wilson', company: 'Enterprise Systems', phone: '+51 999129133', segment: 'VIP', address: '258 Enterprise Way, Boston, MA' },
      { email: 'lisa@smart.com', name: 'Lisa Anderson', company: 'Smart Solutions', phone: '+51 999129123', segment: 'Empresa', address: '369 Smart Blvd, Miami, FL' },
      { email: 'thomas@global.com', name: 'Thomas Taylor', company: 'Global Tech Inc.', phone: '+51 999129123', segment: 'VIP', address: '741 Global St, Phoenix, AZ' },
      { email: 'patricia@next.com', name: 'Patricia Moore', company: 'NextGen Technologies', phone: '+51 991222223', segment: 'Empresa', address: '852 Next Ave, Dallas, TX' },
      { email: 'william@future.com', name: 'William Jackson', company: 'Future Systems', phone: '+51 999129775', segment: 'Prueba', address: '963 Future Dr, Atlanta, GA' },
    ];

    const clientRecords = [];
    for (const clientInfo of clientData) {
      const clientPassword = await bcrypt.hash('client123', 10);
      const [clientUser] = await db.insert(users).values({
        email: clientInfo.email,
        password: clientPassword,
        name: clientInfo.name,
        role: 'client',
        isActive: true,
      }).returning();

      const [clientRecord] = await db.insert(clients).values({
        userId: clientUser.id,
        company: clientInfo.company,
        phone: clientInfo.phone,
        address: clientInfo.address,
        segment: clientInfo.segment,
        status: 'Active',
      }).returning();

      clientRecords.push({ user: clientUser, record: clientRecord });
    }

    console.log(`✅ Clientes creados (${clientRecords.length} clientes)`);

    // Crear Agentes
    const agentRecords = [];
    for (const agentInfo of agentUsers) {
      const [agentRecord] = await db.insert(agents).values({
        userId: agentInfo.user.id,
        role: 'it_team',
        team: agentInfo.team,
        status: agentInfo.status,
        maxTickets: agentInfo.maxTickets,
      }).returning();
      agentRecords.push({ user: agentInfo.user, record: agentRecord });
    }

    console.log('✅ Agentes creados (9 agentes en total)');

    // Función para generar fechas variadas
    const getDate = (daysAgo: number) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date;
    };

    // Crear tickets con datos variados y realistas - Total: ~180 tickets
    // Distribución: ~40 abiertos, ~120 resueltos, ~20 en progreso/asignados
    const ticketData = [];

    // Tickets resueltos (últimos 30 días) - ~120 tickets
    // Distribuir mejor para que haya datos en todos los días
    const resolvedTickets = [];
    for (let i = 0; i < 120; i++) {
      const client = clientRecords[Math.floor(Math.random() * clientRecords.length)];
      const agent = agentRecords[Math.floor(Math.random() * agentRecords.length)];
      // Distribuir más uniformemente en los últimos 30 días
      const daysAgo = Math.floor(Math.random() * 30);
      // Tiempo de resolución: entre 1 y 7 días después de creación
      const resolutionDelay = Math.floor(Math.random() * 7) + 1;
      const resolvedDaysAgo = Math.max(0, daysAgo - resolutionDelay);
      
      const priorities = ['low', 'medium', 'high', 'urgent'];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      const subjects = [
        'Problema resuelto con autenticación',
        'Error de facturación corregido',
        'Consulta sobre funcionalidad resuelta',
        'Problema técnico solucionado',
        'Solicitud de función implementada',
        'Bug corregido en el sistema',
        'Actualización de datos completada',
        'Problema de rendimiento resuelto',
        'Integración completada exitosamente',
        'Configuración actualizada correctamente',
      ];
      
      resolvedTickets.push({
        client,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        description: `Problema resuelto satisfactoriamente. Ticket cerrado después de ${resolvedDaysAgo} días.`,
        priority,
        status: 'resolved',
        type: ['Técnico', 'Facturación', 'Consulta', 'Solicitud', 'General'][Math.floor(Math.random() * 5)],
        source: ['email', 'chat', 'portal', 'phone'][Math.floor(Math.random() * 4)],
        daysAgo,
        assignedTo: agent,
        resolvedAt: getDate(resolvedDaysAgo),
      });
    }

    // Tickets abiertos/pendientes - ~40 tickets
    // Más concentrados en los últimos días para mostrar actividad reciente
    const openTickets = [];
    for (let i = 0; i < 40; i++) {
      const client = clientRecords[Math.floor(Math.random() * clientRecords.length)];
      // Distribuir más en los últimos 7 días, pero algunos más antiguos
      const daysAgo = Math.random() < 0.7 
        ? Math.floor(Math.random() * 7)  // 70% en últimos 7 días
        : Math.floor(Math.random() * 14) + 7;  // 30% entre 7-21 días
      
      const priorities = ['low', 'medium', 'high', 'urgent'];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      const subjects = [
        'Fallo de pago en checkout',
        'Error al procesar facturas',
        'Problema con integración de pagos',
        'No se puede acceder al panel de control',
        'Problema de rendimiento en dashboard',
        'Error 500 en módulo de inventario',
        'Problema con sincronización de datos',
        'Error en reporte de ventas',
        'Problema con autenticación SSO',
        'Solicitud de API personalizada',
      ];
      
      const statuses = ['open', 'pending_director', 'assigned', 'in_progress'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const assignedTo = status === 'assigned' || status === 'in_progress' 
        ? agentRecords[Math.floor(Math.random() * agentRecords.length)]
        : null;
      
      openTickets.push({
        client,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        description: `Ticket abierto hace ${daysAgo} días. Requiere atención.`,
        priority,
        status,
        type: ['Técnico', 'Facturación', 'Consulta', 'Solicitud', 'General'][Math.floor(Math.random() * 5)],
        source: ['email', 'chat', 'portal', 'phone'][Math.floor(Math.random() * 4)],
        daysAgo,
        assignedTo,
      });
    }

    // Tickets en progreso/asignados - ~20 tickets
    const inProgressTickets = [];
    for (let i = 0; i < 20; i++) {
      const client = clientRecords[Math.floor(Math.random() * clientRecords.length)];
      const agent = agentRecords[Math.floor(Math.random() * agentRecords.length)];
      const daysAgo = Math.floor(Math.random() * 14);
      
      const priorities = ['medium', 'high', 'urgent'];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      const subjects = [
        'Problema con permisos de usuario',
        'Error al exportar reportes',
        'No recibo notificaciones por email',
        'Integración con API externa',
        'Problema con backup automático',
        'Error en cálculo de impuestos',
        'Solicitud de integración con QuickBooks',
        'Problema con sincronización en tiempo real',
        'Error al generar reportes PDF',
        'Problema con autenticación de dos factores',
      ];
      
      inProgressTickets.push({
        client,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        description: `Ticket en progreso. Asignado hace ${daysAgo} días.`,
        priority,
        status: Math.random() > 0.5 ? 'assigned' : 'in_progress',
        type: ['Técnico', 'Facturación', 'Consulta', 'Solicitud', 'General'][Math.floor(Math.random() * 5)],
        source: ['email', 'chat', 'portal', 'phone'][Math.floor(Math.random() * 4)],
        daysAgo,
        assignedTo: agent,
      });
    }

    // Combinar todos los tickets
    ticketData.push(...resolvedTickets, ...openTickets, ...inProgressTickets);

    // Insertar tickets
    let ticketCounter = 1;
    for (const ticketInfo of ticketData) {
      const createdAt = getDate(ticketInfo.daysAgo);
      const updatedAt = ticketInfo.resolvedAt || createdAt;
      
      await db.insert(tickets).values({
        ticketNumber: `TKT-${String(ticketCounter).padStart(4, '0')}`,
        subject: ticketInfo.subject,
        description: ticketInfo.description,
        clientId: ticketInfo.client.record.id,
        createdBy: ticketInfo.client.user.id,
        assignedTo: ticketInfo.assignedTo?.record.id,
        priority: ticketInfo.priority,
        status: ticketInfo.status,
        type: ticketInfo.type,
        source: ticketInfo.source,
        assignedAt: ticketInfo.assignedTo ? createdAt : null,
        resolvedAt: ticketInfo.resolvedAt || null,
        createdAt,
        updatedAt,
      });
      ticketCounter++;
    }

    // Contar tickets nuevos (últimos 7 días)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newTicketsCount = ticketData.filter(t => {
      const createdDate = getDate(t.daysAgo);
      return createdDate >= sevenDaysAgo;
    }).length;

    console.log(`✅ Tickets creados (${ticketData.length} tickets en total)`);
    console.log(`   - Resueltos: ${resolvedTickets.length}`);
    console.log(`   - Abiertos/Pendientes: ${openTickets.length}`);
    console.log(`   - En Progreso: ${inProgressTickets.length}`);
    console.log(`   - Nuevos (últimos 7 días): ${newTicketsCount}`);

    // Crear algunos comentarios
    const allTickets = await db.select().from(tickets).limit(20);
    for (let i = 0; i < Math.min(20, allTickets.length); i++) {
      const ticket = allTickets[i];
      const isResolved = ticket.status === 'resolved' || ticket.status === 'closed';
      
      if (isResolved && ticket.assignedTo) {
        // Comentario del agente
        const agent = agentRecords.find(a => a.record.id === ticket.assignedTo);
        if (agent) {
          await db.insert(comments).values({
            ticketId: ticket.id,
            userId: agent.user.id,
            content: 'Problema resuelto exitosamente. Ticket cerrado.',
            isInternal: false,
            createdAt: ticket.resolvedAt || ticket.updatedAt,
          });
        }
      } else {
        // Comentario del cliente
        const client = clientRecords.find(c => c.record.id === ticket.clientId);
        if (client) {
          await db.insert(comments).values({
            ticketId: ticket.id,
            userId: client.user.id,
            content: 'Esperando respuesta sobre este problema.',
            isInternal: false,
            createdAt: ticket.createdAt,
          });
        }
      }
    }

    console.log('✅ Comentarios creados');

    console.log('✅ Base de datos sembrada exitosamente!');
    console.log('📧 Administrador: admin@tasksystemcore.com / admin123');
    console.log('👔 Director TI: director@tasksystemcore.com / director123');
    console.log('👤 Agentes TI (9 miembros):');
    agentUsers.forEach(agent => {
      console.log(`   - ${agent.email} / agent123`);
    });
    console.log(`👤 Clientes (${clientRecords.length} clientes):`);
    clientRecords.forEach(client => {
      console.log(`   - ${client.user.email} / client123`);
    });
  } catch (error) {
    console.error('❌ Error sembrando base de datos:', error);
    throw error;
  }
}
