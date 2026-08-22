import React, { useState } from 'react';
import { Home, Calendar, BookOpen, ListTodo, User } from 'lucide-react';
import DashboardScreen from '../screens/DashboardScreen.jsx';
import CalendarScreen from '../screens/CalendarScreen.jsx';
import BookingScreen from '../screens/BookingScreen.jsx';
import TasksScreen from '../screens/TasksScreen.jsx';
import ProfileScreen from '../screens/ProfileScreen.jsx';

export default function MainNavigator() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const tabs = [
    { id: 'Dashboard', label: 'Home', icon: Home },
    { id: 'Calendar', label: 'Calendar', icon: Calendar },
    { id: 'Booking', label: 'Booking', icon: BookOpen },
    { id: 'Tasks', label: 'Tasks', icon: ListTodo },
    { id: 'Profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Screen Render */}
      <div className="flex-1">
        {activeTab === 'Dashboard' && <DashboardScreen onNavigate={(t) => setActiveTab(t)} />}
        {activeTab === 'Calendar' && <CalendarScreen />}
        {activeTab === 'Booking' && <BookingScreen />}
        {activeTab === 'Tasks' && <TasksScreen />}
        {activeTab === 'Profile' && <ProfileScreen />}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2 px-4 flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 transition ${
                isActive ? 'text-blue-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
