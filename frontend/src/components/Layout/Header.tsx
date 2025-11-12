import { Search, Moon, Bell, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center">
      <div className="w-full px-6 flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Buscar tickets, clientes, artículos"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Moon size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <User size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
