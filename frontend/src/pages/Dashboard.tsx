import { useState, useEffect } from 'react';
import { 
  Users, 
  Filter,
  Save,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Activity
} from 'lucide-react';
import { dashboardAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [timeRange, setTimeRange] = useState('30d');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [showTeamFilter, setShowTeamFilter] = useState(false);
  const [metrics, setMetrics] = useState({
    agentsOnline: 0,
    unassignedTickets: 0,
    queuesBreachingSoon: 0,
    avgLoadPerAgent: 0
  });
  const [assignmentActivity, setAssignmentActivity] = useState<any[]>([]);
  const [teamCapacity, setTeamCapacity] = useState({ available: 0, atRisk: 0, total: 0 });
  const [unassignedPriorities, setUnassignedPriorities] = useState({ urgent: 0, high: 0, medium: 0, low: 0, total: 0 });
  const [unassignedTickets, setUnassignedTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [metricsData, activityData, capacityData, prioritiesData, ticketsData] = await Promise.all([
        dashboardAPI.getMetrics(),
        dashboardAPI.getAssignmentActivity(),
        dashboardAPI.getTeamCapacity(),
        dashboardAPI.getUnassignedPriorities(),
        dashboardAPI.getUnassignedTickets()
      ]);
      
      setMetrics(metricsData);
      setAssignmentActivity(activityData);
      setTeamCapacity(capacityData);
      setUnassignedPriorities(prioritiesData);
      setUnassignedTickets(ticketsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const agents = [
    { name: 'Leslie Alexander', role: 'IT_Director', open: 12, highUrgent: 4, avgTime: '9m', status: 'Online' },
    { name: 'Devon Lane', role: 'IT_Team', open: 7, highUrgent: 2, avgTime: '11m', status: 'Online' },
    { name: 'Jenny Wilson', role: 'IT_Team', open: 15, highUrgent: 6, avgTime: '13m', status: 'At Capacity' },
    { name: 'Guy Hawkins', role: 'IT_Team', open: 5, highUrgent: 1, avgTime: '10m', status: 'Away' },
  ];

  // Datos para gráfico de dona (capacidad del equipo)
  const capacityData = [
    { name: 'Disponibles', value: teamCapacity.available },
    { name: 'En Riesgo', value: teamCapacity.atRisk },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  // Datos para gráfico de barras apiladas (prioridades)
  const priorityData = [
    { name: 'Urgente', value: unassignedPriorities.urgent, color: '#ef4444' },
    { name: 'Alta', value: unassignedPriorities.high, color: '#3b82f6' },
    { name: 'Media', value: unassignedPriorities.medium, color: '#f59e0b' },
    { name: 'Baja', value: unassignedPriorities.low, color: '#10b981' },
  ];

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      'URGENT': 'Urgente',
      'HIGH': 'Alta',
      'MEDIUM': 'Media',
      'LOW': 'Baja'
    };
    return labels[priority] || priority;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'URGENT': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'HIGH': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'MEDIUM': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'LOW': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
    <div className="w-full px-6">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Panel de Control</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {['Hoy', '7d', '30d'].map((range) => (
              <button
                key={range}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="flex gap-2 relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="dark:border-gray-700 dark:text-gray-300"
              onClick={() => setShowTeamFilter(!showTeamFilter)}
            >
              <Users size={16} className="mr-2" />
              {teamFilter || 'Todos los equipos'}
            </Button>
            {showTeamFilter && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowTeamFilter(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <div className="p-2">
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => {
                        setTeamFilter('');
                        setShowTeamFilter(false);
                      }}
                    >
                      Todos los equipos
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => {
                        setTeamFilter('Equipo de Soporte 1');
                        setShowTeamFilter(false);
                      }}
                    >
                      Equipo de Soporte 1
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => {
                        setTeamFilter('Equipo de Soporte 2');
                        setShowTeamFilter(false);
                      }}
                    >
                      Equipo de Soporte 2
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => {
                        setTeamFilter('Equipo de Soporte 3');
                        setShowTeamFilter(false);
                      }}
                    >
                      Equipo de Soporte 3
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-700 dark:text-gray-400 font-medium">Cargando panel de control...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-400">Equipo TI Online</CardTitle>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{metrics.agentsOnline}</div>
                <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <TrendingUp size={14} />
                  <span>Director + Equipo</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-400">Pendientes Director TI</CardTitle>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{metrics.unassignedTickets}</div>
                <p className="text-sm text-gray-700 dark:text-gray-400">Requieren revisión</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-400">Colas Próximas a Incumplir</CardTitle>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{metrics.queuesBreachingSoon}</div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Dentro de 1h</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-400">Carga Promedio Equipo TI</CardTitle>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{metrics.avgLoadPerAgent}</div>
                <p className="text-sm text-gray-700 dark:text-gray-400">Tickets por miembro</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base dark:text-gray-100">Actividad de Asignación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>Asignados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Reasignados</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={192}>
                  <AreaChart data={assignmentActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                        color: darkMode ? '#f3f4f6' : '#111827'
                      }}
                    />
                    <Legend wrapperStyle={{ color: darkMode ? '#9ca3af' : '#6b7280' }} />
                    <Area type="monotone" dataKey="assigned" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="reassigned" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base dark:text-gray-100">Capacidad del Equipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <span>Disponibles</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span>En Riesgo</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={192}>
                  <PieChart>
                    <Pie
                      data={capacityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {capacityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                        color: darkMode ? '#f3f4f6' : '#111827'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base dark:text-gray-100">Mezcla de Prioridades (Sin Asignar)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <span>Urgente</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>Alta</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-500">Otros</span>
                </div>
                <ResponsiveContainer width="100%" height={192}>
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                        color: darkMode ? '#f3f4f6' : '#111827'
                      }}
                    />
                    <Bar dataKey="value" fill="#8884d8">
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base dark:text-gray-100">Tickets Sin Asignar</CardTitle>
                <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-300">
                  <Filter size={16} className="mr-2" />
                  Prioridad: Todas
                </Button>
              </CardHeader>
              <CardContent>
                {unassignedTickets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Ticket</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Asunto</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Prioridad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unassignedTickets.map((ticket) => (
                          <tr key={ticket.id} className={`border-b ${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`}>
                            <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 font-medium">{ticket.ticketNumber}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-300">{ticket.subject}</td>
                            <td className="px-3 py-2">
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {getPriorityLabel(ticket.priority)}
                              </Badge>
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-300">
                              {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-48 bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                    No hay tickets sin asignar
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base dark:text-gray-100">Agentes y Carga</CardTitle>
                <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-300">
                  <Users size={16} className="mr-2" />
                  Equipo: Todos
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Agente</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Abiertos</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Alta/Urgente</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Tiempo Promedio Primera Respuesta</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.map((agent, idx) => (
                        <tr key={idx} className={`border-b ${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`}>
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">{agent.name}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-300">{agent.open}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-300">{agent.highUrgent}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-300">{agent.avgTime}</td>
                          <td className="px-3 py-2">
                            <Badge 
                              variant={
                                agent.status === 'Online' ? 'default' :
                                agent.status === 'Away' ? 'secondary' :
                                'destructive'
                              }
                              className={
                                agent.status === 'At Capacity' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : ''
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
