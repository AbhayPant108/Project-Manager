import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Search, 
  User, 
  LogOut 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem: React.FC<{ 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean 
}> = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
      isActive 
        ? 'bg-blue-50 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/projects', icon: <FolderKanban size={20} />, label: 'Projects' },
    { to: '/tasks', icon: <CheckSquare size={20} />, label: 'My Tasks' },
    { to: '/search', icon: <Search size={20} />, label: 'Search Users' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white p-6">
        <div className="mb-8 px-3">
          <h1 className="text-xl font-bold text-blue-600">Project Manager</h1>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="absolute bottom-6 w-52">
          <button className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="h-screen flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-5xl h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
