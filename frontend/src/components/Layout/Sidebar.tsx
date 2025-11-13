import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  UserCog, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

const Sidebar = () => {
  const { darkMode } = useTheme();
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Panel de Control' },
    { path: '/tickets', icon: Ticket, label: 'Tickets' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/agents', icon: UserCog, label: 'Agentes' },
    { path: '/reports', icon: BarChart3, label: 'Reportes' },
    { path: '/configuration', icon: Settings, label: 'Configuración' },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-50 h-screen w-64 border-r flex flex-col transition-colors",
        darkMode 
          ? "bg-gray-900 border-gray-800" 
          : "bg-white border-gray-200"
      )}
    >
      <div className={cn(
        "p-6 border-b transition-colors",
        darkMode ? "border-gray-800" : "border-gray-200"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
            darkMode ? "bg-blue-500" : "bg-blue-600"
          )}></div>
          <span className={cn(
            "text-lg font-semibold transition-colors",
            darkMode ? "text-gray-100" : "text-gray-900"
          )}>TaskSystemCore</span>
        </div>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                  isActive
                    ? darkMode
                      ? "bg-blue-900/30 text-blue-400 font-medium"
                      : "bg-blue-50 text-blue-600 font-medium"
                    : darkMode
                      ? "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
