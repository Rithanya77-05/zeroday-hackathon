import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './components/Dashboard/Dashboard';
import AnnouncementsList from './components/Announcements/AnnouncementsList';
import LostFoundList from './components/LostFound/LostFoundList';
import TimetableView from './components/Timetable/TimetableView';
import ComplaintsList from './components/Complaints/ComplaintsList';
import SkillsMarketplace from './components/Skills/SkillsMarketplace';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'announcements':
        return <AnnouncementsList />;
      case 'lost-found':
        return <LostFoundList />;
      case 'timetable':
        return <TimetableView />;
      case 'complaints':
        return <ComplaintsList />;
      case 'skills':
        return <SkillsMarketplace />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:relative z-30 w-64 h-full transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
        />
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;