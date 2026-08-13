import React, { useState, useEffect } from 'react';
import {
  Calendar, Plus, Clock, CheckCircle2, Settings, Bell,
  LogOut, Menu, X, ChevronLeft, ChevronRight, Trash2,
  Edit2, Share2, Home, BookOpen, ListTodo, User,
  Repeat, Tag, Users, AlarmClock, Palette, Sun, Moon
} from 'lucide-react';

// ─── 50 THEMES ────────────────────────────────────────────────────────────────
export const THEMES = [
  { id:'blue-white',      name:'Ocean Blue',        primary:'#2563eb', secondary:'#1d4ed8', accent:'#3b82f6', bg:'#f0f4ff', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'black-gold',      name:'Black & Gold',      primary:'#b45309', secondary:'#92400e', accent:'#f59e0b', bg:'#0f0f0f', card:'#1a1a1a', text:'#fef3c7', textLight:'#d97706', dark:true  },
  { id:'emerald-white',   name:'Emerald',           primary:'#059669', secondary:'#047857', accent:'#10b981', bg:'#f0fdf4', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'purple-dark',     name:'Royal Purple',      primary:'#7c3aed', secondary:'#6d28d9', accent:'#8b5cf6', bg:'#0d0d1a', card:'#1a1a2e', text:'#ede9fe', textLight:'#a78bfa', dark:true  },
  { id:'rose-white',      name:'Rose Garden',       primary:'#e11d48', secondary:'#be123c', accent:'#f43f5e', bg:'#fff1f2', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'slate-orange',    name:'Slate & Ember',     primary:'#ea580c', secondary:'#c2410c', accent:'#fb923c', bg:'#1e293b', card:'#334155', text:'#f1f5f9', textLight:'#94a3b8', dark:true  },
  { id:'teal-white',      name:'Teal Breeze',       primary:'#0d9488', secondary:'#0f766e', accent:'#14b8a6', bg:'#f0fdfa', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'crimson-black',   name:'Crimson Night',     primary:'#dc2626', secondary:'#b91c1c', accent:'#ef4444', bg:'#0a0a0a', card:'#1c1c1c', text:'#fef2f2', textLight:'#fca5a5', dark:true  },
  { id:'indigo-cream',    name:'Indigo Cream',      primary:'#4338ca', secondary:'#3730a3', accent:'#6366f1', bg:'#faf8f5', card:'#fffbf5', text:'#1e1b4b', textLight:'#6366f1', dark:false },
  { id:'amber-dark',      name:'Amber Dusk',        primary:'#d97706', secondary:'#b45309', accent:'#f59e0b', bg:'#1c1408', card:'#2d2010', text:'#fef3c7', textLight:'#fbbf24', dark:true  },
  { id:'sky-white',       name:'Sky Fresh',         primary:'#0284c7', secondary:'#0369a1', accent:'#38bdf8', bg:'#f0f9ff', card:'#ffffff', text:'#0c4a6e', textLight:'#0284c7', dark:false },
  { id:'lime-dark',       name:'Neon Lime',         primary:'#65a30d', secondary:'#4d7c0f', accent:'#84cc16', bg:'#0a0f02', card:'#111a04', text:'#ecfccb', textLight:'#a3e635', dark:true  },
  { id:'pink-white',      name:'Blush Pink',        primary:'#db2777', secondary:'#be185d', accent:'#ec4899', bg:'#fdf2f8', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'cyan-dark',       name:'Cyber Cyan',        primary:'#0891b2', secondary:'#0e7490', accent:'#22d3ee', bg:'#020f14', card:'#041a24', text:'#cffafe', textLight:'#67e8f9', dark:true  },
  { id:'orange-white',    name:'Sunny Orange',      primary:'#ea580c', secondary:'#c2410c', accent:'#fb923c', bg:'#fff7ed', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'violet-black',    name:'Violet Noir',       primary:'#7c3aed', secondary:'#6d28d9', accent:'#a78bfa', bg:'#0c0010', card:'#180020', text:'#f5f3ff', textLight:'#c4b5fd', dark:true  },
  { id:'green-cream',     name:'Forest Cream',      primary:'#16a34a', secondary:'#15803d', accent:'#22c55e', bg:'#f9fdf9', card:'#f0fdf4', text:'#14532d', textLight:'#16a34a', dark:false },
  { id:'gold-black',      name:'Midas Black',       primary:'#ca8a04', secondary:'#a16207', accent:'#eab308', bg:'#09080a', card:'#1a1608', text:'#fef9c3', textLight:'#facc15', dark:true  },
  { id:'blue-gray',       name:'Steel Blue',        primary:'#3b82f6', secondary:'#2563eb', accent:'#60a5fa', bg:'#f8fafc', card:'#ffffff', text:'#334155', textLight:'#94a3b8', dark:false },
  { id:'red-dark',        name:'Mars Red',          primary:'#b91c1c', secondary:'#991b1b', accent:'#f87171', bg:'#0f0505', card:'#1f0808', text:'#fef2f2', textLight:'#fca5a5', dark:true  },
  { id:'mint-white',      name:'Mint Fresh',        primary:'#10b981', secondary:'#059669', accent:'#34d399', bg:'#f0fdf8', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'navy-gold',       name:'Navy & Gold',       primary:'#ca8a04', secondary:'#a16207', accent:'#fbbf24', bg:'#0a0e1a', card:'#0f172a', text:'#fef3c7', textLight:'#fbbf24', dark:true  },
  { id:'coral-white',     name:'Coral Reef',        primary:'#f97316', secondary:'#ea580c', accent:'#fb923c', bg:'#fff8f5', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'silver-dark',     name:'Silver Ghost',      primary:'#94a3b8', secondary:'#64748b', accent:'#cbd5e1', bg:'#0f172a', card:'#1e293b', text:'#f1f5f9', textLight:'#94a3b8', dark:true  },
  { id:'fuchsia-white',   name:'Fuchsia Bloom',     primary:'#c026d3', secondary:'#a21caf', accent:'#d946ef', bg:'#fdf4ff', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'teal-black',      name:'Deep Teal',         primary:'#0d9488', secondary:'#0f766e', accent:'#2dd4bf', bg:'#020f0e', card:'#041a18', text:'#ccfbf1', textLight:'#5eead4', dark:true  },
  { id:'brown-cream',     name:'Mocha Cream',       primary:'#92400e', secondary:'#78350f', accent:'#b45309', bg:'#fdf8f3', card:'#fffbf7', text:'#3b1f0a', textLight:'#92400e', dark:false },
  { id:'blue-black',      name:'Midnight Blue',     primary:'#1d4ed8', secondary:'#1e40af', accent:'#3b82f6', bg:'#020918', card:'#0a1628', text:'#dbeafe', textLight:'#60a5fa', dark:true  },
  { id:'green-white',     name:'Sage Green',        primary:'#15803d', secondary:'#166534', accent:'#4ade80', bg:'#f7fdf7', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'orange-dark',     name:'Lava Orange',       primary:'#c2410c', secondary:'#9a3412', accent:'#fb923c', bg:'#0f0800', card:'#1a1000', text:'#ffedd5', textLight:'#fb923c', dark:true  },
  { id:'lilac-white',     name:'Lilac Cloud',       primary:'#8b5cf6', secondary:'#7c3aed', accent:'#a78bfa', bg:'#f9f5ff', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'pink-dark',       name:'Neon Pink',         primary:'#db2777', secondary:'#be185d', accent:'#f472b6', bg:'#0f0010', card:'#1a0018', text:'#fdf2f8', textLight:'#f9a8d4', dark:true  },
  { id:'stone-white',     name:'Stone & Sand',      primary:'#78716c', secondary:'#57534e', accent:'#a8a29e', bg:'#fafaf9', card:'#ffffff', text:'#1c1917', textLight:'#78716c', dark:false },
  { id:'green-dark',      name:'Matrix Green',      primary:'#16a34a', secondary:'#15803d', accent:'#4ade80', bg:'#000f04', card:'#001a08', text:'#dcfce7', textLight:'#4ade80', dark:true  },
  { id:'red-white',       name:'Cherry Red',        primary:'#dc2626', secondary:'#b91c1c', accent:'#ef4444', bg:'#fff5f5', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'indigo-dark',     name:'Deep Indigo',       primary:'#4f46e5', secondary:'#4338ca', accent:'#818cf8', bg:'#030318', card:'#0c0c2e', text:'#e0e7ff', textLight:'#818cf8', dark:true  },
  { id:'yellow-dark',     name:'Goldenrod',         primary:'#ca8a04', secondary:'#a16207', accent:'#fde047', bg:'#0a0900', card:'#141200', text:'#fefce8', textLight:'#fde047', dark:true  },
  { id:'blue-green',      name:'Peacock',           primary:'#0891b2', secondary:'#0d9488', accent:'#06b6d4', bg:'#f0fdff', card:'#ffffff', text:'#0c4a6e', textLight:'#0891b2', dark:false },
  { id:'purple-gold',     name:'Imperial',          primary:'#7c3aed', secondary:'#ca8a04', accent:'#a78bfa', bg:'#0a0310', card:'#150520', text:'#f5f3ff', textLight:'#c4b5fd', dark:true  },
  { id:'white-dark',      name:'Pure Monochrome',   primary:'#374151', secondary:'#1f2937', accent:'#6b7280', bg:'#ffffff', card:'#f9fafb', text:'#111827', textLight:'#6b7280', dark:false },
  { id:'rose-dark',       name:'Rose Noir',         primary:'#e11d48', secondary:'#be123c', accent:'#fb7185', bg:'#0a0008', card:'#180010', text:'#fff1f2', textLight:'#fda4af', dark:true  },
  { id:'amber-white',     name:'Honey Amber',       primary:'#d97706', secondary:'#b45309', accent:'#fbbf24', bg:'#fffbeb', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'dark-white',      name:'Charcoal',          primary:'#374151', secondary:'#1f2937', accent:'#9ca3af', bg:'#111827', card:'#1f2937', text:'#f9fafb', textLight:'#d1d5db', dark:true  },
  { id:'sky-dark',        name:'Arctic Night',      primary:'#0284c7', secondary:'#0369a1', accent:'#38bdf8', bg:'#020c18', card:'#041828', text:'#e0f2fe', textLight:'#38bdf8', dark:true  },
  { id:'fuchsia-dark',    name:'Deep Fuchsia',      primary:'#a21caf', secondary:'#86198f', accent:'#e879f9', bg:'#0f0014', card:'#1a0022', text:'#fdf4ff', textLight:'#e879f9', dark:true  },
  { id:'olive-cream',     name:'Olive Grove',       primary:'#65a30d', secondary:'#4d7c0f', accent:'#84cc16', bg:'#f7fdf0', card:'#fafff5', text:'#1a2e05', textLight:'#65a30d', dark:false },
  { id:'copper-dark',     name:'Copper & Coal',     primary:'#b45309', secondary:'#92400e', accent:'#fb923c', bg:'#0c0a08', card:'#1a1410', text:'#fef3c7', textLight:'#fb923c', dark:true  },
  { id:'blue-silver',     name:'Frost',             primary:'#3b82f6', secondary:'#2563eb', accent:'#93c5fd', bg:'#f0f8ff', card:'#ffffff', text:'#1e3a5f', textLight:'#60a5fa', dark:false },
  { id:'green-black',     name:'Jungle Night',      primary:'#15803d', secondary:'#166534', accent:'#86efac', bg:'#010f05', card:'#021a0a', text:'#dcfce7', textLight:'#86efac', dark:true  },
  { id:'purple-white',    name:'Lavender Mist',     primary:'#7c3aed', secondary:'#6d28d9', accent:'#c4b5fd', bg:'#faf5ff', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'masaa_data';

const defaultData = {
  user: { name: 'Alex Johnson', email: 'alex@example.com', timezone: 'UTC+3', themeId: 'blue-white' },
  calendars: [
    { id: 'personal', name: 'Personal', color: '#10b981' },
    { id: 'work',     name: 'Work',     color: '#3b82f6' },
    { id: 'school',   name: 'School',   color: '#f59e0b' },
    { id: 'church',   name: 'Church',   color: '#8b5cf6' },
    { id: 'family',   name: 'Family',   color: '#ef4444' },
  ],
  events: [
    { id:'1', title:'Team Meeting',  date: new Date().toISOString().split('T')[0], startTime:'10:00', endTime:'11:00', calendarId:'work',     color:'#3b82f6', description:'Weekly sync', attendees:['john@co.com'], reminders:['15'], recurring:'none', category:'work' },
    { id:'2', title:'Lunch Break',   date: new Date().toISOString().split('T')[0], startTime:'12:00', endTime:'13:00', calendarId:'personal', color:'#10b981', description:'',           attendees:[],              reminders:[],     recurring:'none', category:'personal' },
    { id:'3', title:'Client Call',   date: new Date(Date.now()+86400000).toISOString().split('T')[0], startTime:'14:00', endTime:'15:00', calendarId:'work', color:'#3b82f6', description:'Project discussion', attendees:['client@co.com'], reminders:['30'], recurring:'none', category:'work' },
  ],
  tasks: [
    { id:'1', title:'Finish project proposal', deadline: new Date().toISOString().split('T')[0],              priority:'high',   completed:false, category:'work' },
    { id:'2', title:'Review documents',         deadline: new Date(Date.now()+86400000).toISOString().split('T')[0],  priority:'medium', completed:false, category:'work' },
    { id:'3', title:'Call dentist',             deadline: new Date(Date.now()+172800000).toISOString().split('T')[0], priority:'low',    completed:false, category:'personal' },
  ],
  bookingPage: {
    id:'booking-1', title:"Alex's Booking Page", description:'Schedule a meeting with me',
    availability: {
      monday:    { start:'09:00', end:'17:00', active:true  },
      tuesday:   { start:'09:00', end:'17:00', active:true  },
      wednesday: { start:'09:00', end:'17:00', active:true  },
      thursday:  { start:'09:00', end:'17:00', active:true  },
      friday:    { start:'09:00', end:'17:00', active:true  },
      saturday:  { start:'10:00', end:'14:00', active:false },
      sunday:    { start:'10:00', end:'14:00', active:false },
    },
    meetingDuration:30, bufferTime:15, bookings:[],
  },
};

const loadData = () => { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : defaultData; } catch { return defaultData; } };
const saveData = (d) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} };

// ─── THEME HELPERS ────────────────────────────────────────────────────────────
function applyTheme(theme) {
  const r = document.documentElement;
  r.style.setProperty('--color-primary',   theme.primary);
  r.style.setProperty('--color-secondary', theme.secondary);
  r.style.setProperty('--color-accent',    theme.accent);
  r.style.setProperty('--color-bg',        theme.bg);
  r.style.setProperty('--color-card',      theme.card);
  r.style.setProperty('--color-text',      theme.text);
  r.style.setProperty('--color-text-light',theme.textLight);
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function MASAAApp() {
  const [data, setData]               = useState(loadData);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [calView, setCalView]         = useState('month'); // month | week | day
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent]     = useState(null);
  const [currentDate, setCurrentDate]       = useState(new Date());

  const theme = THEMES.find(t => t.id === (data.user.themeId || 'blue-white')) || THEMES[0];

  useEffect(() => { applyTheme(theme); }, [theme]);
  useEffect(() => { saveData(data); }, [data]);

  const nav = [
    { id:'dashboard', label:'Dashboard',   icon:Home     },
    { id:'calendar',  label:'Calendar',    icon:Calendar },
    { id:'booking',   label:'Booking',     icon:BookOpen },
    { id:'tasks',     label:'Tasks',       icon:ListTodo },
    { id:'settings',  label:'Settings',    icon:Settings },
  ];

  const updateData = (patch) => setData(d => ({ ...d, ...patch }));

  return (
    <div style={{ background:'var(--color-bg)', color:'var(--color-text)', minHeight:'100vh' }} className="flex h-screen overflow-hidden">
      <Sidebar nav={nav} currentPage={currentPage} setCurrentPage={setCurrentPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} theme={theme} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={data.user} theme={theme}
          calView={calView} setCalView={setCalView} currentPage={currentPage} />
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {currentPage==='dashboard' && <Dashboard data={data} setCurrentPage={setCurrentPage} theme={theme}
            onAddEvent={() => { setEditingEvent(null); setShowEventModal(true); }} />}
          {currentPage==='calendar'  && <CalendarView events={data.events} calendars={data.calendars} calView={calView}
            currentDate={currentDate} setCurrentDate={setCurrentDate} theme={theme}
            onAddEvent={() => { setEditingEvent(null); setShowEventModal(true); }}
            onEditEvent={ev => { setEditingEvent(ev); setShowEventModal(true); }}
            onDeleteEvent={id => updateData({ events: data.events.filter(e => e.id !== id) })} />}
          {currentPage==='booking'   && <BookingPage bookingPage={data.bookingPage} events={data.events} theme={theme}
            update={bp => updateData({ bookingPage: bp })} />}
          {currentPage==='tasks'     && <TasksView tasks={data.tasks} theme={theme}
            onAdd={t  => updateData({ tasks: [...data.tasks, { ...t, id: Date.now().toString() }] })}
            onToggle={id => updateData({ tasks: data.tasks.map(t => t.id===id ? { ...t, completed:!t.completed } : t) })}
            onDelete={id => updateData({ tasks: data.tasks.filter(t => t.id!==id) })} />}
          {currentPage==='settings'  && <SettingsPage user={data.user} theme={theme}
            updateUser={u => updateData({ user: u })} />}
        </div>
      </main>
      {showEventModal && (
        <EventModal event={editingEvent} calendars={data.calendars} theme={theme}
          onClose={() => { setShowEventModal(false); setEditingEvent(null); }}
          onSave={ev => {
            updateData({ events: editingEvent
              ? data.events.map(e => e.id===ev.id ? ev : e)
              : [...data.events, { ...ev, id: Date.now().toString() }]
            });
            setShowEventModal(false); setEditingEvent(null);
          }} />
      )}
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ nav, currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, theme }) {
  const s = { background: theme.secondary, color: '#fff' };
  const items = nav.map(item => {
    const Icon = item.icon;
    const active = currentPage === item.id;
    return (
      <button key={item.id} onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
        style={active ? { background:'rgba(255,255,255,0.2)', fontWeight:700 } : {}}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-white/10 text-white text-left">
        <Icon size={20} /><span>{item.label}</span>
      </button>
    );
  });

  const Logo = () => (
    <div className="p-6 border-b border-white/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <Calendar style={{ color: theme.primary }} size={22} />
        </div>
        <div><h1 className="text-xl font-bold text-white">MASAA</h1>
          <p className="text-xs text-white/70">IT'S ABOUT TIME</p></div>
      </div>
    </div>
  );

  return (
    <>
      {/* desktop */}
      <div style={s} className={`hidden md:flex flex-col w-64 flex-shrink-0 transition-all duration-300 ${!sidebarOpen ? 'w-0 overflow-hidden' : ''}`}>
        <Logo />
        <nav className="flex-1 p-4 space-y-1">{items}</nav>
        <div className="p-4 border-t border-white/20">
          <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white">
            <LogOut size={20} /><span>Sign Out</span>
          </button>
        </div>
      </div>
      {/* mobile overlay */}
      {sidebarOpen && <div className="fixed md:hidden inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}
      <div style={s} className={`fixed md:hidden top-0 left-0 h-screen w-64 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/20 flex justify-between items-center">
          <div className="flex items-center gap-2"><Calendar size={22} className="text-white" /><h1 className="text-xl font-bold text-white">MASAA</h1></div>
          <button onClick={() => setSidebarOpen(false)}><X size={24} className="text-white" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1">{items}</nav>
      </div>
    </>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ sidebarOpen, setSidebarOpen, user, theme, calView, setCalView, currentPage }) {
  return (
    <header style={{ background:'var(--color-card)', borderBottom:'1px solid rgba(128,128,128,0.2)' }} className="sticky top-0 z-30 px-4 md:px-6 py-3 flex justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-black/10 transition">
          <Menu size={22} style={{ color:'var(--color-text)' }} />
        </button>
        <span className="font-bold text-lg hidden sm:block" style={{ color:'var(--color-primary)' }}>MASAA</span>
      </div>
      {currentPage === 'calendar' && (
        <div className="flex gap-1 rounded-lg overflow-hidden border" style={{ borderColor:'var(--color-primary)' }}>
          {['month','week','day'].map(v => (
            <button key={v} onClick={() => setCalView(v)}
              style={{ background: calView===v ? 'var(--color-primary)' : 'transparent', color: calView===v ? '#fff' : 'var(--color-primary)' }}
              className="px-3 py-1 text-sm font-semibold capitalize transition">
              {v}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-black/10 rounded-lg relative transition">
          <Bell size={20} style={{ color:'var(--color-text-light)' }} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ background:`linear-gradient(135deg, ${theme.accent}, ${theme.primary})` }}>
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ data, setCurrentPage, theme, onAddEvent }) {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = data.events.filter(e => e.date >= today)
    .sort((a,b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`)).slice(0,5);
  const incomplete = data.tasks.filter(t => !t.completed).length;
  const todayCount = data.events.filter(e => e.date === today).length;

  const stats = [
    { label:"Today's Events", value:todayCount,                                  icon:<Calendar size={22}/> },
    { label:'Upcoming',       value:upcoming.length,                             icon:<Clock size={22}/> },
    { label:'Tasks Done',     value:data.tasks.filter(t=>t.completed).length,    icon:<CheckCircle2 size={22}/> },
    { label:'Pending Tasks',  value:incomplete,                                  icon:<ListTodo size={22}/> },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="rounded-xl p-8 shadow-lg text-white" style={{ background:`linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        <h1 className="text-3xl font-bold mb-1">Welcome back, {data.user.name}!</h1>
        <p className="opacity-80">You have {todayCount} events today and {incomplete} pending tasks.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s,i) => (
          <div key={i} className="rounded-xl p-5 shadow" style={{ background:'var(--color-card)' }}>
            <div style={{ color:'var(--color-primary)' }} className="mb-2">{s.icon}</div>
            <p className="text-sm" style={{ color:'var(--color-text-light)' }}>{s.label}</p>
            <p className="text-3xl font-bold" style={{ color:'var(--color-primary)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl shadow p-6" style={{ background:'var(--color-card)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color:'var(--color-text)' }}>Upcoming Events</h2>
          <div className="space-y-3">
            {upcoming.length > 0 ? upcoming.map(ev => (
              <div key={ev.id} className="flex items-center gap-3 pb-3 border-b last:border-0" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: ev.color || theme.primary }} />
                <div className="flex-1">
                  <p className="font-semibold" style={{ color:'var(--color-text)' }}>{ev.title}</p>
                  <p className="text-xs" style={{ color:'var(--color-text-light)' }}>{ev.date} · {ev.startTime}</p>
                </div>
              </div>
            )) : <p style={{ color:'var(--color-text-light)' }}>No upcoming events</p>}
          </div>
          <button onClick={() => setCurrentPage('calendar')} className="mt-4 w-full py-2 rounded-lg text-sm font-semibold transition hover:opacity-80"
            style={{ background:`${theme.primary}20`, color:'var(--color-primary)' }}>View Calendar →</button>
        </div>

        <div className="rounded-xl shadow p-6" style={{ background:'var(--color-card)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color:'var(--color-text)' }}>Pending Tasks</h2>
          <div className="space-y-3">
            {data.tasks.filter(t=>!t.completed).slice(0,5).map(task => (
              <div key={task.id} className="flex items-center gap-3 pb-3 border-b last:border-0" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
                <div className={`w-2 h-8 rounded-full flex-shrink-0 ${task.priority==='high'?'bg-red-500':task.priority==='medium'?'bg-yellow-500':'bg-green-500'}`} />
                <div className="flex-1">
                  <p className="font-semibold" style={{ color:'var(--color-text)' }}>{task.title}</p>
                  <p className="text-xs" style={{ color:'var(--color-text-light)' }}>{task.deadline}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setCurrentPage('tasks')} className="mt-4 w-full py-2 rounded-lg text-sm font-semibold transition hover:opacity-80"
            style={{ background:`${theme.primary}20`, color:'var(--color-primary)' }}>View All Tasks →</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label:'New Event',    icon:<Plus size={18}/>,     action:onAddEvent },
          { label:'Booking Page', icon:<Share2 size={18}/>,   action:() => setCurrentPage('booking') },
          { label:'View Calendar',icon:<Calendar size={18}/>, action:() => setCurrentPage('calendar') },
        ].map((btn,i) => (
          <button key={i} onClick={btn.action}
            style={ i===0 ? { background:'var(--color-primary)', color:'#fff' } : { background:'var(--color-card)', color:'var(--color-primary)', border:`2px solid var(--color-primary)` } }
            className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition hover:opacity-80">
            {btn.icon}{btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── CALENDAR VIEW (month / week / day) ───────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const HOUR_LABELS = Array.from({length:24},(_,i)=> `${String(i).padStart(2,'0')}:00`);

function CalendarView({ events, calendars, calView, currentDate, setCurrentDate, theme, onAddEvent, onEditEvent, onDeleteEvent }) {
  return (
    <div className="space-y-4 max-w-6xl">
      {/* Nav bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color:'var(--color-text)' }}>
          {calView==='month' && `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          {calView==='week'  && `Week of ${new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()).toLocaleDateString()}`}
          {calView==='day'   && currentDate.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => setCurrentDate(d => navigate(d, calView, -1))} className="p-2 rounded-lg hover:bg-black/10 transition"><ChevronLeft size={22} style={{ color:'var(--color-text)' }} /></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold transition hover:opacity-80" style={{ background:'var(--color-primary)' }}>Today</button>
          <button onClick={() => setCurrentDate(d => navigate(d, calView,  1))} className="p-2 rounded-lg hover:bg-black/10 transition"><ChevronRight size={22} style={{ color:'var(--color-text)' }} /></button>
        </div>
      </div>

      {calView==='month' && <MonthGrid events={events} currentDate={currentDate} theme={theme} onEdit={onEditEvent} onDelete={onDeleteEvent} onAdd={onAddEvent} />}
      {calView==='week'  && <WeekGrid  events={events} currentDate={currentDate} theme={theme} onEdit={onEditEvent} />}
      {calView==='day'   && <DayGrid   events={events} currentDate={currentDate} theme={theme} onEdit={onEditEvent} />}

      <button onClick={onAddEvent} className="w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 hover:opacity-80 transition" style={{ background:'var(--color-primary)' }}>
        <Plus size={20} /> Add Event
      </button>
    </div>
  );
}

function navigate(date, view, dir) {
  const d = new Date(date);
  if (view==='month') d.setMonth(d.getMonth() + dir);
  if (view==='week')  d.setDate(d.getDate() + dir*7);
  if (view==='day')   d.setDate(d.getDate() + dir);
  return d;
}

// Month grid
function MonthGrid({ events, currentDate, theme, onEdit, onDelete, onAdd }) {
  const year = currentDate.getFullYear(), month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];
  const cells = [...Array(firstDay).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];

  const eventsOn = (day) => {
    const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return events.filter(e => e.date===ds);
  };

  return (
    <div className="rounded-xl shadow overflow-hidden" style={{ background:'var(--color-card)' }}>
      <div className="grid grid-cols-7">
        {DAY_NAMES.map(d => (
          <div key={d} className="p-3 text-center text-xs font-bold uppercase" style={{ background:`${theme.primary}15`, color:'var(--color-primary)' }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const ds = day ? `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` : null;
          const isToday = ds === today;
          const evs = day ? eventsOn(day) : [];
          return (
            <div key={i} className="min-h-24 p-1.5 border-r border-b last:border-r-0 transition" style={{ borderColor:'rgba(128,128,128,0.15)', background: isToday ? `${theme.primary}12` : 'transparent' }}>
              {day && (
                <>
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold mb-1 ${isToday?'text-white':''}`}
                    style={{ background: isToday ? 'var(--color-primary)' : 'transparent', color: isToday ? '#fff' : 'var(--color-text)' }}>{day}</div>
                  <div className="space-y-0.5">
                    {evs.slice(0,2).map(ev => (
                      <div key={ev.id} onClick={() => onEdit(ev)} title={ev.title}
                        className="text-xs px-1 py-0.5 rounded cursor-pointer truncate text-white hover:opacity-80 transition"
                        style={{ background: ev.color || 'var(--color-primary)' }}>{ev.title}</div>
                    ))}
                    {evs.length>2 && <div className="text-xs" style={{ color:'var(--color-text-light)' }}>+{evs.length-2} more</div>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Week grid
function WeekGrid({ events, currentDate, theme, onEdit }) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const days = Array.from({length:7}, (_,i) => { const d = new Date(startOfWeek); d.setDate(d.getDate()+i); return d; });
  const hours = Array.from({length:24},(_,i)=>i);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="rounded-xl shadow overflow-auto" style={{ background:'var(--color-card)', maxHeight:'65vh' }}>
      <div className="grid sticky top-0 z-10" style={{ gridTemplateColumns:'60px repeat(7, 1fr)', background:'var(--color-card)' }}>
        <div className="p-2 border-r border-b" style={{ borderColor:'rgba(128,128,128,0.15)' }} />
        {days.map((d,i) => {
          const ds = d.toISOString().split('T')[0];
          return <div key={i} className="p-2 text-center text-xs font-bold border-r border-b last:border-r-0" style={{ borderColor:'rgba(128,128,128,0.15)', color: ds===today ? 'var(--color-primary)' : 'var(--color-text)' }}>
            {DAY_NAMES[d.getDay()]} {d.getDate()}
          </div>;
        })}
      </div>
      {hours.map(hour => (
        <div key={hour} className="grid" style={{ gridTemplateColumns:'60px repeat(7, 1fr)' }}>
          <div className="p-1 text-xs text-right pr-2 border-r border-b" style={{ borderColor:'rgba(128,128,128,0.15)', color:'var(--color-text-light)' }}>{String(hour).padStart(2,'0')}:00</div>
          {days.map((d,i) => {
            const ds = d.toISOString().split('T')[0];
            const slotEvs = events.filter(e => e.date===ds && parseInt(e.startTime)===hour);
            return (
              <div key={i} className="border-r border-b last:border-r-0 min-h-12 p-0.5 relative" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
                {slotEvs.map(ev => (
                  <div key={ev.id} onClick={() => onEdit(ev)} title={ev.title}
                    className="text-xs px-1 py-0.5 rounded cursor-pointer truncate text-white hover:opacity-80 transition mb-0.5"
                    style={{ background: ev.color || 'var(--color-primary)' }}>{ev.title}</div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Day grid
function DayGrid({ events, currentDate, theme, onEdit }) {
  const ds = currentDate.toISOString().split('T')[0];
  const dayEvs = events.filter(e => e.date===ds).sort((a,b)=>a.startTime.localeCompare(b.startTime));
  const hours = Array.from({length:24},(_,i)=>i);

  return (
    <div className="rounded-xl shadow overflow-auto" style={{ background:'var(--color-card)', maxHeight:'65vh' }}>
      {hours.map(hour => {
        const slotEvs = dayEvs.filter(e => parseInt(e.startTime)===hour);
        return (
          <div key={hour} className="flex border-b min-h-14" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
            <div className="w-16 flex-shrink-0 p-2 text-xs text-right pr-3 border-r" style={{ borderColor:'rgba(128,128,128,0.15)', color:'var(--color-text-light)' }}>{String(hour).padStart(2,'0')}:00</div>
            <div className="flex-1 p-1 space-y-1">
              {slotEvs.map(ev => (
                <div key={ev.id} onClick={() => onEdit(ev)}
                  className="px-3 py-2 rounded-lg text-sm text-white cursor-pointer hover:opacity-80 transition flex items-center gap-2"
                  style={{ background: ev.color || 'var(--color-primary)' }}>
                  <span className="font-semibold">{ev.title}</span>
                  <span className="opacity-80 text-xs">{ev.startTime}–{ev.endTime}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── EVENT MODAL ─────────────────────────────────────────────────────────────
const EVENT_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316','#14b8a6','#6366f1'];
const REMINDER_OPTIONS = ['5','10','15','30','60','1440'];
const REMINDER_LABELS  = { '5':'5 min','10':'10 min','15':'15 min','30':'30 min','60':'1 hour','1440':'1 day' };
const RECURRING_OPTIONS = ['none','daily','weekly','biweekly','monthly','yearly'];

function EventModal({ event, calendars, theme, onClose, onSave }) {
  const [title,       setTitle]       = useState(event?.title       || '');
  const [date,        setDate]        = useState(event?.date        || new Date().toISOString().split('T')[0]);
  const [startTime,   setStartTime]   = useState(event?.startTime   || '09:00');
  const [endTime,     setEndTime]     = useState(event?.endTime     || '10:00');
  const [calendarId,  setCalendarId]  = useState(event?.calendarId  || (calendars[0]?.id || 'personal'));
  const [color,       setColor]       = useState(event?.color       || '#3b82f6');
  const [description, setDescription] = useState(event?.description || '');
  const [attendees,   setAttendees]   = useState((event?.attendees || []).join(', '));
  const [reminders,   setReminders]   = useState(event?.reminders   || []);
  const [recurring,   setRecurring]   = useState(event?.recurring   || 'none');

  const toggleReminder = (val) => setReminders(r => r.includes(val) ? r.filter(x=>x!==val) : [...r, val]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ ...event, title, date, startTime, endTime, calendarId, color, description,
      attendees: attendees.split(',').map(s=>s.trim()).filter(Boolean), reminders, recurring });
  };

  const inp = "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2";
  const inpStyle = { background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.3)' };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]" style={{ background:'var(--color-card)' }}>
        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
          <h2 className="text-xl font-bold" style={{ color:'var(--color-text)' }}>{event ? 'Edit Event' : 'New Event'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded"><X size={20} style={{ color:'var(--color-text)' }} /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Title */}
          <input className={inp} style={inpStyle} placeholder="Event title" value={title} onChange={e=>setTitle(e.target.value)} />

          {/* Date & times */}
          <div className="grid grid-cols-3 gap-3">
            <input type="date" className={inp} style={inpStyle} value={date} onChange={e=>setDate(e.target.value)} />
            <input type="time" className={inp} style={inpStyle} value={startTime} onChange={e=>setStartTime(e.target.value)} />
            <input type="time" className={inp} style={inpStyle} value={endTime}   onChange={e=>setEndTime(e.target.value)} />
          </div>

          {/* Calendar & recurring */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Calendar</label>
              <select className={inp} style={inpStyle} value={calendarId} onChange={e=>setCalendarId(e.target.value)}>
                {calendars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Recurring</label>
              <select className={inp} style={inpStyle} value={recurring} onChange={e=>setRecurring(e.target.value)}>
                {RECURRING_OPTIONS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color:'var(--color-text-light)' }}>Event Color</label>
            <div className="flex gap-2 flex-wrap">
              {EVENT_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition hover:scale-110"
                  style={{ background:c, outline: color===c ? `3px solid var(--color-text)` : 'none', outlineOffset:2 }} />
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color:'var(--color-text-light)' }}>Reminders</label>
            <div className="flex gap-2 flex-wrap">
              {REMINDER_OPTIONS.map(r => (
                <button key={r} onClick={() => toggleReminder(r)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition"
                  style={{ background: reminders.includes(r) ? 'var(--color-primary)' : `${theme.primary}20`,
                           color:      reminders.includes(r) ? '#fff'                  : 'var(--color-primary)' }}>
                  {REMINDER_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          {/* Attendees */}
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Attendees (comma-separated emails)</label>
            <input className={inp} style={inpStyle} placeholder="john@example.com, jane@example.com" value={attendees} onChange={e=>setAttendees(e.target.value)} />
          </div>

          {/* Description */}
          <textarea className={`${inp} resize-none`} style={inpStyle} rows={3} placeholder="Description or notes…" value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg font-semibold text-sm transition hover:opacity-80" style={{ background:'rgba(128,128,128,0.15)', color:'var(--color-text)' }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2 rounded-lg font-semibold text-sm text-white transition hover:opacity-80" style={{ background:'var(--color-primary)' }}>Save Event</button>
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING PAGE ─────────────────────────────────────────────────────────────
function BookingPage({ bookingPage, events, theme, update }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}?booking=${bookingPage.id}`;
  const copy = () => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const slots = [];
  for (let i=0;i<7;i++) {
    const d = new Date(Date.now()+i*86400000);
    const day = dayNames[d.getDay()], cfg = bookingPage.availability[day];
    const ds = d.toISOString().split('T')[0];
    if (cfg.active) {
      const [sh] = cfg.start.split(':').map(Number), [eh] = cfg.end.split(':').map(Number);
      for (let h=sh;h<eh;h++) for (let m=0;m<60;m+=bookingPage.meetingDuration) {
        const t = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
        const busy = events.some(e => e.date===ds && e.startTime<=t && e.endTime>t);
        if (!busy) slots.push({date:ds,time:t});
      }
    }
  }

  const inp = "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2";
  const is  = { background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.3)' };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-xl shadow p-6" style={{ background:'var(--color-card)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color:'var(--color-text)' }}>Booking Page Settings</h2>
        <div className="space-y-4">
          <input className={inp} style={is} placeholder="Page Title" value={bookingPage.title} onChange={e=>update({...bookingPage,title:e.target.value})} />
          <textarea className={`${inp} resize-none`} style={is} rows={2} placeholder="Description" value={bookingPage.description} onChange={e=>update({...bookingPage,description:e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Meeting Duration (min)</label>
              <input type="number" className={inp} style={is} value={bookingPage.meetingDuration} onChange={e=>update({...bookingPage,meetingDuration:+e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Buffer Time (min)</label>
              <input type="number" className={inp} style={is} value={bookingPage.bufferTime} onChange={e=>update({...bookingPage,bufferTime:+e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl shadow p-6" style={{ background:'var(--color-card)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color:'var(--color-text)' }}>Weekly Availability</h2>
        <div className="space-y-2">
          {Object.entries(bookingPage.availability).map(([day,cfg]) => (
            <div key={day} className="flex items-center gap-4 p-3 rounded-lg" style={{ background:'var(--color-bg)' }}>
              <span className="w-24 capitalize text-sm font-semibold" style={{ color:'var(--color-text)' }}>{day}</span>
              <input type="checkbox" checked={cfg.active} onChange={e => { const u={...bookingPage}; u.availability[day].active=e.target.checked; update(u); }} className="w-4 h-4 cursor-pointer" />
              {cfg.active && <>
                <input type="time" value={cfg.start} onChange={e=>{const u={...bookingPage};u.availability[day].start=e.target.value;update(u);}} className="px-2 py-1 rounded border text-sm" style={is} />
                <span style={{ color:'var(--color-text-light)' }}>to</span>
                <input type="time" value={cfg.end}   onChange={e=>{const u={...bookingPage};u.availability[day].end=e.target.value;update(u);}}   className="px-2 py-1 rounded border text-sm" style={is} />
              </>}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-6 text-white" style={{ background:`linear-gradient(135deg,${theme.primary},${theme.secondary})` }}>
        <h2 className="text-lg font-bold mb-3">Your Booking Link</h2>
        <div className="flex gap-2">
          <input readOnly value={link} className="flex-1 px-3 py-2 rounded-lg text-sm bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none" />
          <button onClick={copy} className="px-5 py-2 bg-white font-semibold rounded-lg text-sm hover:opacity-80 transition" style={{ color:'var(--color-primary)' }}>{copied?'Copied!':'Copy'}</button>
        </div>
      </div>

      <div className="rounded-xl shadow p-6" style={{ background:'var(--color-card)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color:'var(--color-text)' }}>Available Slots (Next 7 Days)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {slots.slice(0,16).map((s,i)=>(
            <div key={i} className="p-3 rounded-lg text-center border" style={{ borderColor:'rgba(128,128,128,0.2)', background:'var(--color-bg)' }}>
              <p className="font-semibold text-sm" style={{ color:'var(--color-text)' }}>{s.time}</p>
              <p className="text-xs" style={{ color:'var(--color-text-light)' }}>{new Date(s.date+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TASKS VIEW ───────────────────────────────────────────────────────────────
function TasksView({ tasks, theme, onAdd, onToggle, onDelete }) {
  const [title,    setTitle]    = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState('medium');

  const add = () => {
    if (!title.trim()) return;
    onAdd({ title, deadline, priority, completed:false, category:'personal' });
    setTitle(''); setPriority('medium');
  };

  const inp = "px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2";
  const is  = { background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.3)' };

  const sections = [
    { label:'High Priority',   color:'#ef4444', items: tasks.filter(t=>t.priority==='high'   && !t.completed) },
    { label:'Medium Priority', color:'#f59e0b', items: tasks.filter(t=>t.priority==='medium' && !t.completed) },
    { label:'Low Priority',    color:'#10b981', items: tasks.filter(t=>t.priority==='low'    && !t.completed) },
    { label:'Completed',       color:'#94a3b8', items: tasks.filter(t=>t.completed) },
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="rounded-xl shadow p-6" style={{ background:'var(--color-card)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color:'var(--color-text)' }}>Add New Task</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input className={`flex-1 ${inp}`} style={is} placeholder="What needs to be done?" value={title}
            onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} />
          <input type="date" className={inp} style={is} value={deadline} onChange={e=>setDeadline(e.target.value)} />
          <select className={inp} style={is} value={priority} onChange={e=>setPriority(e.target.value)}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
          <button onClick={add} className="px-4 py-2 rounded-lg text-white font-semibold text-sm hover:opacity-80 transition" style={{ background:'var(--color-primary)' }}>
            <Plus size={18} />
          </button>
        </div>
      </div>

      {sections.map(sec => sec.items.length > 0 && (
        <div key={sec.label} className="rounded-xl shadow p-6" style={{ background:'var(--color-card)', borderLeft:`4px solid ${sec.color}` }}>
          <h3 className="font-bold mb-3 text-base" style={{ color:'var(--color-text)' }}>{sec.label}</h3>
          <div className="space-y-2">
            {sec.items.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 transition" style={{ background:'var(--color-bg)' }}>
                <input type="checkbox" checked={task.completed} onChange={()=>onToggle(task.id)} className="w-4 h-4 cursor-pointer" />
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:sec.color }} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${task.completed?'line-through opacity-50':''}`} style={{ color:'var(--color-text)' }}>{task.title}</p>
                  <p className="text-xs" style={{ color:'var(--color-text-light)' }}>{task.deadline}</p>
                </div>
                <button onClick={()=>onDelete(task.id)} className="p-1.5 hover:bg-red-100 rounded text-red-500 transition"><Trash2 size={15}/></button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {tasks.length===0 && (
        <div className="text-center py-16 rounded-xl" style={{ background:'var(--color-card)' }}>
          <CheckCircle2 size={48} className="mx-auto mb-3 opacity-20" style={{ color:'var(--color-text)' }} />
          <p style={{ color:'var(--color-text-light)' }}>No tasks yet. Add one above!</p>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ user, theme, updateUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [search, setSearch] = useState('');

  const inp = "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2";
  const is  = { background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.3)' };

  const filtered = THEMES.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const tabs = [
    { id:'profile', label:'Profile' },
    { id:'themes',  label:'Themes'  },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Tab switcher */}
      <div className="flex gap-2 p-1 rounded-xl w-fit" style={{ background:'var(--color-card)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition"
            style={{ background: activeTab===t.id ? 'var(--color-primary)' : 'transparent',
                     color:      activeTab===t.id ? '#fff' : 'var(--color-text-light)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="rounded-xl shadow p-6 space-y-4" style={{ background:'var(--color-card)' }}>
          <h2 className="text-xl font-bold" style={{ color:'var(--color-text)' }}>Account Settings</h2>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Full Name</label>
            <input className={inp} style={is} value={user.name} onChange={e=>updateUser({...user,name:e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Email</label>
            <input type="email" className={inp} style={is} value={user.email} onChange={e=>updateUser({...user,email:e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Timezone</label>
            <select className={inp} style={is} value={user.timezone} onChange={e=>updateUser({...user,timezone:e.target.value})}>
              {['UTC-5','UTC-4','UTC-3','UTC+0','UTC+1','UTC+2','UTC+3','UTC+4','UTC+5','UTC+5:30','UTC+8','UTC+9','UTC+10'].map(z=>(
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
          <button className="w-full py-2 rounded-lg text-white font-semibold text-sm hover:opacity-80 transition" style={{ background:'var(--color-primary)' }}>
            Save Changes
          </button>
          <div className="mt-4 pt-4 border-t" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
            <button className="text-red-500 hover:text-red-600 text-sm font-semibold transition">Delete Account</button>
          </div>
        </div>
      )}

      {activeTab === 'themes' && (
        <div className="space-y-4">
          <div className="rounded-xl shadow p-6" style={{ background:'var(--color-card)' }}>
            <h2 className="text-xl font-bold mb-1" style={{ color:'var(--color-text)' }}>Choose Your Theme</h2>
            <p className="text-sm mb-4" style={{ color:'var(--color-text-light)' }}>50 color combinations — light and dark. Pick what feels right.</p>
            <input className={`${inp} mb-4`} style={is} placeholder="Search themes…" value={search} onChange={e=>setSearch(e.target.value)} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filtered.map(t => {
                const active = user.themeId === t.id;
                return (
                  <button key={t.id} onClick={() => updateUser({...user, themeId:t.id})}
                    className="rounded-xl p-4 text-left transition hover:scale-105 border-2"
                    style={{ background:t.bg, borderColor: active ? t.primary : 'transparent', boxShadow: active ? `0 0 0 2px ${t.primary}` : 'none' }}>
                    {/* Mini preview swatches */}
                    <div className="flex gap-1 mb-2">
                      <div className="w-5 h-5 rounded-full" style={{ background:t.primary }} />
                      <div className="w-5 h-5 rounded-full" style={{ background:t.secondary }} />
                      <div className="w-5 h-5 rounded-full" style={{ background:t.accent }} />
                    </div>
                    <p className="text-xs font-bold truncate" style={{ color:t.text }}>{t.name}</p>
                    <p className="text-xs opacity-60" style={{ color:t.text }}>{t.dark ? '🌙 Dark' : '☀️ Light'}</p>
                    {active && <div className="mt-1 text-xs font-bold" style={{ color:t.primary }}>✓ Active</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
