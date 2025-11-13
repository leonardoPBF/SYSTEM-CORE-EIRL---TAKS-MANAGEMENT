import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Mail, ArrowRight, Check, Moon, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@tasksystemcore.com');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

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
      } else {
        if (!name) {
          setError('El nombre es requerido para el registro');
          setLoading(false);
          return;
        }
        await register(email, password, name);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-gray-900">TaskSystemCore</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
            <Moon size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
            <Bell size={20} />
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <Card className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 shadow-2xl overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-12 flex flex-col gap-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl mb-4 flex items-center justify-center">
                <Check size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Bienvenido de nuevo</h2>
              <p className="text-blue-100 leading-relaxed text-lg">
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

          <div className="p-12 bg-white">
            <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value={isLogin ? 'login' : 'register'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nombre@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <a href="#" className="text-sm text-blue-600 hover:underline font-medium">
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
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">O continúa con</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant="outline" className="w-full hover:bg-gray-50 hover:scale-105 transition-transform">
                      <Cloud size={18} className="mr-2" />
                      SAML SSO
                    </Button>
                    <Button type="button" variant="outline" className="w-full hover:bg-gray-50 hover:scale-105 transition-transform">
                      <Mail size={18} className="mr-2" />
                      Magic Link
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Al continuar, aceptas nuestros <a href="#" className="text-blue-600 hover:underline">Términos</a> y <a href="#" className="text-blue-600 hover:underline">Política de Privacidad</a>.
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
