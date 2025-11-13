import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Mail, ArrowRight, Check, Moon, Sun, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@tasksystemcore.com');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Sesión iniciada exitosamente');
      } else {
        if (!name) {
          setError('El nombre es requerido para el registro');
          setLoading(false);
          return;
        }
        await register(email, password, name);
        toast.success('Registro exitoso');
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
      toast.error(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">TaskSystemCore</span>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:scale-110 transition-transform"
            onClick={toggleDarkMode}
            title={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
          </Button>
          <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
            <Bell size={20} />
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <Card className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 shadow-2xl overflow-hidden animate-fade-in bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 dark:from-blue-800 dark:via-blue-900 dark:to-purple-900 p-12 flex flex-col gap-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl mb-4 flex items-center justify-center">
                <Check size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Bienvenido de nuevo</h2>
              <p className="text-blue-100 dark:text-blue-200 leading-relaxed text-lg">
                Accede a tu espacio de trabajo de soporte para gestionar tickets, clientes y reportes de forma eficiente.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Check size={20} className="text-green-300 flex-shrink-0" />
                  <span className="font-medium">Listo para SSO Enterprise</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Check size={20} className="text-green-300 flex-shrink-0" />
                  <span className="font-medium">Seguro por diseño</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Check size={20} className="text-green-300 flex-shrink-0" />
                  <span className="font-medium">Configuración rápida</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-12 bg-white dark:bg-gray-900">
            <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="login" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value={isLogin ? 'login' : 'register'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                      {error}
                    </div>
                  )}

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-900 dark:text-gray-100">Nombre</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nombre@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-900 dark:text-gray-100">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      ¿Olvidaste tu contraseña?
                    </a>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-transform"
                    >
                      {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">O continúa con</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 transition-transform dark:border-gray-700"
                    >
                      <Cloud size={18} className="mr-2" />
                      SAML SSO
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 transition-transform dark:border-gray-700"
                    >
                      <Mail size={18} className="mr-2" />
                      Magic Link
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Al continuar, aceptas nuestros <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Términos</a> y <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Política de Privacidad</a>.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
