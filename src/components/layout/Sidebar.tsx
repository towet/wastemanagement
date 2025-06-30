import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bell, 
  Info, 
  Users, 
  Settings, 
  ChevronLeft,
  Recycle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user } = useAuth();

  const userNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
    { icon: Bell, label: 'Notifications', path: '/app/notifications' },
    { icon: Info, label: 'About', path: '/app/about' },
  ];

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app/admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/app/admin/users' },
    { icon: Bell, label: 'Notifications', path: '/app/admin/notifications' },
    { icon: Settings, label: 'Settings', path: '/app/admin/settings' },
    { icon: Info, label: 'About', path: '/app/admin/about' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-white shadow-xl border-r border-slate-200 z-50
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className={`flex items-center space-x-2 ${isCollapsed ? 'hidden' : ''}`}>
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Recycle className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">EcoTrack</h1>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-200"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className={`${isCollapsed ? 'hidden' : ''}`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className={`absolute bottom-4 left-3 right-3 ${isCollapsed ? 'hidden' : ''}`}>
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-4 text-white">
          <h3 className="font-semibold text-sm mb-1">Go Premium</h3>
          <p className="text-xs opacity-90 mb-2">Unlock advanced analytics and features</p>
          <button className="w-full bg-white text-emerald-600 text-xs font-medium py-1.5 rounded-md hover:bg-gray-100 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};