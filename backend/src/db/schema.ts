import { pgTable, uuid, varchar, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'it_director', 'it_team', 'client']);
export const ticketStatusEnum = pgEnum('ticket_status', ['open', 'pending_director', 'assigned', 'in_progress', 'resolved', 'closed']);
export const ticketPriorityEnum = pgEnum('ticket_priority', ['low', 'medium', 'high', 'urgent']);
export const ticketSourceEnum = pgEnum('ticket_source', ['email', 'chat', 'phone', 'portal', 'api']);
export const agentStatusEnum = pgEnum('agent_status', ['online', 'away', 'offline', 'at_capacity']);

// Tabla de Usuarios
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
  avatar: varchar('avatar', { length: 500 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabla de Clientes
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  segment: varchar('segment', { length: 100 }),
  status: varchar('status', { length: 50 }).default('Active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabla de Agentes
export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: varchar('role', { length: 50 }).default('it_team').notNull(),
  team: varchar('team', { length: 255 }),
  status: agentStatusEnum('status').default('offline').notNull(),
  maxTickets: integer('max_tickets').default(10).notNull(),
  canAssignTickets: boolean('can_assign_tickets').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabla de Tickets
export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticketNumber: varchar('ticket_number', { length: 50 }).notNull().unique(),
  subject: varchar('subject', { length: 500 }).notNull(),
  description: text('description').notNull(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  assignedTo: uuid('assigned_to').references(() => agents.id),
  priority: ticketPriorityEnum('priority').default('medium').notNull(),
  status: ticketStatusEnum('status').default('open').notNull(),
  type: varchar('type', { length: 100 }),
  source: ticketSourceEnum('source').default('portal').notNull(),
  tags: text('tags').array(),
  queue: varchar('queue', { length: 255 }),
  sla: varchar('sla', { length: 255 }),
  dueDate: timestamp('due_date'),
  reviewedAt: timestamp('reviewed_at'),
  assignedAt: timestamp('assigned_at'),
  resolvedAt: timestamp('resolved_at'),
  closedAt: timestamp('closed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabla de Comentarios
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticketId: uuid('ticket_id').references(() => tickets.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  isInternal: boolean('is_internal').default(false).notNull(),
  attachments: text('attachments').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relaciones
export const usersRelations = relations(users, ({ one, many }) => ({
  client: one(clients, {
    fields: [users.id],
    references: [clients.userId],
  }),
  agent: one(agents, {
    fields: [users.id],
    references: [agents.userId],
  }),
  comments: many(comments),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  tickets: many(tickets),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  client: one(clients, {
    fields: [tickets.clientId],
    references: [clients.id],
  }),
  agent: one(agents, {
    fields: [tickets.assignedTo],
    references: [agents.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  ticket: one(tickets, {
    fields: [comments.ticketId],
    references: [tickets.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

