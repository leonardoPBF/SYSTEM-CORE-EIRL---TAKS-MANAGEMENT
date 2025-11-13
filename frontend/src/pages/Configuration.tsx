import { Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Configuration = () => {
  return (
    <div className="w-full px-6">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <p className="text-sm text-gray-500 mt-1">Administra las preferencias del sistema</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings size={20} className="text-blue-600" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="company">Nombre de la Empresa</Label>
              <Input id="company" defaultValue="TaskSystemCore EIRL" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <select
                id="timezone"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>UTC-5 (Lima, Perú)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <select
                id="language"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>Español</option>
                <option>Inglés</option>
              </select>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-transform">
              <Save size={16} className="mr-2" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings size={20} className="text-green-600" />
              Configuración de Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="smtp">Servidor SMTP</Label>
              <Input id="smtp" placeholder="smtp.ejemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Puerto SMTP</Label>
              <Input id="port" type="number" placeholder="587" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Dirección de Email</Label>
              <Input id="email" type="email" placeholder="noreply@tasksystemcore.com" />
            </div>
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 transition-transform">
              <Save size={16} className="mr-2" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings size={20} className="text-purple-600" />
              Configuración SLA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="frt">Tiempo de Primera Respuesta (minutos)</Label>
              <Input id="frt" type="number" defaultValue="60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rt">Tiempo de Resolución (horas)</Label>
              <Input id="rt" type="number" defaultValue="24" />
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:scale-105 transition-transform">
              <Save size={16} className="mr-2" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuration;
