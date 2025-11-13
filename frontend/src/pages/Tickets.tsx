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
import { ticketsAPI, clientsAPI } from '@/services/api';
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

const Tickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    clientId: '',
    priority: 'medium',
    type: 'General',
    source: 'portal',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTickets();
    loadClients();
  }, []);

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

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description || !formData.clientId) {
      alert('Por favor complete todos los campos requeridos');
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
      
      // Limpiar formulario
      setFormData({
        subject: '',
        description: '',
        clientId: '',
        priority: 'medium',
        type: 'General',
        source: 'portal',
      });
      
      // Cerrar diálogo y recargar tickets
      setShowNewTicketDialog(false);
      await loadTickets();
      
      alert('Ticket creado exitosamente');
    } catch (error) {
      console.error('Error creando ticket:', error);
      alert('Error al crear el ticket. Por favor intente nuevamente.');
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
      'Assigned': 'Asignado a Equipo TI',
      'In Progress': 'En Progreso',
      'Resolved': 'Resuelto',
      'Closed': 'Cerrado'
    };
    return labels[status] || status;
  };

  return (
    <div className="w-full px-6">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
            <Ticket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Tickets</h1>
            <p className="text-sm text-gray-500 mt-1">Administra y resuelve tickets de soporte</p>
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
              <div className="relative flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                <Search size={18} className="text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar tickets..."
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                Filtros
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
                {tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-colors",
                        selectedTicket?.id === ticket.id
                          ? "bg-blue-50 border-blue-500"
                          : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      )}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">
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
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <span>{ticket.clientCompany || 'Cliente'}</span>
                        <span>•</span>
                        <span>{ticket.type}</span>
                      </div>
                      <div className="text-xs">
                        {ticket.assignedTo ? (
                          <span className="text-green-600">{getStatusLabel(ticket.status)}</span>
                        ) : (
                          <span className="text-gray-400">Sin Asignar</span>
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
                <Badge variant="secondary">Sin Asignar</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium text-gray-600">Cliente:</span>
                  <span className="text-sm text-gray-900">{selectedTicket.clientCompany || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium text-gray-600">Prioridad:</span>
                  <Badge variant={selectedTicket.priority === 'High' ? 'default' : 'secondary'}>
                    {getPriorityLabel(selectedTicket.priority)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium text-gray-600">Tipo:</span>
                  <span className="text-sm text-gray-900">{selectedTicket.type}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium text-gray-600">Fuente:</span>
                  <span className="text-sm text-gray-900">{selectedTicket.source}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium text-gray-600">Creado:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(selectedTicket.createdAt).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Flujo del Ticket</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <User size={18} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">1. Cliente crea ticket</p>
                      <p className="text-xs text-gray-500">Estado: Abierto</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock size={18} className="text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">2. Director TI revisa</p>
                      <p className="text-xs text-gray-500">Estado: Pendiente Director TI</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Tag size={18} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">3. Asignado a Equipo TI</p>
                      <p className="text-xs text-gray-500">Estado: Asignado/En Progreso</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <User size={16} className="mr-2" />
                    Revisar como Director
                  </Button>
                  <Button>
                    <ExternalLink size={16} className="mr-2" />
                    Asignar a Equipo TI
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Tickets Similares</h3>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">#4821</span>
                      <Badge className="bg-green-100 text-green-800">Resuelto</Badge>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">Fallo de pago en plan anual</p>
                    <span className="text-xs text-gray-600">Facturación • Fallo 3D Secure</span>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">#4739</span>
                      <span className="text-xs text-gray-400">Abierto</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">Tarjeta rechazada por el banco</p>
                    <span className="text-xs text-gray-600">Pagos • Validación necesaria</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Diálogo para Nuevo Ticket */}
      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent onClose={() => setShowNewTicketDialog(false)}>
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
    </div>
  );
};

export default Tickets;
