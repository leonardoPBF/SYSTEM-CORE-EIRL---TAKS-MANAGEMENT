import { useState, useEffect } from 'react';
import { UserCog, Users, Plus, Filter } from 'lucide-react';
import { agentsAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Agent {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  team?: string;
  status: string;
  maxTickets: number;
  openTickets: number;
  highPriority: number;
  avgResponseTime: string;
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'IT_Team',
    team: '',
    status: 'offline',
    maxTickets: 10,
  });

  useEffect(() => {
    loadAgents();
  }, [teamFilter, statusFilter]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (teamFilter) filters.team = teamFilter;
      if (statusFilter) filters.status = statusFilter;
      
      const data = await agentsAPI.getAll(filters);
      setAgents(data);
    } catch (error) {
      console.error('Error cargando agentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueTeams = () => {
    const teams = agents.map(a => a.team).filter(Boolean);
    return [...new Set(teams)];
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      setSubmitting(true);
      await agentsAPI.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        team: formData.team || 'Sin Equipo',
        status: formData.status,
        maxTickets: formData.maxTickets,
      });
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'IT_Team',
        team: '',
        status: 'offline',
        maxTickets: 10,
      });
      
      // Cerrar diálogo y recargar agentes
      setShowNewAgentDialog(false);
      await loadAgents();
      
      alert('Agente creado exitosamente');
    } catch (error: any) {
      console.error('Error creando agente:', error);
      alert(error?.message || 'Error al crear el agente. Por favor intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'ONLINE': 'En Línea',
      'AWAY': 'Ausente',
      'OFFLINE': 'Desconectado',
      'AT_CAPACITY': 'Al Límite'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'AWAY':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'AT_CAPACITY':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'IT_DIRECTOR': 'Director TI',
      'IT_TEAM': 'Equipo TI',
      'ADMIN': 'Administrador'
    };
    return labels[role] || role;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full px-6">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
            <UserCog className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipo de TI</h1>
            <p className="text-sm text-gray-500 mt-1">Director TI y Equipo Técnico</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:scale-105 transition-transform"
            onClick={() => setTeamFilter('')}
          >
            <Filter size={16} className="mr-2" />
            {teamFilter ? `Equipo: ${teamFilter}` : 'Todos los Equipos'}
          </Button>
          <Button 
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 transition-transform"
            onClick={() => setShowNewAgentDialog(true)}
          >
            <Plus size={16} className="mr-2" />
            Agregar Miembro TI
          </Button>
        </div>
      </div>

      {/* Estadísticas Generales */}
      {!loading && agents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Agentes</p>
                  <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Línea</p>
                  <p className="text-2xl font-bold text-green-600">
                    {agents.filter(a => a.status === 'ONLINE').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agents.reduce((sum, a) => sum + a.openTickets, 0)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UserCog className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alta Prioridad</p>
                  <p className="text-2xl font-bold text-red-600">
                    {agents.reduce((sum, a) => sum + a.highPriority, 0)}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <span className="text-xl">⚠️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-base">
            Equipo de TI - {agents.length} {agents.length === 1 ? 'Miembro' : 'Miembros'}
          </CardTitle>
          <div className="flex gap-2">
            {getUniqueTeams().map(team => (
              <Button 
                key={team}
                variant={teamFilter === team ? "default" : "outline"} 
                size="sm"
                onClick={() => setTeamFilter(teamFilter === team ? '' : team || '')}
              >
                {team}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-green-600 mb-3"></div>
              <p className="text-gray-500 text-sm">Cargando agentes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agents.length > 0 ? agents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {getInitials(agent.name)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                          <p className="text-xs text-gray-500">{getRoleLabel(agent.role)}</p>
                          {agent.team && (
                            <p className="text-xs text-blue-600 mt-0.5">{agent.team}</p>
                          )}
                        </div>
                      </div>
                      <Badge className={`text-xs border ${getStatusColor(agent.status)}`}>
                        {getStatusLabel(agent.status)}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Tickets Abiertos</span>
                        <span className="font-semibold text-gray-900">{agent.openTickets}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Alta/Urgente</span>
                        <Badge variant="destructive" className="text-xs">
                          {agent.highPriority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Capacidad</span>
                        <span className="text-sm font-medium">
                          {agent.openTickets}/{agent.maxTickets}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Tiempo Promedio</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {agent.avgResponseTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.location.href = `mailto:${agent.email}`}
                      >
                        Contactar
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={agent.status === 'AT_CAPACITY' || agent.status === 'OFFLINE'}
                      >
                        Asignar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-12">
                  <UserCog className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No hay agentes disponibles</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {teamFilter && 'No hay agentes en este equipo'}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para Nuevo Agente */}
      <Dialog open={showNewAgentDialog} onOpenChange={setShowNewAgentDialog}>
        <DialogContent onClose={() => setShowNewAgentDialog(false)}>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Miembro del Equipo TI</DialogTitle>
            <DialogDescription>
              Complete los datos del nuevo agente de soporte técnico
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateAgent}>
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
                <Label htmlFor="email">Email Corporativo *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ej: juan.perez@tasksystemcore.com"
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
                  placeholder="Contraseña inicial (mínimo 6 caracteres)"
                  minLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  El usuario deberá cambiarla en su primer inicio de sesión
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="IT_Team">Equipo TI</option>
                    <option value="IT_Director">Director TI</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Estado Inicial</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="offline">Desconectado</option>
                    <option value="online">En Línea</option>
                    <option value="away">Ausente</option>
                    <option value="at_capacity">Al Límite</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="team">Equipo de Soporte</Label>
                <Input
                  id="team"
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  placeholder="Ej: Equipo de Soporte 1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deja vacío para asignar "Sin Equipo"
                </p>
              </div>

              <div>
                <Label htmlFor="maxTickets">Capacidad Máxima de Tickets</Label>
                <Input
                  id="maxTickets"
                  type="number"
                  min={1}
                  max={50}
                  value={formData.maxTickets}
                  onChange={(e) => setFormData({ ...formData, maxTickets: parseInt(e.target.value) || 10 })}
                  placeholder="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Número máximo de tickets que puede manejar simultáneamente
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowNewAgentDialog(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? 'Creando...' : 'Crear Agente'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Agents;
