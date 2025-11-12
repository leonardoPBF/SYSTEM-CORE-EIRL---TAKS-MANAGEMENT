import { Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Configuration = () => {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
          <Settings size={24} />
          Configuración
        </h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Configuración General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
            <Button>
              <Save size={16} className="mr-2" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Configuración de Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
            <Button>
              <Save size={16} className="mr-2" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Configuración SLA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="frt">Tiempo de Primera Respuesta (minutos)</Label>
              <Input id="frt" type="number" defaultValue="60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rt">Tiempo de Resolución (horas)</Label>
              <Input id="rt" type="number" defaultValue="24" />
            </div>
            <Button>
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
