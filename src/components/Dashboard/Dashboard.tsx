import React from 'react';
import { 
  Users, 
  Megaphone, 
  Search, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { announcements, lostFoundItems, complaints, skills } = useData();

  const quickStats = [
    {
      title: 'Recent Announcements',
      value: announcements.length,
      icon: Megaphone,
      color: 'bg-blue-500',
      trend: '+2 this week'
    },
    {
      title: 'Lost & Found Items',
      value: lostFoundItems.filter(item => item.status === 'active').length,
      icon: Search,
      color: 'bg-orange-500',
      trend: '5 active items'
    },
    {
      title: 'Your Complaints',
      value: user?.role === 'admin' 
        ? complaints.length 
        : complaints.filter(c => c.studentId === user?.studentId).length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      trend: user?.role === 'admin' ? 'Total complaints' : 'Your complaints'
    },
    {
      title: 'Skills Available',
      value: skills.length,
      icon: Users,
      color: 'bg-green-500',
      trend: 'Learning opportunities'
    }
  ];

  const recentActivity = [
    {
      title: 'New announcement posted',
      description: 'Mid-semester examinations schedule',
      time: '2 hours ago',
      icon: Megaphone,
      color: 'text-blue-600'
    },
    {
      title: 'Lost item reported',
      description: 'iPhone 14 near library',
      time: '4 hours ago',
      icon: Search,
      color: 'text-orange-600'
    },
    {
      title: 'Complaint resolved',
      description: 'Water supply issue in Block A',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-blue-100 text-lg">
              {user?.role === 'admin' 
                ? 'Manage campus services and help students' 
                : `${user?.studentId} • ${user?.department} • Year ${user?.year}`}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-full">
            <TrendingUp className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{stat.title}</h3>
              <p className="text-sm text-gray-500">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`${activity.color} mt-1`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">View Timetable</span>
              </div>
            </button>
            <button className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Search className="h-5 w-5" />
                <span className="font-medium">Report Lost Item</span>
              </div>
            </button>
            <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">File Complaint</span>
              </div>
            </button>
            <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5" />
                <span className="font-medium">Browse Skills</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Schedule Preview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No classes scheduled for today</p>
          <p className="text-sm">Enjoy your free day or add some classes to your timetable!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;