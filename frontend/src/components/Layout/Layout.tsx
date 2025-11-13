import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const Layout = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={cn(
      "min-h-screen transition-colors",
      darkMode ? "bg-gray-950" : "bg-gray-50"
    )}>
      <Sidebar />
      <Header />
      <main className="ml-64 mt-16 p-8 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
