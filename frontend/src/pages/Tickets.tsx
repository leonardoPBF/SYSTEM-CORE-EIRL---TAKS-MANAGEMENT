import { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  Filter, 
  Search,
  User,
  Clock,
  Tag,
  ExternalLink
} from 'lucide-react';
import { ticketsAPI, clientsAPI, agentsAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    source: '',
  });
  const [clients, setClients] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    clientId: '',
    priority: 'medium',
    type: 'General',
    source: 'portal',
  });
  const [assignData, setAssignData] = useState({
    agentId: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTickets();
    loadClients();
    loadAgents();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [searchQuery, tickets, filters]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketsAPI.getAll();
      setTickets(data);
      if (data.length > 0 && !selectedTicket) {
        setSelectedTicket(data[0]);
      }
    } catch (error) {
      console.error('Error cargando tickets:', error);
      toast.error('Error al cargar tickets');
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const loadAgents = async () => {
    try {
      const data = await agentsAPI.getAll();
      setAgents(data);
    } catch (error) {
      console.error('Error cargando agentes:', error);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.ticketNumber?.toLowerCase().includes(query) ||
        t.subject?.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.type?.toLowerCase().includes(query)
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    
    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }
    
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    if (filters.source) {
      filtered = filtered.filter(t => t.source === filters.source);
    }
    
    setFilteredTickets(filtered);
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', type: '', source: '' });
  };

  const activeFiltersCount = Object.values(filters).filter(f => f !== '').length;

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description || !formData.clientId) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      setSubmitting(true);
      await ticketsAPI.create({
        subject: formData.subject,
        description: formData.description,
        clientId: formData.clientId,
        priority: formData.priority,
        type: formData.type,
        source: formData.source,
      });
      
      toast.success('Ticket creado exitosamente');
      setFormData({
        subject: '',
        description: '',
        clientId: '',
        priority: 'medium',
        type: 'General',
        source: 'portal',
      });
      setShowNewTicketDialog(false);
      await loadTickets();
    } catch (error: any) {
      console.error('Error creando ticket:', error);
      toast.error(error?.message || 'Error al crear el ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewTicket = async () => {
    if (!selectedTicket) {
      toast.error('Por favor seleccione un ticket');
      return;
    }

    try {
      setSubmitting(true);
      const updated = await ticketsAPI.review(selectedTicket.id);
      setSelectedTicket(updated);
      await loadTickets();
      toast.success('Ticket marcado para revisión por Director TI');
    } catch (error: any) {
      console.error('Error revisando ticket:', error);
      toast.error(error?.message || 'Error al revisar el ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTicket || !assignData.agentId) {
      toast.error('Por favor seleccione un agente');
      return;
    }

    try {
      setSubmitting(true);
      const updated = await ticketsAPI.assign(selectedTicket.id, assignData.agentId);
      setSelectedTicket(updated);
      setAssignData({ agentId: '' });
      setShowAssignDialog(false);
      await loadTickets();
      toast.success('Ticket asignado exitosamente');
    } catch (error: any) {
      console.error('Error asignando ticket:', error);
      toast.error(error?.message || 'Error al asignar el ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      'Low': 'Baja',
      'Medium': 'Media',
      'High': 'Alta',
      'Urgent': 'Urgente'
    };
    return labels[priority] || priority;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'Open': 'Abierto',
      'Pending_Director': 'Pendiente Director TI',
      'Assigned': 'Asignado',
      'In Progress': 'En Progreso',
      'Resolved': 'Resuelto',
      'Closed': 'Cerrado'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'Pending_Director':
        return 'bg-yellow-100 text-yellow-800';
      case 'Assigned':
      case 'In Progress':
        return 'bg-green-100 text-green-800';
      case 'Resolved':
        return 'bg-gray-100 text-gray-800';
      case 'Closed':
        return 'bg-gray-200 text-gray-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canReview = user?.role === 'IT_DIRECTOR' || user?.role === 'ADMIN';
  const canAssign = user?.role === 'IT_DIRECTOR' || user?.role === 'ADMIN';

  return (
    <div className="w-full px-6">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
            <Ticket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Tickets</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Administra y resuelve tickets de soporte</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="hover:scale-105 transition-transform">
            <Ticket size={16} className="mr-2" />
            Ver Todos
          </Button>
          <Button 
            onClick={() => setShowNewTicketDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-transform"
          >
            <Plus size={16} className="mr-2" />
            Nuevo Ticket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2">
                <Search size={18} className="text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilterDialog(true)}
              >
                <Filter size={16} className="mr-2" />
                Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-600 mb-3"></div>
                <p className="text-gray-500 text-sm">Cargando tickets...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-colors",
                        selectedTicket?.id === ticket.id
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300"
                      )}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {ticket.ticketNumber} {ticket.subject}
                        </h3>
                        <Badge
                          variant={
                            ticket.priority === 'Urgent' ? 'destructive' :
                            ticket.priority === 'High' ? 'default' :
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {getPriorityLabel(ticket.priority)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <span>{ticket.clientCompany || 'Cliente'}</span>
                        <span>•</span>
                        <span>{ticket.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={cn("text-xs", getStatusColor(ticket.status))}>
                          {getStatusLabel(ticket.status)}
                        </Badge>
                        {ticket.assignedTo && (
                          <span className="text-xs text-gray-500">Asignado</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No hay tickets disponibles</p>
                    <p className="text-sm text-gray-400 mt-2">Crea un nuevo ticket para comenzar</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedTicket && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {selectedTicket.ticketNumber} {selectedTicket.subject}
                </CardTitle>
                <Badge className={cn("text-xs", getStatusColor(selectedTicket.status))}>
                  {getStatusLabel(selectedTicket.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Cliente:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{selectedTicket.clientCompany || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Prioridad:</span>
                  <Badge variant={selectedTicket.priority === 'High' || selectedTicket.priority === 'Urgent' ? 'default' : 'secondary'}>
                    {getPriorityLabel(selectedTicket.priority)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{selectedTicket.type}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Fuente:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{selectedTicket.source}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Creado:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(selectedTicket.createdAt).toLocaleString('es-ES')}
                  </span>
                </div>
                <div className="py-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Descripción:</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedTicket.description}</p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Flujo del Ticket</h3>
                <div className="space-y-3 mb-4">
                  <div className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    selectedTicket.status === 'Open' 
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" 
                      : "bg-gray-50 dark:bg-gray-800"
                  )}>
                    <User size={18} className={selectedTicket.status === 'Open' ? "text-blue-600" : "text-gray-400"} />
                    <div>
                      <p className={cn(
                        "text-sm font-medium",
                        selectedTicket.status === 'Open' ? "text-gray-900 dark:text-gray-100" : "text-gray-500"
                      )}>
                        1. Cliente crea ticket
                      </p>
                      <p className="text-xs text-gray-500">Estado: Abierto</p>
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    selectedTicket.status === 'Pending_Director' 
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" 
                      : "bg-gray-50 dark:bg-gray-800"
                  )}>
                    <Clock size={18} className={selectedTicket.status === 'Pending_Director' ? "text-yellow-600" : "text-gray-400"} />
                    <div>
                      <p className={cn(
                        "text-sm font-medium",
                        selectedTicket.status === 'Pending_Director' ? "text-gray-900 dark:text-gray-100" : "text-gray-500"
                      )}>
                        2. Director TI revisa
                      </p>
                      <p className="text-xs text-gray-500">Estado: Pendiente Director TI</p>
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    selectedTicket.status === 'Assigned' || selectedTicket.status === 'In Progress' 
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                      : "bg-gray-50 dark:bg-gray-800"
                  )}>
                    <Tag size={18} className={selectedTicket.status === 'Assigned' || selectedTicket.status === 'In Progress' ? "text-green-600" : "text-gray-400"} />
                    <div>
                      <p className={cn(
                        "text-sm font-medium",
                        selectedTicket.status === 'Assigned' || selectedTicket.status === 'In Progress' ? "text-gray-900 dark:text-gray-100" : "text-gray-500"
                      )}>
                        3. Asignado a Equipo TI
                      </p>
                      <p className="text-xs text-gray-500">Estado: Asignado/En Progreso</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  {canReview && selectedTicket.status === 'Open' && (
                    <Button 
                      variant="outline"
                      onClick={handleReviewTicket}
                      disabled={submitting}
                    >
                      <User size={16} className="mr-2" />
                      Revisar como Director
                    </Button>
                  )}
                  {canAssign && (selectedTicket.status === 'Pending_Director' || selectedTicket.status === 'Open') && (
                    <Button
                      onClick={() => setShowAssignDialog(true)}
                      disabled={submitting}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Asignar a Equipo TI
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Tickets Similares</h3>
                <div className="space-y-3">
                  {tickets
                    .filter(t => t.id !== selectedTicket.id && (t.type === selectedTicket.type || t.priority === selectedTicket.priority))
                    .slice(0, 2)
                    .map((ticket) => (
                      <div key={ticket.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setSelectedTicket(ticket)}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{ticket.ticketNumber}</span>
                          <Badge className={cn("text-xs", getStatusColor(ticket.status))}>
                            {getStatusLabel(ticket.status)}
                          </Badge>
                        </div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{ticket.subject}</p>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{ticket.type} • {getPriorityLabel(ticket.priority)}</span>
                      </div>
                    ))}
                  {tickets.filter(t => t.id !== selectedTicket.id && (t.type === selectedTicket.type || t.priority === selectedTicket.priority)).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No hay tickets similares</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Diálogo para Nuevo Ticket */}
      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Ticket</DialogTitle>
            <DialogDescription>
              Complete los detalles del ticket para enviarlo al equipo de soporte
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateTicket}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientId">Cliente *</Label>
                <Select
                  id="clientId"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.company || client.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Asunto *</Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Ej: Problema con acceso al sistema"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describa detalladamente el problema o solicitud"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Consulta">Consulta</option>
                    <option value="Incidente">Incidente</option>
                    <option value="Solicitud">Solicitud</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="source">Fuente</Label>
                <Select
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                >
                  <option value="portal">Portal</option>
                  <option value="email">Email</option>
                  <option value="phone">Teléfono</option>
                  <option value="chat">Chat</option>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowNewTicketDialog(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? 'Creando...' : 'Crear Ticket'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Asignar Ticket */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Ticket a Equipo TI</DialogTitle>
            <DialogDescription>
              Seleccione el agente al que desea asignar este ticket
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAssignTicket}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="agentId">Agente *</Label>
                <Select
                  id="agentId"
                  value={assignData.agentId}
                  onChange={(e) => setAssignData({ agentId: e.target.value })}
                  required
                >
                  <option value="">Seleccione un agente</option>
                  {agents
                    .filter(a => a.status === 'ONLINE' || a.status === 'AWAY')
                    .map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} - {agent.team || 'Sin equipo'} ({agent.openTickets}/{agent.maxTickets})
                      </option>
                    ))}
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Solo se muestran agentes disponibles
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAssignDialog(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? 'Asignando...' : 'Asignar Ticket'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Filtros */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrar Tickets</DialogTitle>
            <DialogDescription>
              Seleccione los filtros que desea aplicar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="filter-status">Estado</Label>
              <Select
                id="filter-status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Todos los estados</option>
                <option value="open">Abierto</option>
                <option value="pending_director">Pendiente Director TI</option>
                <option value="assigned">Asignado</option>
                <option value="in_progress">En Progreso</option>
                <option value="resolved">Resuelto</option>
                <option value="closed">Cerrado</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-priority">Prioridad</Label>
              <Select
                id="filter-priority"
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              >
                <option value="">Todas las prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-type">Tipo</Label>
              <Select
                id="filter-type"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">Todos los tipos</option>
                <option value="Técnico">Técnico</option>
                <option value="Facturación">Facturación</option>
                <option value="Consulta">Consulta</option>
                <option value="Solicitud">Solicitud</option>
                <option value="General">General</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-source">Origen</Label>
              <Select
                id="filter-source"
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              >
                <option value="">Todos los orígenes</option>
                <option value="email">Email</option>
                <option value="chat">Chat</option>
                <option value="portal">Portal</option>
                <option value="phone">Teléfono</option>
                <option value="api">API</option>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
            <Button onClick={() => setShowFilterDialog(false)}>
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tickets;
