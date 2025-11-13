import { useState, useEffect } from 'react';
import { BarChart3, Filter, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { dashboardAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Reports = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Resumen');

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error cargando métricas:', error);
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
            <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
            <p className="text-sm text-gray-500 mt-1">Visualiza métricas y tendencias de rendimiento</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="Reportes">Reportes</TabsTrigger>
            <TabsTrigger value="Resumen">Resumen</TabsTrigger>
            <TabsTrigger value="Rendimiento">Rendimiento</TabsTrigger>
            <TabsTrigger value="Carga">Carga</TabsTrigger>
            <TabsTrigger value="Satisfacción">Satisfacción</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
            <option>Últimos 30 días</option>
            <option>Últimos 7 días</option>
            <option>Últimos 90 días</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Todos los equipos
          </Button>
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Colas
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando reportes...</p>
        </div>
      ) : metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Nuevos Tickets</CardTitle>
                <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp size={14} />
                  <span>+6%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metrics.newTickets || 1248}</div>
                <p className="text-xs text-gray-500 mt-1">vs período anterior</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Resueltos</CardTitle>
                <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp size={14} />
                  <span>+4%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metrics.resolvedTickets || 1102}</div>
                <p className="text-xs text-gray-500 mt-1">vs período anterior</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pendientes</CardTitle>
                <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  <TrendingDown size={14} />
                  <span>-8%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metrics.backlog || 146}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tendencia de Volumen y Resolución</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>Creados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Resueltos</span>
                  </div>
                </div>
                <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Gráfico de línea
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Incumplimientos SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <span>Incumplimientos</span>
                  </div>
                </div>
                <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Gráfico de barras apiladas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tiempo de Primera Respuesta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>Mediana (min)</span>
                  </div>
                </div>
                <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Gráfico de área
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tiempo de Resolución</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Gráfico de área
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mejores Agentes (Últimos 30 días)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Agente</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Resueltos</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">TPR (m)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">TR (h)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Satisfacción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">Leslie Alexander</td>
                      <td className="px-3 py-2 text-sm text-gray-700">142</td>
                      <td className="px-3 py-2 text-sm text-gray-700">8.2</td>
                      <td className="px-3 py-2 text-sm text-gray-700">2.1</td>
                      <td className="px-3 py-2 text-sm text-gray-700">94%</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">Devon Lane</td>
                      <td className="px-3 py-2 text-sm text-gray-700">128</td>
                      <td className="px-3 py-2 text-sm text-gray-700">9.1</td>
                      <td className="px-3 py-2 text-sm text-gray-700">2.3</td>
                      <td className="px-3 py-2 text-sm text-gray-700">91%</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">Jenny Wilson</td>
                      <td className="px-3 py-2 text-sm text-gray-700">115</td>
                      <td className="px-3 py-2 text-sm text-gray-700">10.5</td>
                      <td className="px-3 py-2 text-sm text-gray-700">2.8</td>
                      <td className="px-3 py-2 text-sm text-gray-700">88%</td>
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
