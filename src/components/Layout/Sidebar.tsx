import React from 'react';
import { 
  Home, 
  Megaphone, 
  Search, 
  Calendar, 
  AlertTriangle, 
  Users, 
  Settings,
  LogOut,

} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'lost-found', label: 'Lost & Found', icon: Search },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
    { id: 'skills', label: 'Skill Exchange', icon: Users },
  ];

  return (
    <div className="bg-white shadow-lg h-full flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg flex items-center justify-center">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPNZH-Nf2KvQmlqgQnizOnphZXYNyYXAhAkUPfiKC2KhA8MU8jVJWS3UbL0MW1ri3gaoc&usqp=CAU"
          className="h-6 w-6 object-contain"
        />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Sri Eshwar College Of Engineering</h1>
            <p className="text-sm text-gray-500">Student Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role === 'admin' ? 'Administrator' : `${user?.studentId} • ${user?.department}`}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;