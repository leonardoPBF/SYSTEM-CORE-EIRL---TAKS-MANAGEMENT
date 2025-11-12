import { useState, useEffect } from 'react';
import { 
  Users, 
  Filter,
  Save
} from 'lucide-react';
import { dashboardAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('Today');
  const [metrics, setMetrics] = useState({
    agentsOnline: 0,
    unassignedTickets: 0,
    queuesBreachingSoon: 0,
    avgLoadPerAgent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const agents = [
    { name: 'Leslie Alexander', open: 12, highUrgent: 4, avgTime: '9m', status: 'Online' },
    { name: 'Devon Lane', open: 7, highUrgent: 2, avgTime: '11m', status: 'Online' },
    { name: 'Jenny Wilson', open: 15, highUrgent: 6, avgTime: '13m', status: 'At Capacity' },
    { name: 'Guy Hawkins', open: 5, highUrgent: 1, avgTime: '10m', status: 'Away' },
  ];

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-semibold text-gray-900">Panel de Control</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {['Hoy', '7d', '30d'].map((range) => (
              <button
                key={range}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-gray-900 font-medium shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Users size={16} className="mr-2" />
              Todos los equipos
            </Button>
            <Button variant="outline" size="sm">
              <Users size={16} className="mr-2" />
              Rol: Administrador
            </Button>
            <Button variant="outline" size="sm">
              <Save size={16} className="mr-2" />
              Guardar Vista
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Cargando panel de control...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Agentes en Línea</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metrics.agentsOnline}</div>
                <p className="text-sm text-green-600 mt-1">+3 vs ayer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tickets Sin Asignar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metrics.unassignedTickets}</div>
                <p className="text-sm text-gray-600 mt-1">Necesitan asignación</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Colas Próximas a Incumplir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metrics.queuesBreachingSoon}</div>
                <p className="text-sm text-yellow-600 mt-1">Dentro de 1h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Carga Promedio por Agente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metrics.avgLoadPerAgent}</div>
                <p className="text-sm text-gray-600 mt-1">Objetivo ≤ 10</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actividad de Asignación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>Asignados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Reasignados</span>
                  </div>
                </div>
                <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Gráfico de barras/área
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Capacidad del Equipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <span>Disponibles</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span>En Riesgo</span>
                  </div>
                </div>
                <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Gráfico de dona
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mezcla de Prioridades (Sin Asignar)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <span>Urgente</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>Alta</span>
                  </div>
                  <span className="text-sm text-gray-400">Otros</span>
                </div>
                <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Gráfico de barras apiladas
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Tickets Sin Asignar</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter size={16} className="mr-2" />
                  Prioridad: Todas
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Contenido de tabla
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Agentes y Carga</CardTitle>
                <Button variant="outline" size="sm">
                  <Users size={16} className="mr-2" />
                  Equipo: Todos
                </Button>
              </CardHeader>
              <CardContent>
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
                      {agents.map((agent, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-900">{agent.name}</td>
                          <td className="px-3 py-2 text-sm text-gray-700">{agent.open}</td>
                          <td className="px-3 py-2 text-sm text-gray-700">{agent.highUrgent}</td>
                          <td className="px-3 py-2 text-sm text-gray-700">{agent.avgTime}</td>
                          <td className="px-3 py-2">
                            <Badge 
                              variant={
                                agent.status === 'Online' ? 'default' :
                                agent.status === 'Away' ? 'secondary' :
                                'destructive'
                              }
                              className={
                                agent.status === 'At Capacity' ? 'bg-red-100 text-red-800' : ''
                              }
                            >
                              {agent.status === 'Online' ? 'En Línea' :
                               agent.status === 'Away' ? 'Ausente' :
                               agent.status === 'At Capacity' ? 'Al Límite' : agent.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
