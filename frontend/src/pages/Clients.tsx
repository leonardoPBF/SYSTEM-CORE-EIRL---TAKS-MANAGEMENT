import { useState, useEffect } from 'react';
import { Users, Plus, Filter, Search, Building, Clock, Ticket, Mail, User as UserIcon } from 'lucide-react';
import { clientsAPI, ticketsAPI, usersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Clients = () => {
  const { darkMode } = useTheme();
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showCreateTicketDialog, setShowCreateTicketDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    segment: '',
    status: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    phone: '',
    address: '',
    segment: '',
  });
  const [ticketFormData, setTicketFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    type: 'General',
  });
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, [activeTab]);

  useEffect(() => {
    filterClients();
  }, [searchQuery, clients, activeTab]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const filters = activeTab !== 'Todos' ? { status: activeTab } : {};
      const data = await clientsAPI.getAll(filters);
      setClients(data);
      if (data.length > 0 && !selectedClient) {
        setSelectedClient(data[0]);
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = [...clients];
    
    if (activeTab !== 'Todos') {
      filtered = filtered.filter(c => c.status === activeTab);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.company?.toLowerCase().includes(query) ||
        c.phone?.toLowerCase().includes(query) ||
        c.segment?.toLowerCase().includes(query) ||
        c.name?.toLowerCase().includes(query)
      );
    }
    
    if (filters.segment) {
      filtered = filtered.filter(c => c.segment === filters.segment);
    }
    
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    
    setFilteredClients(filtered);
  };

  const clearFilters = () => {
    setFilters({ segment: '', status: '' });
  };

  const activeFiltersCount = Object.values(filters).filter(f => f !== '').length;

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.company) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      setSubmitting(true);
      
      // Primero crear el usuario
      const userResponse = await usersAPI.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'CLIENT',
      });

      // Luego crear el cliente
      await clientsAPI.create({
        userId: userResponse.id,
        company: formData.company,
        phone: formData.phone,
        address: formData.address,
        segment: formData.segment,
        status: 'Active',
      });
      
      toast.success('Cliente creado exitosamente');
      setFormData({
        name: '',
        email: '',
        password: '',
        company: '',
        phone: '',
        address: '',
        segment: '',
      });
      setShowNewClientDialog(false);
      await loadClients();
    } catch (error: any) {
      console.error('Error creando cliente:', error);
      toast.error(error?.message || 'Error al crear el cliente');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !ticketFormData.subject || !ticketFormData.description) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      setSubmitting(true);
      await ticketsAPI.create({
        subject: ticketFormData.subject,
        description: ticketFormData.description,
        clientId: selectedClient.id,
        priority: ticketFormData.priority,
        type: ticketFormData.type,
        source: 'portal',
      });
      
      toast.success('Ticket creado exitosamente');
      setTicketFormData({
        subject: '',
        description: '',
        priority: 'medium',
        type: 'General',
      });
      setShowCreateTicketDialog(false);
      navigate('/tickets');
    } catch (error: any) {
      console.error('Error creando ticket:', error);
      toast.error(error?.message || 'Error al crear el ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !emailData.subject || !emailData.message) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      setSubmitting(true);
      // Simular envío de email (aquí integrarías con tu servicio de email)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Email enviado a ${selectedClient.company}`);
      setEmailData({
        subject: '',
        message: '',
      });
      setShowEmailDialog(false);
    } catch (error: any) {
      console.error('Error enviando email:', error);
      toast.error('Error al enviar el email');
    } finally {
      setSubmitting(false);
    }
  };

  const metrics = {
    total: clients.length,
    withOpenTickets: 36,
    slaBreaches: 14,
  };

  return (
    <div className="w-full px-6">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Clientes</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Administra tus clientes y sus tickets</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{metrics.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total de Clientes</div>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">• Activo</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-orange-500">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{metrics.withOpenTickets}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Con Tickets Abiertos</div>
              <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">• Requiere atención</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-red-500">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{metrics.slaBreaches}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Incumplimientos SLA</div>
              <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">• Urgente</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="Todos">Todos</TabsTrigger>
              <TabsTrigger value="Active">Activos</TabsTrigger>
              <TabsTrigger value="At Risk">En Riesgo</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 min-w-[250px]">
              <Search size={18} className="text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar clientes..."
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
            <Button onClick={() => setShowNewClientDialog(true)}>
              <Plus size={16} className="mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Button variant="outline" size="sm" className="mr-2">
                  <Building size={16} className="mr-2" />
                  Empresa
                </Button>
                <Button variant="ghost" size="sm">
                  <Clock size={16} className="mr-2" />
                  Estado
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-purple-600 mb-3"></div>
                  <p className="text-gray-500 text-sm">Cargando clientes...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Cliente</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Empresa</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Abiertos</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Prioridad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Última Actividad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                          <tr
                            key={client.id}
                            className={cn(
                              "border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors",
                              selectedClient?.id === client.id 
                                ? "bg-blue-50 dark:bg-blue-900/20" 
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                            onClick={() => setSelectedClient(client)}
                          >
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{client.name || 'Nombre Cliente'}</span>
                                <Badge variant="secondary" className="text-xs">Propietario</Badge>
                              </div>
                            </td>
                            <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>{client.company}</td>
                            <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>{client.openTickets || 0}</td>
                            <td className="px-3 py-2">
                              <Badge 
                                variant={client.priority === 'High' ? 'destructive' : client.priority === 'Medium' ? 'default' : 'secondary'} 
                                className="text-xs"
                              >
                                {client.priority === 'High' ? 'Alta' : client.priority === 'Medium' ? 'Media' : 'Baja'}
                              </Badge>
                            </td>
                            <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                              {new Date(client.updatedAt).toLocaleDateString('es-ES')}
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-7 text-xs">Ver</Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedClient(client);
                                    setShowCreateTicketDialog(true);
                                  }}
                                >
                                  Nuevo Ticket
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-3 py-12 text-center">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No hay clientes disponibles</p>
                            <p className="text-sm text-gray-400 mt-2">Agrega un nuevo cliente para comenzar</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mostrando 1-{filteredClients.length} de {clients.length}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Anterior</Button>
                  <Button size="sm">Siguiente</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cliente Seleccionado</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedClient ? (
                <div>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">{selectedClient.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{selectedClient.phone || 'Sin teléfono'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedClient.segment || 'Sin segmento'}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Selecciona un cliente para ver detalles.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => {
                  if (!selectedClient) {
                    toast.error('Por favor seleccione un cliente primero');
                    return;
                  }
                  setShowCreateTicketDialog(true);
                }}
                disabled={!selectedClient}
              >
                <Ticket size={16} className="mr-2" />
                Crear Ticket
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  if (!selectedClient) {
                    toast.error('Por favor seleccione un cliente primero');
                    return;
                  }
                  setShowEmailDialog(true);
                }}
                disabled={!selectedClient}
              >
                <Mail size={16} className="mr-2" />
                Enviar Email
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Empresas Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clients.slice(0, 5).map((client) => (
                  <div
                    key={client.id}
                    className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setSelectedClient(client)}
                  >
                    {client.company}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diálogo para Nuevo Cliente */}
      <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Complete los datos del nuevo cliente
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateClient}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ej: juan@empresa.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña Temporal *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="company">Empresa *</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Ej: Acme Inc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1-555-0101"
                  />
                </div>

                <div>
                  <Label htmlFor="segment">Segmento</Label>
                  <Input
                    id="segment"
                    type="text"
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                    placeholder="Ej: Empresa"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Dirección completa"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowNewClientDialog(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? 'Creando...' : 'Crear Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Crear Ticket */}
      <Dialog open={showCreateTicketDialog} onOpenChange={setShowCreateTicketDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Ticket para {selectedClient?.company}</DialogTitle>
            <DialogDescription>
              Complete los detalles del ticket
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateTicket}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ticket-subject">Asunto *</Label>
                <Input
                  id="ticket-subject"
                  type="text"
                  value={ticketFormData.subject}
                  onChange={(e) => setTicketFormData({ ...ticketFormData, subject: e.target.value })}
                  placeholder="Ej: Problema con acceso"
                  required
                />
              </div>

              <div>
                <Label htmlFor="ticket-description">Descripción *</Label>
                <Textarea
                  id="ticket-description"
                  value={ticketFormData.description}
                  onChange={(e) => setTicketFormData({ ...ticketFormData, description: e.target.value })}
                  placeholder="Describa el problema o solicitud"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ticket-priority">Prioridad</Label>
                  <Select
                    id="ticket-priority"
                    value={ticketFormData.priority}
                    onChange={(e) => setTicketFormData({ ...ticketFormData, priority: e.target.value })}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ticket-type">Tipo</Label>
                  <Select
                    id="ticket-type"
                    value={ticketFormData.type}
                    onChange={(e) => setTicketFormData({ ...ticketFormData, type: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Consulta">Consulta</option>
                    <option value="Incidente">Incidente</option>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateTicketDialog(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? 'Creando...' : 'Crear Ticket'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Enviar Email */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Email a {selectedClient?.company}</DialogTitle>
            <DialogDescription>
              Escriba el mensaje que desea enviar
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSendEmail}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-subject">Asunto *</Label>
                <Input
                  id="email-subject"
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  placeholder="Asunto del email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email-message">Mensaje *</Label>
                <Textarea
                  id="email-message"
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  placeholder="Escriba su mensaje aquí"
                  rows={6}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEmailDialog(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Enviar Email'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Filtros */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrar Clientes</DialogTitle>
            <DialogDescription>
              Seleccione los filtros que desea aplicar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="filter-segment">Segmento</Label>
              <Select
                id="filter-segment"
                value={filters.segment}
                onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
              >
                <option value="">Todos los segmentos</option>
                <option value="VIP">VIP</option>
                <option value="Empresa">Empresa</option>
                <option value="Prueba">Prueba</option>
                <option value="Riesgo de Abandono">Riesgo de Abandono</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="filter-status">Estado</Label>
              <Select
                id="filter-status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Todos los estados</option>
                <option value="Active">Activo</option>
                <option value="At Risk">En Riesgo</option>
                <option value="Inactive">Inactivo</option>
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

export default Clients;
