import { useState, useEffect } from 'react';
import { UserCog, Users, Mail, Phone, Clock, TrendingUp, Award } from 'lucide-react';
import { agentsAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Agents = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await agentsAPI.getAll();
      setAgents(data);
    } catch (error) {
      console.error('Error cargando agentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'Online': 'En Línea',
      'Away': 'Ausente',
      'Offline': 'Desconectado',
      'At Capacity': 'Al Límite'
    };
    return labels[status] || status;
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'IT_Director': 'Director TI',
      'IT_Team': 'Equipo TI',
      'Admin': 'Administrador'
    };
    return labels[role] || role;
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
          <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
            <Users size={16} className="mr-2" />
            Equipo: Todos
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 transition-transform">
            <UserCog size={16} className="mr-2" />
            Agregar Miembro TI
          </Button>
        </div>
      </div>

      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-base">Director TI y Equipo Técnico</CardTitle>
          <Button variant="outline" size="sm">
            <Users size={16} className="mr-2" />
            Equipo: Todos
          </Button>
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
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                          {agent.name?.charAt(0) || 'T'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{agent.name || `Miembro ${agent.id}`}</h3>
                          <p className="text-xs text-gray-500">{getRoleLabel(agent.role || 'IT_Team')}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          agent.status === 'Online' ? 'default' :
                          agent.status === 'Away' ? 'secondary' :
                          agent.status === 'At Capacity' ? 'destructive' :
                          'secondary'
                        }
                        className={
                          agent.status === 'Online' ? 'bg-green-100 text-green-800' :
                          agent.status === 'Away' ? 'bg-yellow-100 text-yellow-800' :
                          agent.status === 'At Capacity' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {getStatusLabel(agent.status || 'Offline')}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Tickets Abiertos</span>
                        <span className="font-semibold text-gray-900">{agent.openTickets || 0}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Alta/Urgente</span>
                        <Badge variant="destructive" className="text-xs">{agent.highPriority || 0}</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Tiempo Promedio</span>
                        <span className="font-semibold text-gray-900">{agent.avgResponseTime || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver Detalles
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        Asignar Ticket
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No hay agentes disponibles
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Agents;
