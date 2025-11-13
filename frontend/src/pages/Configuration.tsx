import { useState } from 'react';
import { Settings, Save, Mail, Clock, Globe, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Configuration = () => {
  const [generalConfig, setGeneralConfig] = useState({
    company: 'TaskSystemCore EIRL',
    timezone: 'UTC-5',
    language: 'es',
  });

  const [emailConfig, setEmailConfig] = useState({
    smtp: '',
    port: '587',
    email: '',
    password: '',
  });

  const [slaConfig, setSlaConfig] = useState({
    firstResponseTime: 60,
    resolutionTime: 24,
  });

  const [notificationConfig, setNotificationConfig] = useState({
    emailNotifications: true,
    ticketUpdates: true,
    slaAlerts: true,
  });

  const handleSaveGeneral = async () => {
    try {
      // Aquí iría la llamada a la API para guardar
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Configuración general guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la configuración general');
    }
  };

  const handleSaveEmail = async () => {
    if (!emailConfig.smtp || !emailConfig.email) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }

    try {
      // Aquí iría la llamada a la API para guardar
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Configuración de email guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la configuración de email');
    }
  };

  const handleSaveSLA = async () => {
    if (slaConfig.firstResponseTime < 1 || slaConfig.resolutionTime < 1) {
      toast.error('Los tiempos deben ser mayores a 0');
      return;
    }

    try {
      // Aquí iría la llamada a la API para guardar
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Configuración SLA guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la configuración SLA');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      // Aquí iría la llamada a la API para guardar
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Configuración de notificaciones guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la configuración de notificaciones');
    }
  };

  return (
    <div className="w-full px-6">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Configuración</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Administra las preferencias del sistema</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe size={20} className="text-blue-600" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="company">Nombre de la Empresa</Label>
              <Input 
                id="company" 
                value={generalConfig.company}
                onChange={(e) => setGeneralConfig({ ...generalConfig, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <select
                id="timezone"
                value={generalConfig.timezone}
                onChange={(e) => setGeneralConfig({ ...generalConfig, timezone: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-gray-800 px-3 py-2 text-sm"
              >
                <option value="UTC-5">UTC-5 (Lima, Perú)</option>
                <option value="UTC-6">UTC-6 (México)</option>
                <option value="UTC-3">UTC-3 (Buenos Aires)</option>
                <option value="UTC+0">UTC+0 (Londres)</option>
                <option value="UTC-8">UTC-8 (Los Angeles)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <select
                id="language"
                value={generalConfig.language}
                onChange={(e) => setGeneralConfig({ ...generalConfig, language: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-gray-800 px-3 py-2 text-sm"
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
                <option value="pt">Portugués</option>
              </select>
            </div>
            <Button 
              onClick={handleSaveGeneral}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-transform w-full"
            >
              <Save size={16} className="mr-2" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Mail size={20} className="text-green-600" />
              Configuración de Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="smtp">Servidor SMTP *</Label>
              <Input 
                id="smtp" 
                placeholder="smtp.ejemplo.com"
                value={emailConfig.smtp}
                onChange={(e) => setEmailConfig({ ...emailConfig, smtp: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Puerto SMTP</Label>
              <Input 
                id="port" 
                type="number" 
                placeholder="587"
                value={emailConfig.port}
                onChange={(e) => setEmailConfig({ ...emailConfig, port: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Dirección de Email *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="noreply@tasksystemcore.com"
                value={emailConfig.email}
                onChange={(e) => setEmailConfig({ ...emailConfig, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-password">Contraseña</Label>
              <Input 
                id="email-password" 
                type="password" 
                placeholder="••••••••"
                value={emailConfig.password}
                onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
              />
            </div>
            <Button 
              onClick={handleSaveEmail}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 transition-transform w-full"
            >
              <Save size={16} className="mr-2" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock size={20} className="text-purple-600" />
              Configuración SLA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="frt">Tiempo de Primera Respuesta (minutos)</Label>
              <Input 
                id="frt" 
                type="number" 
                min="1"
                value={slaConfig.firstResponseTime}
                onChange={(e) => setSlaConfig({ ...slaConfig, firstResponseTime: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rt">Tiempo de Resolución (horas)</Label>
              <Input 
                id="rt" 
                type="number" 
                min="1"
                value={slaConfig.resolutionTime}
                onChange={(e) => setSlaConfig({ ...slaConfig, resolutionTime: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Los tiempos de SLA se aplicarán a todos los tickets nuevos. Los tickets existentes mantendrán sus tiempos configurados.
              </p>
            </div>
            <Button 
              onClick={handleSaveSLA}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:scale-105 transition-transform w-full"
            >
              <Save size={16} className="mr-2" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Bell size={20} className="text-orange-600" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Recibir notificaciones importantes por correo</p>
                </div>
                <input
                  id="email-notifications"
                  type="checkbox"
                  checked={notificationConfig.emailNotifications}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, emailNotifications: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ticket-updates">Actualizaciones de Tickets</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Notificar cuando un ticket se actualiza</p>
                </div>
                <input
                  id="ticket-updates"
                  type="checkbox"
                  checked={notificationConfig.ticketUpdates}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, ticketUpdates: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sla-alerts">Alertas de SLA</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Notificar cuando un ticket está cerca de incumplir SLA</p>
                </div>
                <input
                  id="sla-alerts"
                  type="checkbox"
                  checked={notificationConfig.slaAlerts}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, slaAlerts: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </div>
            </div>
            <Button 
              onClick={handleSaveNotifications}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 hover:scale-105 transition-transform w-full"
            >
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
