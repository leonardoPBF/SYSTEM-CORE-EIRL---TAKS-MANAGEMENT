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
import { ticketsAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Tickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
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
      'Assigned': 'Asignado',
      'In Progress': 'En Progreso',
      'Resolved': 'Resuelto',
      'Closed': 'Cerrado'
    };
    return labels[status] || status;
  };

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-semibold text-gray-900">Ticket Creado</h1>
          <Badge className="bg-yellow-100 text-yellow-800">Nuevo</Badge>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Ticket size={16} className="mr-2" />
            Ver Todos los Tickets
          </Button>
          <Button>
            <Plus size={16} className="mr-2" />
            Abrir Ticket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              <div className="text-center py-8 text-gray-500">Cargando tickets...</div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
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
                ))}
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
                <h3 className="text-base font-semibold text-gray-900 mb-4">Próximas Acciones</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <User size={18} />
                    <span>Asignar a un agente</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Clock size={18} />
                    <span>Establecer SLA para primera respuesta</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Tag size={18} />
                    <span>Agregar etiquetas para facturación, pago</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <User size={16} className="mr-2" />
                    Asignar
                  </Button>
                  <Button>
                    <ExternalLink size={16} className="mr-2" />
                    Enviar Primera Respuesta
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
    </div>
  );
};

export default Tickets;
