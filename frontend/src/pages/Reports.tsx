import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { dashboardAPI, reportsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';

const Reports = () => {
  const { darkMode } = useTheme();
  const [metrics, setMetrics] = useState<any>(null);
  const [volumeTrend, setVolumeTrend] = useState<any[]>([]);
  const [slaBreaches, setSLABreaches] = useState<any[]>([]);
  const [firstResponseTime, setFirstResponseTime] = useState<any[]>([]);
  const [resolutionTime, setResolutionTime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [metricsData, volumeData, slaData, responseData, resolutionData] = await Promise.all([
        dashboardAPI.getMetrics(),
        reportsAPI.getVolumeTrend(),
        reportsAPI.getSLABreaches(),
        reportsAPI.getFirstResponseTime(),
        reportsAPI.getResolutionTime()
      ]);
      
      setMetrics(metricsData);
      setVolumeTrend(volumeData);
      setSLABreaches(slaData);
      setFirstResponseTime(responseData);
      setResolutionTime(resolutionData);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-6">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reportes y Análisis</h1>
            <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">Visualiza métricas y tendencias de rendimiento</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <p className="text-sm text-gray-600 dark:text-gray-400">Reportes y métricas de los últimos 30 días</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 dark:border-indigo-400 mb-4"></div>
          <p className="text-gray-700 dark:text-gray-400 font-medium">Cargando reportes...</p>
        </div>
      ) : metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-400">Nuevos Tickets</CardTitle>
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  <TrendingUp size={14} />
                  <span>+6%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{metrics.newTickets || 0}</div>
                <p className="text-xs text-gray-700 dark:text-gray-400 mt-1">vs período anterior</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-400">Resueltos</CardTitle>
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  <TrendingUp size={14} />
                  <span>+4%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{metrics.resolvedTickets || 0}</div>
                <p className="text-xs text-gray-700 dark:text-gray-400 mt-1">vs período anterior</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-400">Pendientes</CardTitle>
                <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                  <TrendingDown size={14} />
                  <span>-8%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{metrics.backlog || 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base dark:text-gray-100">Tendencia de Volumen y Resolución</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>Creados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Resueltos</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={volumeTrend} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                      interval={Math.floor(volumeTrend.length / 8)}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                      allowDecimals={false}
                      domain={[0, 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                        color: darkMode ? '#f3f4f6' : '#111827',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                      }}
                      formatter={(value: any, name: string) => {
                        return [`${value} tickets`, name === 'created' ? 'Creados' : 'Resueltos'];
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ color: darkMode ? '#9ca3af' : '#6b7280', paddingTop: '15px' }}
                      iconType="line"
                      iconSize={12}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="created" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      name="Creados"
                      dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: darkMode ? '#1f2937' : '#ffffff' }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                      connectNulls={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resolved" 
                      stroke="#f59e0b" 
                      strokeWidth={3} 
                      name="Resueltos"
                      dot={{ fill: '#f59e0b', r: 4, strokeWidth: 2, stroke: darkMode ? '#1f2937' : '#ffffff' }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base dark:text-gray-100">Incumplimientos SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <span>Incumplimientos</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={slaBreaches} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                      interval={Math.max(0, Math.floor(slaBreaches.length / 10))}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      minTickGap={5}
                    />
                    <YAxis 
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                      allowDecimals={false}
                      domain={[0, 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                        color: darkMode ? '#f3f4f6' : '#111827',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                      }}
                      formatter={(value: any) => [`${value} incumplimientos`, '']}
                    />
                    <Bar 
                      dataKey="breaches" 
                      fill="#ef4444" 
                      name="Incumplimientos"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base dark:text-gray-100">Tiempo de Primera Respuesta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>Mediana (min)</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={firstResponseTime} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                      interval={Math.floor(firstResponseTime.length / 8)}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                      allowDecimals={false}
                      domain={[0, 'auto']}
                      label={{ value: 'Minutos', angle: -90, position: 'insideLeft', fill: darkMode ? '#9ca3af' : '#6b7280', style: { fontSize: '12px' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                        color: darkMode ? '#f3f4f6' : '#111827',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                      }}
                      formatter={(value: any) => [`${value} minutos`, 'Mediana']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="medianMinutes" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.75} 
                      name="Minutos"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base dark:text-gray-100">Tiempo de Resolución</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={resolutionTime} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                      interval={Math.floor(resolutionTime.length / 8)}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                      allowDecimals={true}
                      domain={[0, 'auto']}
                      label={{ value: 'Horas', angle: -90, position: 'insideLeft', fill: darkMode ? '#9ca3af' : '#6b7280', style: { fontSize: '12px' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                        color: darkMode ? '#f3f4f6' : '#111827',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                      }}
                      formatter={(value: any) => [`${value} horas`, 'Promedio']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="avgHours" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.75} 
                      name="Horas"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base dark:text-gray-100">Mejores Agentes (Últimos 30 días)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Agente</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Resueltos</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">TPR (m)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">TR (h)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-400">Satisfacción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`border-b ${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`}>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">Leslie Alexander</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>142</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>8.2</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>2.1</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>94%</td>
                    </tr>
                    <tr className={`border-b ${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`}>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">Devon Lane</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>128</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>9.1</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>2.3</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>91%</td>
                    </tr>
                    <tr className={`border-b ${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`}>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">Jenny Wilson</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>115</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>10.5</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>2.8</td>
                      <td className={`px-3 py-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-800"}`}>88%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Reports;
