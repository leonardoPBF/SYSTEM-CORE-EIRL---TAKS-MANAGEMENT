# TaskSystemCore EIRL - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "Client" // Optional: Admin, Agent, Client, Manager
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "Client"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "Client",
    "avatar": null
  },
  "token": "jwt-token"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

---

### Tickets

#### GET /api/tickets
Get all tickets (with optional filters).

**Query Parameters:**
- `clientId` - Filter by client ID
- `assignedTo` - Filter by agent ID
- `status` - Filter by status (Open, Assigned, In Progress, Resolved, Closed)
- `priority` - Filter by priority (Low, Medium, High, Urgent)
- `queue` - Filter by queue

#### GET /api/tickets/:id
Get ticket by ID.

#### GET /api/tickets/unassigned
Get all unassigned tickets.

#### POST /api/tickets
Create a new ticket.

**Request Body:**
```json
{
  "subject": "Ticket Subject",
  "description": "Ticket description",
  "clientId": "client-uuid",
  "priority": "High", // Optional: Low, Medium, High, Urgent
  "type": "Technical", // Optional
  "source": "Email", // Optional: Email, Phone, Chat, Portal, API
  "tags": ["tag1", "tag2"], // Optional
  "queue": "queue-name" // Optional
}
```

#### PUT /api/tickets/:id
Update a ticket.

#### PUT /api/tickets/:id/assign
Assign ticket to an agent.

**Request Body:**
```json
{
  "assignedTo": "agent-uuid"
}
```

#### DELETE /api/tickets/:id
Delete a ticket (Admin/Manager only).

---

### Clients

#### GET /api/clients
Get all clients (with optional filters).

**Query Parameters:**
- `status` - Filter by status (Active, At Risk, Inactive)
- `segment` - Filter by segment

#### GET /api/clients/:id
Get client by ID.

#### POST /api/clients
Create a new client (Admin/Manager only).

**Request Body:**
```json
{
  "userId": "user-uuid",
  "company": "Company Name",
  "phone": "+1-555-0101", // Optional
  "address": "Address", // Optional
  "segment": "Enterprise", // Optional
  "status": "Active" // Optional: Active, At Risk, Inactive
}
```

#### PUT /api/clients/:id
Update a client.

#### DELETE /api/clients/:id
Delete a client (Admin only).

---

### Agents

#### GET /api/agents
Get all agents (with optional filters).

**Query Parameters:**
- `team` - Filter by team
- `status` - Filter by status (Online, Away, Offline, At Capacity)

#### GET /api/agents/:id
Get agent by ID.

#### POST /api/agents
Create a new agent (Admin/Manager only).

**Request Body:**
```json
{
  "userId": "user-uuid",
  "team": "Support Team 1", // Optional
  "status": "Offline", // Optional: Online, Away, Offline, At Capacity
  "maxTickets": 10 // Optional
}
```

#### PUT /api/agents/:id
Update an agent.

#### DELETE /api/agents/:id
Delete an agent.

---

### Comments

#### GET /api/comments/ticket/:ticketId
Get all comments for a ticket.

#### POST /api/comments
Create a new comment.

**Request Body:**
```json
{
  "ticketId": "ticket-uuid",
  "content": "Comment content",
  "isInternal": false, // Optional
  "attachments": [] // Optional
}
```

#### PUT /api/comments/:id
Update a comment.

#### DELETE /api/comments/:id
Delete a comment.

---

### Dashboard

#### GET /api/dashboard/metrics
Get dashboard metrics.

**Response:**
```json
{
  "agentsOnline": 21,
  "unassignedTickets": 37,
  "queuesBreachingSoon": 5,
  "avgLoadPerAgent": 8.4,
  "newTickets": 1248,
  "resolvedTickets": 1102,
  "backlog": 146
}
```

---

## Default Users (from seeders)

### Admin
- Email: `admin@tasksystemcore.com`
- Password: `admin123`

### Agent
- Email: `leslie@tasksystemcore.com`
- Password: `agent123`

### Client
- Email: `jane@acme.com`
- Password: `client123`

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

