import React, { useState, useEffect } from 'react';
import {
  Calendar, Plus, Clock, CheckCircle2, Settings, Bell,
  LogOut, Menu, X, ChevronLeft, ChevronRight, Trash2,
  Edit2, Share2, Eye, Home, BookOpen, ListTodo, User
} from 'lucide-react';

// Mock Data & Storage
const STORAGE_KEY = 'masaa_data';

const defaultData = {
  user: {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    timezone: 'UTC+3',
    theme: 'light'
  },
  events: [
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      category: 'work',
      description: 'Weekly sync with team',
      attendees: ['john@company.com', 'sarah@company.com'],
      reminders: ['15 minutes before']
    },
    {
      id: '2',
      title: 'Lunch Break',
      date: new Date().toISOString().split('T')[0],
      startTime: '12:00',
      endTime: '13:00',
      category: 'personal',
      description: 'Lunch at cafe',
      attendees: [],
      reminders: []
    },
    {
      id: '3',
      title: 'Client Call',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '15:00',
      category: 'work',
      description: 'Project discussion',
      attendees: ['client@company.com'],
      reminders: ['30 minutes before']
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'Finish project proposal',
      deadline: new Date().toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      category: 'work'
    },
    {
      id: '2',
      title: 'Review documents',
      deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      priority: 'medium',
      completed: false,
      category: 'work'
    },
    {
      id: '3',
      title: 'Call dentist',
      deadline: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      priority: 'low',
      completed: false,
      category: 'personal'
    }
  ],
  bookingPage: {
    id: 'booking-1',
    title: 'Alex\'s Booking Page',
    description: 'Schedule a meeting with me',
    availability: {
      monday: { start: '09:00', end: '17:00', active: true },
      tuesday: { start: '09:00', end: '17:00', active: true },
      wednesday: { start: '09:00', end: '17:00', active: true },
      thursday: { start: '09:00', end: '17:00', active: true },
      friday: { start: '09:00', end: '17:00', active: true },
      saturday: { start: '10:00', end: '14:00', active: false },
      sunday: { start: '10:00', end: '14:00', active: false }
    },
    meetingDuration: 30,
    bufferTime: 15,
    bookings: []
  }
};

const loadData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultData;
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Main App Component
export default function MASAAApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [data, setData] = useState(loadData);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'booking', label: 'Booking Page', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        navigation={navigation}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={data.user}
        />

        {/* Content */}
        <div className="p-4 md:p-8">
          {currentPage === 'dashboard' && (
            <Dashboard
              data={data}
              setCurrentPage={setCurrentPage}
              onAddEvent={() => {
                setEditingEvent(null);
                setShowEventModal(true);
              }}
            />
          )}

          {currentPage === 'calendar' && (
            <CalendarView
              events={data.events}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              onAddEvent={() => {
                setEditingEvent(null);
                setShowEventModal(true);
              }}
              onEditEvent={(event) => {
                setEditingEvent(event);
                setShowEventModal(true);
              }}
              onDeleteEvent={(id) => {
                setData({
                  ...data,
                  events: data.events.filter(e => e.id !== id)
                });
              }}
            />
          )}

          {currentPage === 'booking' && (
            <BookingPageBuilder
              bookingPage={data.bookingPage}
              updateBookingPage={(updated) => {
                setData({
                  ...data,
                  bookingPage: updated
                });
              }}
              events={data.events}
            />
          )}

          {currentPage === 'tasks' && (
            <TasksView
              tasks={data.tasks}
              onAddTask={(task) => {
                setData({
                  ...data,
                  tasks: [...data.tasks, { ...task, id: Date.now().toString() }]
                });
              }}
              onToggleTask={(id) => {
                setData({
                  ...data,
                  tasks: data.tasks.map(t =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                  )
                });
              }}
              onDeleteTask={(id) => {
                setData({
                  ...data,
                  tasks: data.tasks.filter(t => t.id !== id)
                });
              }}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              user={data.user}
              updateUser={(updated) => {
                setData({
                  ...data,
                  user: updated
                });
              }}
            />
          )}
        </div>
      </main>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={editingEvent}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onSave={(event) => {
            if (editingEvent) {
              setData({
                ...data,
                events: data.events.map(e => e.id === event.id ? event : e)
              });
            } else {
              setData({
                ...data,
                events: [...data.events, { ...event, id: Date.now().toString() }]
              });
            }
            setShowEventModal(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}

// Sidebar Component
function Sidebar({ navigation, currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300 ${!sidebarOpen && 'hidden'}`}>
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">MASAA</h1>
              <p className="text-xs text-blue-100">IT'S ABOUT TIME</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === item.id
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'hover:bg-blue-500 text-blue-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-500">
          <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-500 rounded-lg transition text-blue-50">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed md:hidden inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed md:hidden top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white z-50 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-blue-500 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Calendar className="text-white" size={24} />
            <h1 className="text-xl font-bold">MASAA</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === item.id
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'hover:bg-blue-500 text-blue-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

// Header Component
function Header({ sidebarOpen, setSidebarOpen, user }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 md:px-8 py-4 flex justify-between items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800">MASAA</h2>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}

// Dashboard Component
function Dashboard({ data, setCurrentPage, onAddEvent }) {
  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = data.events
    .filter(e => e.date >= today)
    .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))
    .slice(0, 5);

  const incompleteTasks = data.tasks.filter(t => !t.completed).length;
  const todayEvents = data.events.filter(e => e.date === today).length;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {data.user.name}!</h1>
        <p className="text-blue-100">You have {todayEvents} events today and {incompleteTasks} pending tasks.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Calendar size={24} />}
          label="Today's Events"
          value={todayEvents}
          color="blue"
        />
        <StatCard
          icon={<Clock size={24} />}
          label="Upcoming"
          value={upcomingEvents.length}
          color="purple"
        />
        <StatCard
          icon={<CheckCircle2 size={24} />}
          label="Tasks Done"
          value={data.tasks.filter(t => t.completed).length}
          color="green"
        />
        <StatCard
          icon={<ListTodo size={24} />}
          label="Pending Tasks"
          value={incompleteTasks}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Upcoming Events</h2>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <div key={event.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date} • {event.startTime}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming events</p>
            )}
          </div>
          <button
            onClick={() => setCurrentPage('calendar')}
            className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 rounded-lg transition"
          >
            View Calendar →
          </button>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Pending Tasks</h2>
          <div className="space-y-3">
            {data.tasks
              .filter(t => !t.completed)
              .slice(0, 5)
              .map(task => (
                <div key={task.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    task.priority === 'high' ? 'bg-red-100' :
                    task.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <CheckCircle2 size={20} className={
                      task.priority === 'high' ? 'text-red-600' :
                      task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    } />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.deadline}</p>
                  </div>
                </div>
              ))}
          </div>
          <button
            onClick={() => setCurrentPage('tasks')}
            className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 rounded-lg transition"
          >
            View All Tasks →
          </button>
        </div>
      </div>

      {/* Quick Actions Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onAddEvent}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          New Event
        </button>
        <button
          onClick={() => setCurrentPage('booking')}
          className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 transition flex items-center justify-center gap-2"
        >
          <Share2 size={20} />
          Booking Page
        </button>
        <button
          onClick={() => setCurrentPage('calendar')}
          className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 transition flex items-center justify-center gap-2"
        >
          <Calendar size={20} />
          View Calendar
        </button>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    green: 'from-green-50 to-green-100 border-green-200',
    orange: 'from-orange-50 to-orange-100 border-orange-200'
  };

  const iconColors = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border-2 rounded-xl p-6`}>
      <div className={`${iconColors[color]} mb-3`}>{icon}</div>
      <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
      <p className={`text-3xl font-bold ${iconColors[color]}`}>{value}</p>
    </div>
  );
}

// Calendar View Component
function CalendarView({ events, currentMonth, setCurrentMonth, onAddEvent, onEditEvent, onDeleteEvent }) {
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getEventsForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center font-bold text-gray-600 bg-gray-50 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0">
          {days.map((day, index) => (
            <div
              key={index}
              className="min-h-24 p-2 border-r border-b border-gray-200 last:border-r-0 bg-white hover:bg-gray-50 transition"
            >
              {day ? (
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">{day}</div>
                  <div className="space-y-1">
                    {getEventsForDate(day).slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition truncate"
                        onClick={() => onEditEvent(event)}
                      >
                        {event.title}
                      </div>
                    ))}
                    {getEventsForDate(day).length > 2 && (
                      <div className="text-xs text-gray-500">+{getEventsForDate(day).length - 2} more</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Button */}
      <button
        onClick={onAddEvent}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Event
      </button>

      {/* Events List */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Events This Month</h3>
        <div className="space-y-3">
          {events
            .filter(e => {
              const [year, month] = e.date.split('-');
              return parseInt(year) === currentMonth.getFullYear() &&
                parseInt(month) === currentMonth.getMonth() + 1;
            })
            .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))
            .map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date} • {event.startTime}-{event.endTime}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditEvent(event)}
                    className="p-2 hover:bg-blue-100 rounded text-blue-600 transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="p-2 hover:bg-red-100 rounded text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// Booking Page Builder
function BookingPageBuilder({ bookingPage, updateBookingPage, events }) {
  const [copied, setCopied] = useState(false);

  const bookingLink = `${window.location.origin}?booking=${bookingPage.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const today = new Date().toISOString().split('T')[0];
  const availableSlots = [];
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(Date.now() + i * 86400000);
    const dayName = dayNames[date.getDay()];
    const dayConfig = bookingPage.availability[dayName];
    const dateStr = date.toISOString().split('T')[0];

    if (dayConfig.active) {
      const [startHour, startMin] = dayConfig.start.split(':').map(Number);
      const [endHour, endMin] = dayConfig.end.split(':').map(Number);

      for (let hour = startHour; hour < endHour; hour++) {
        for (let min = 0; min < 60; min += bookingPage.meetingDuration) {
          const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
          const dayEvents = events.filter(e => e.date === dateStr);
          const isAvailable = !dayEvents.some(e => {
            const [eHour, eMin] = e.startTime.split(':').map(Number);
            const eEndHour = (eHour * 60 + eMin + bookingPage.meetingDuration) / 60;
            const slotTime = hour + min / 60;
            return slotTime >= (eHour + eMin / 60) && slotTime < eEndHour;
          });

          if (isAvailable) {
            availableSlots.push({ date: dateStr, time: timeStr });
          }
        }
      }
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Booking Page Settings */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Booking Page Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Page Title</label>
            <input
              type="text"
              value={bookingPage.title}
              onChange={(e) => updateBookingPage({ ...bookingPage, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={bookingPage.description}
              onChange={(e) => updateBookingPage({ ...bookingPage, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Duration (min)</label>
              <input
                type="number"
                value={bookingPage.meetingDuration}
                onChange={(e) => updateBookingPage({ ...bookingPage, meetingDuration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Buffer Time (min)</label>
              <input
                type="number"
                value={bookingPage.bufferTime}
                onChange={(e) => updateBookingPage({ ...bookingPage, bufferTime: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Availability Settings */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Weekly Availability</h2>

        <div className="space-y-3">
          {Object.entries(bookingPage.availability).map(([day, config]) => (
            <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-24 capitalize font-semibold text-gray-700">{day}</div>
              <input
                type="checkbox"
                checked={config.active}
                onChange={(e) => {
                  const updated = { ...bookingPage };
                  updated.availability[day].active = e.target.checked;
                  updateBookingPage(updated);
                }}
                className="w-5 h-5 cursor-pointer"
              />
              {config.active && (
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={config.start}
                    onChange={(e) => {
                      const updated = { ...bookingPage };
                      updated.availability[day].start = e.target.value;
                      updateBookingPage(updated);
                    }}
                    className="px-3 py-1 border border-gray-300 rounded"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={config.end}
                    onChange={(e) => {
                      const updated = { ...bookingPage };
                      updated.availability[day].end = e.target.value;
                      updateBookingPage(updated);
                    }}
                    className="px-3 py-1 border border-gray-300 rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Share Booking Link */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Share Your Booking Link</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={bookingLink}
            readOnly
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg"
          />
          <button
            onClick={copyToClipboard}
            className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-blue-100 text-sm">Share this link with clients or team members to schedule meetings</p>
      </div>

      {/* Available Slots Preview */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Time Slots (Next 7 Days)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {availableSlots.slice(0, 16).map((slot, idx) => (
            <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-sm font-semibold text-gray-800">{slot.time}</p>
              <p className="text-xs text-gray-500">{new Date(slot.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tasks View Component
function TasksView({ tasks, onAddTask, onToggleTask, onDeleteTask }) {
  const [newTask, setNewTask] = useState('');
  const [newDeadline, setNewDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [newPriority, setNewPriority] = useState('medium');

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask({
        title: newTask,
        deadline: newDeadline,
        priority: newPriority,
        completed: false,
        category: 'personal'
      });
      setNewTask('');
      setNewDeadline(new Date().toISOString().split('T')[0]);
      setNewPriority('medium');
    }
  };

  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed);
  const mediumPriority = tasks.filter(t => t.priority === 'medium' && !t.completed);
  const lowPriority = tasks.filter(t => t.priority === 'low' && !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Add Task Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Task</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={handleAddTask}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* High Priority Tasks */}
      {highPriority.length > 0 && (
        <TaskSection
          title="High Priority"
          tasks={highPriority}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
          color="red"
        />
      )}

      {/* Medium Priority Tasks */}
      {mediumPriority.length > 0 && (
        <TaskSection
          title="Medium Priority"
          tasks={mediumPriority}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
          color="yellow"
        />
      )}

      {/* Low Priority Tasks */}
      {lowPriority.length > 0 && (
        <TaskSection
          title="Low Priority"
          tasks={lowPriority}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
          color="green"
        />
      )}

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <TaskSection
          title="Completed"
          tasks={completed}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
          color="gray"
          isCompleted={true}
        />
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <CheckCircle2 size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-lg">No tasks yet. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}

function TaskSection({ title, tasks, onToggle, onDelete, color, isCompleted }) {
  const colors = {
    red: 'border-red-200 bg-red-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    green: 'border-green-200 bg-green-50',
    gray: 'border-gray-200 bg-gray-50'
  };

  const dotColors = {
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    green: 'bg-green-600',
    gray: 'bg-gray-400'
  };

  return (
    <div className={`bg-white rounded-xl shadow p-6 border-l-4 ${colors[color]}`}>
      <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="w-5 h-5 cursor-pointer"
            />
            <div className={`w-2 h-2 rounded-full ${dotColors[color]}`} />
            <div className="flex-1">
              <p className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </p>
              <p className="text-sm text-gray-500">{task.deadline}</p>
            </div>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 hover:bg-red-100 rounded text-red-600 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Event Modal Component
function EventModal({ event, onClose, onSave }) {
  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState(event?.date || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(event?.startTime || '10:00');
  const [endTime, setEndTime] = useState(event?.endTime || '11:00');
  const [category, setCategory] = useState(event?.category || 'work');
  const [description, setDescription] = useState(event?.description || '');

  const handleSave = () => {
    onSave({
      ...event,
      title,
      date,
      startTime,
      endTime,
      category,
      description
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {event ? 'Edit Event' : 'New Event'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team Meeting"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
}

// Settings Page Component
function SettingsPage({ user, updateUser }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => updateUser({ ...user, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => updateUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
            <select
              value={user.timezone}
              onChange={(e) => updateUser({ ...user, timezone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC+1">UTC+1</option>
              <option value="UTC+2">UTC+2</option>
              <option value="UTC+3">UTC+3</option>
              <option value="UTC+4">UTC+4</option>
              <option value="UTC+5">UTC+5</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
            <select
              value={user.theme}
              onChange={(e) => updateUser({ ...user, theme: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
          Save Changes
        </button>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Danger Zone</h3>
        <button className="text-red-600 hover:text-red-700 font-semibold">Delete Account</button>
      </div>
    </div>
  );
}