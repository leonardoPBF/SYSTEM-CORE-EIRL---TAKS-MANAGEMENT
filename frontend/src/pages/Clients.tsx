import { useState, useEffect } from 'react';
import { Users, Plus, Filter, Search, Building, Clock } from 'lucide-react';
import { clientsAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const Clients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Todos');

  useEffect(() => {
    loadClients();
  }, [activeTab]);

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
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
            <p className="text-sm text-gray-500 mt-1">Administra tus clientes y sus tickets</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.total}</div>
              <div className="text-sm text-gray-600">Total de Clientes</div>
              <div className="mt-2 text-xs text-blue-600 font-medium">• Activo</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-orange-500">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.withOpenTickets}</div>
              <div className="text-sm text-gray-600">Con Tickets Abiertos</div>
              <div className="mt-2 text-xs text-orange-600 font-medium">• Requiere atención</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-red-500">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.slaBreaches}</div>
              <div className="text-sm text-gray-600">Incumplimientos SLA</div>
              <div className="mt-2 text-xs text-red-600 font-medium">• Urgente</div>
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
            <div className="relative flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 min-w-[250px]">
              <Search size={18} className="text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar clientes..."
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              Filtros
            </Button>
            <Button>
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
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Cliente</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Empresa</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Abiertos</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Prioridad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Última Actividad</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.length > 0 ? (
                        clients.map((client) => (
                          <tr
                            key={client.id}
                            className={cn(
                              "border-b border-gray-100 cursor-pointer transition-colors",
                              selectedClient?.id === client.id ? "bg-blue-50" : "hover:bg-gray-50"
                            )}
                            onClick={() => setSelectedClient(client)}
                          >
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-900">Nombre Cliente</span>
                                <Badge variant="secondary" className="text-xs">Propietario</Badge>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-700">{client.company}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">3</td>
                            <td className="px-3 py-2">
                              <Badge variant="default" className="text-xs">Alta</Badge>
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-700">
                              {new Date(client.updatedAt).toLocaleDateString('es-ES')}
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-7 text-xs">Ver</Button>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">Nuevo Ticket</Button>
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
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600">Mostrando 1-5 de {clients.length}</span>
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
                  <p className="text-gray-900">{selectedClient.company}</p>
                  <p className="text-sm text-gray-500 mt-2">Selecciona un cliente para ver detalles.</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Selecciona un cliente para ver detalles.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">
                <Plus size={16} className="mr-2" />
                Crear Ticket
              </Button>
              <Button variant="outline" className="w-full">Enviar Email</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Segmentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['VIP (12)', 'Prueba (48)', 'Empresa (34)', 'Riesgo de Abandono (9)'].map((segment) => (
                  <div
                    key={segment}
                    className="p-2 bg-gray-50 rounded-md text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    {segment}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Empresas Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Acme Inc.', 'Globex', 'Umbrella Corp.'].map((company) => (
                  <div
                    key={company}
                    className="p-2 bg-gray-50 rounded-md text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    {company}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Clients;
