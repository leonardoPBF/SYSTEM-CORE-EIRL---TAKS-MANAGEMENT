import { Search, Moon, Bell, User } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search tickets, clients, articles"
              className="search-input"
            />
          </div>
        </div>
        <div className="header-right">
          <button className="icon-button">
            <Moon size={20} />
          </button>
          <button className="icon-button">
            <Bell size={20} />
          </button>
          <div className="user-avatar">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

