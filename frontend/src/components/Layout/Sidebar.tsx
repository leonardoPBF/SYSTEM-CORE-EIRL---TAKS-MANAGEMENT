import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  UserCog, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tickets', icon: Ticket, label: 'Tickets' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/agents', icon: UserCog, label: 'Agents' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/configuration', icon: Settings, label: 'Configuration' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon"></div>
          <span className="logo-text">TaskSystemCore</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
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

