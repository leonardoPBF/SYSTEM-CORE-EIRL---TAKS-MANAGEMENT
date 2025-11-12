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
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-md"></div>
          <span className="text-lg font-semibold text-gray-900">TaskSystemCore</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon">
            <Moon size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <Card className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 shadow-lg">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-12 flex flex-col gap-6 rounded-l-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mb-2"></div>
            <h2 className="text-3xl font-semibold text-gray-900">Bienvenido de nuevo</h2>
            <p className="text-gray-600 leading-relaxed">
              Accede a tu espacio de trabajo de soporte para gestionar tickets, clientes y reportes.
            </p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 text-gray-700">
                <Check size={16} className="text-green-600 flex-shrink-0" />
                <span>Listo para SSO</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <Check size={16} className="text-green-600 flex-shrink-0" />
                <span>Seguro por diseño</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <Check size={16} className="text-green-600 flex-shrink-0" />
                <span>Configuración rápida</span>
              </li>
            </ul>
          </div>

          <div className="p-12">
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
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant="outline" className="w-full">
                      <Cloud size={18} className="mr-2" />
                      SAML SSO
                    </Button>
                    <Button type="button" variant="outline" className="w-full">
                      <Mail size={18} className="mr-2" />
                      Magic Link
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Al continuar, aceptas los Términos y la Política de Privacidad.
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
