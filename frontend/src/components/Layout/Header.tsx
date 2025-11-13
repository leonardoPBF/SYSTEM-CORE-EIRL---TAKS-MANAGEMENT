import { useState } from 'react';
import { Search, Moon, Sun, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Header = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const handleToggleDarkMode = () => {
    const newMode = !darkMode;
    toggleDarkMode();
    // Usar el nuevo modo en el mensaje
    toast.success(newMode ? 'Modo oscuro activado' : 'Modo claro activado');
  };

  const handleLogout = () => {
    toast.success('Cerrando sesión...');
    setTimeout(() => {
      logout();
    }, 500);
  };

  return (
    <header className={cn(
      "fixed top-0 left-64 right-0 h-16 border-b z-40 flex items-center transition-colors",
      darkMode 
        ? "bg-gray-900 border-gray-800" 
        : "bg-white border-gray-200"
    )}>
      <div className="w-full px-6 flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className={cn(
            "relative flex items-center gap-3 border rounded-lg px-4 py-2 transition-colors",
            darkMode 
              ? "bg-gray-800 border-gray-700" 
              : "bg-gray-50 border-gray-200"
          )}>
            <Search size={18} className={cn(
              "flex-shrink-0 transition-colors",
              darkMode ? "text-gray-500" : "text-gray-400"
            )} />
            <input 
              type="text" 
              placeholder="Buscar tickets, clientes, artículos"
              className={cn(
                "flex-1 bg-transparent border-none outline-none text-sm placeholder:transition-colors",
                darkMode 
                  ? "text-gray-100 placeholder:text-gray-500" 
                  : "text-gray-900 placeholder:text-gray-400"
              )}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleToggleDarkMode}
            title={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            className={cn(
              "transition-colors",
              darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            )}
          >
            {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "transition-colors",
              darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            )}
          >
            <Bell size={20} />
          </Button>
          <div className="relative">
            <div 
              className={cn(
                "flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 transition-colors",
                darkMode 
                  ? "hover:bg-gray-800" 
                  : "hover:bg-gray-50"
              )}
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className={cn(
                "text-sm font-medium transition-colors",
                darkMode ? "text-gray-300" : "text-gray-700"
              )}>{user?.name || 'User'}</span>
            </div>
            
            {showLogoutMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowLogoutMenu(false)}
                />
                <div className={cn(
                  "absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-20 transition-colors",
                  darkMode 
                    ? "bg-gray-800 border-gray-700" 
                    : "bg-white border-gray-200"
                )}>
                  <div className={cn(
                    "p-3 border-b transition-colors",
                    darkMode ? "border-gray-700" : "border-gray-200"
                  )}>
                    <p className={cn(
                      "text-sm font-semibold transition-colors",
                      darkMode ? "text-gray-100" : "text-gray-900"
                    )}>{user?.name}</p>
                    <p className={cn(
                      "text-xs transition-colors",
                      darkMode ? "text-gray-400" : "text-gray-500"
                    )}>{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                        darkMode 
                          ? "text-gray-300 hover:bg-gray-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => {
                        setShowLogoutMenu(false);
                        // Aquí puedes añadir navegación a perfil si lo necesitas
                      }}
                    >
                      <User size={16} />
                      Mi Perfil
                    </button>
                    <button
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                        darkMode 
                          ? "text-red-400 hover:bg-red-900/20" 
                          : "text-red-600 hover:bg-red-50"
                      )}
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
