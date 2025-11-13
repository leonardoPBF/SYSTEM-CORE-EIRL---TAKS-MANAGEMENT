import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AgentModel } from '../models/Agent';
import { UserModel } from '../models/User';
import { AgentStatus, UserRole } from '../types';
import { db } from '../db';
import { agents, users, tickets } from '../db/schema';
import { eq, and, or, sql } from 'drizzle-orm';

export const createAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, name, email, password, team, status, maxTickets, role } = req.body;

    // Si se proporciona userId, solo crear el registro de agente
    if (userId) {
      const agent = await AgentModel.create({
        userId,
        role: role || 'IT_Team',
        team,
        status: status || AgentStatus.OFFLINE,
        maxTickets: maxTickets || 10
      });

      res.status(201).json(agent);
      return;
    }

    // Si no hay userId, crear primero el usuario y luego el agente
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Se requieren email, password y nombre para crear un nuevo agente' });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'Ya existe un usuario con ese email' });
      return;
    }

    // Crear el usuario
    const newUser = await UserModel.create({
      email,
      password,
      name,
      role: role === 'IT_Director' ? UserRole.IT_DIRECTOR : UserRole.IT_TEAM
    });

    // Crear el agente asociado
    const agent = await AgentModel.create({
      userId: newUser.id,
      role: role || 'IT_Team',
      team: team || 'Sin Equipo',
      status: status || AgentStatus.OFFLINE,
      maxTickets: maxTickets || 10
    });

    // Obtener datos completos para la respuesta
    const agentWithUser = await db.select({
      id: agents.id,
      userId: agents.userId,
      role: agents.role,
      team: agents.team,
      status: agents.status,
      maxTickets: agents.maxTickets,
      canAssignTickets: agents.canAssignTickets,
      createdAt: agents.createdAt,
      updatedAt: agents.updatedAt,
      userName: users.name,
      userEmail: users.email,
      userAvatar: users.avatar,
    }).from(agents)
    .innerJoin(users, eq(agents.userId, users.id))
    .where(eq(agents.id, agent.id))
    .limit(1);

    const result = agentWithUser[0];

    res.status(201).json({
      id: result.id,
      userId: result.userId,
      name: result.userName,
      email: result.userEmail,
      avatar: result.userAvatar,
      role: result.role.toUpperCase().replace('_', '_'),
      team: result.team || undefined,
      status: result.status.toUpperCase().replace('_', '_'),
      maxTickets: result.maxTickets,
      canAssignTickets: result.canAssignTickets || false,
      openTickets: 0,
      highPriority: 0,
      avgResponseTime: 'N/A',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  } catch (error) {
    console.error('Error en createAgent:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAgents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { team, status } = req.query;

    // Construir condiciones de filtrado
    const conditions = [];
    if (team) {
      conditions.push(eq(agents.team, team as string));
    }
    if (status) {
      conditions.push(eq(agents.status, (status as string).toLowerCase() as any));
    }

    // Obtener agentes con información del usuario
    const agentsQuery = conditions.length > 0
      ? db.select({
          id: agents.id,
          userId: agents.userId,
          role: agents.role,
          team: agents.team,
          status: agents.status,
          maxTickets: agents.maxTickets,
          canAssignTickets: agents.canAssignTickets,
          createdAt: agents.createdAt,
          updatedAt: agents.updatedAt,
          userName: users.name,
          userEmail: users.email,
          userAvatar: users.avatar,
        }).from(agents)
        .innerJoin(users, eq(agents.userId, users.id))
        .where(and(...conditions))
      : db.select({
          id: agents.id,
          userId: agents.userId,
          role: agents.role,
          team: agents.team,
          status: agents.status,
          maxTickets: agents.maxTickets,
          canAssignTickets: agents.canAssignTickets,
          createdAt: agents.createdAt,
          updatedAt: agents.updatedAt,
          userName: users.name,
          userEmail: users.email,
          userAvatar: users.avatar,
        }).from(agents)
        .innerJoin(users, eq(agents.userId, users.id));

    const agentsData = await agentsQuery;

    // Obtener estadísticas de tickets para cada agente
    const agentsWithStats = await Promise.all(agentsData.map(async (agent) => {
      // Contar tickets abiertos (open, pending_director, assigned, in_progress)
      const openTicketsResult = await db.select({ count: sql<number>`count(*)::int` })
        .from(tickets)
        .where(
          and(
            eq(tickets.assignedTo, agent.id),
            or(
              eq(tickets.status, 'open'),
              eq(tickets.status, 'pending_director'),
              eq(tickets.status, 'assigned'),
              eq(tickets.status, 'in_progress')
            )
          )
        );
      
      const openTickets = openTicketsResult[0]?.count || 0;

      // Contar tickets de alta prioridad (high, urgent)
      const highPriorityResult = await db.select({ count: sql<number>`count(*)::int` })
        .from(tickets)
        .where(
          and(
            eq(tickets.assignedTo, agent.id),
            or(
              eq(tickets.priority, 'high'),
              eq(tickets.priority, 'urgent')
            ),
            or(
              eq(tickets.status, 'open'),
              eq(tickets.status, 'pending_director'),
              eq(tickets.status, 'assigned'),
              eq(tickets.status, 'in_progress')
            )
          )
        );
      
      const highPriority = highPriorityResult[0]?.count || 0;

      return {
        id: agent.id,
        userId: agent.userId,
        name: agent.userName,
        email: agent.userEmail,
        avatar: agent.userAvatar,
        role: agent.role.toUpperCase().replace('_', '_'),
        team: agent.team || undefined,
        status: agent.status.toUpperCase().replace('_', '_'),
        maxTickets: agent.maxTickets,
        canAssignTickets: agent.canAssignTickets || false,
        openTickets,
        highPriority,
        avgResponseTime: '2.5h', // Placeholder - calcular en el futuro
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
      };
    }));

    res.json(agentsWithStats);
  } catch (error) {
    console.error('Error en getAgents:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAgentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const agent = await AgentModel.findById(id);

    if (!agent) {
      res.status(404).json({ error: 'Agente no encontrado' });
      return;
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const agent = await AgentModel.update(id, updateData);
    if (!agent) {
      res.status(404).json({ error: 'Agente no encontrado' });
      return;
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteAgent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await AgentModel.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Agente no encontrado' });
      return;
    }

    res.json({ message: 'Agente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

