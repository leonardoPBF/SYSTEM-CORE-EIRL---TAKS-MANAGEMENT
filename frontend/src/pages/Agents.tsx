import { useState, useEffect } from 'react';
import { UserCog, Users } from 'lucide-react';
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

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Agentes</h1>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Users size={16} className="mr-2" />
            Equipo: Todos
          </Button>
          <Button>
            <UserCog size={16} className="mr-2" />
            Agregar Agente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Agentes y Carga</CardTitle>
          <Button variant="outline" size="sm">
            <Users size={16} className="mr-2" />
            Equipo: Todos
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando agentes...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Agente</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Abiertos</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Alta/Urgente</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Tiempo Promedio Primera Respuesta</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">Nombre Agente</td>
                      <td className="px-3 py-2 text-sm text-gray-700">12</td>
                      <td className="px-3 py-2 text-sm text-gray-700">4</td>
                      <td className="px-3 py-2 text-sm text-gray-700">9m</td>
                      <td className="px-3 py-2">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Agents;
