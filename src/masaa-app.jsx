import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, Plus, Clock, CheckCircle2, Settings, Bell,
  LogOut, Menu, X, ChevronLeft, ChevronRight, Trash2,
  Edit2, Share2, Home, BookOpen, ListTodo, Users, BarChart2,
  Repeat, AlarmClock, Palette, Mic, Send, Brain
} from 'lucide-react';
import AuthScreen         from './components/AuthScreen.jsx';
import ContactsPage       from './components/ContactsPage.jsx';
import AnalyticsPage      from './components/AnalyticsPage.jsx';
import NotificationCenter from './components/NotificationCenter.jsx';
import ReportsPage        from './components/ReportsPage.jsx';

// ─── 50 THEMES ────────────────────────────────────────────────────────────────
export const THEMES = [
  { id:'blue-white',    name:'Ocean Blue',      primary:'#2563eb', secondary:'#1d4ed8', accent:'#3b82f6', bg:'#f0f4ff', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'black-gold',    name:'Black & Gold',    primary:'#b45309', secondary:'#92400e', accent:'#f59e0b', bg:'#0f0f0f', card:'#1a1a1a', text:'#fef3c7', textLight:'#d97706', dark:true  },
  { id:'emerald-white', name:'Emerald',         primary:'#059669', secondary:'#047857', accent:'#10b981', bg:'#f0fdf4', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'purple-dark',   name:'Royal Purple',    primary:'#7c3aed', secondary:'#6d28d9', accent:'#8b5cf6', bg:'#0d0d1a', card:'#1a1a2e', text:'#ede9fe', textLight:'#a78bfa', dark:true  },
  { id:'rose-white',    name:'Rose Garden',     primary:'#e11d48', secondary:'#be123c', accent:'#f43f5e', bg:'#fff1f2', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'slate-orange',  name:'Slate & Ember',   primary:'#ea580c', secondary:'#c2410c', accent:'#fb923c', bg:'#1e293b', card:'#334155', text:'#f1f5f9', textLight:'#94a3b8', dark:true  },
  { id:'teal-white',    name:'Teal Breeze',     primary:'#0d9488', secondary:'#0f766e', accent:'#14b8a6', bg:'#f0fdfa', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'crimson-black', name:'Crimson Night',   primary:'#dc2626', secondary:'#b91c1c', accent:'#ef4444', bg:'#0a0a0a', card:'#1c1c1c', text:'#fef2f2', textLight:'#fca5a5', dark:true  },
  { id:'indigo-cream',  name:'Indigo Cream',    primary:'#4338ca', secondary:'#3730a3', accent:'#6366f1', bg:'#faf8f5', card:'#fffbf5', text:'#1e1b4b', textLight:'#6366f1', dark:false },
  { id:'amber-dark',    name:'Amber Dusk',      primary:'#d97706', secondary:'#b45309', accent:'#f59e0b', bg:'#1c1408', card:'#2d2010', text:'#fef3c7', textLight:'#fbbf24', dark:true  },
  { id:'sky-white',     name:'Sky Fresh',       primary:'#0284c7', secondary:'#0369a1', accent:'#38bdf8', bg:'#f0f9ff', card:'#ffffff', text:'#0c4a6e', textLight:'#0284c7', dark:false },
  { id:'lime-dark',     name:'Neon Lime',       primary:'#65a30d', secondary:'#4d7c0f', accent:'#84cc16', bg:'#0a0f02', card:'#111a04', text:'#ecfccb', textLight:'#a3e635', dark:true  },
  { id:'pink-white',    name:'Blush Pink',      primary:'#db2777', secondary:'#be185d', accent:'#ec4899', bg:'#fdf2f8', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'cyan-dark',     name:'Cyber Cyan',      primary:'#0891b2', secondary:'#0e7490', accent:'#22d3ee', bg:'#020f14', card:'#041a24', text:'#cffafe', textLight:'#67e8f9', dark:true  },
  { id:'orange-white',  name:'Sunny Orange',    primary:'#ea580c', secondary:'#c2410c', accent:'#fb923c', bg:'#fff7ed', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'violet-black',  name:'Violet Noir',     primary:'#7c3aed', secondary:'#6d28d9', accent:'#a78bfa', bg:'#0c0010', card:'#180020', text:'#f5f3ff', textLight:'#c4b5fd', dark:true  },
  { id:'green-cream',   name:'Forest Cream',    primary:'#16a34a', secondary:'#15803d', accent:'#22c55e', bg:'#f9fdf9', card:'#f0fdf4', text:'#14532d', textLight:'#16a34a', dark:false },
  { id:'gold-black',    name:'Midas Black',     primary:'#ca8a04', secondary:'#a16207', accent:'#eab308', bg:'#09080a', card:'#1a1608', text:'#fef9c3', textLight:'#facc15', dark:true  },
  { id:'blue-gray',     name:'Steel Blue',      primary:'#3b82f6', secondary:'#2563eb', accent:'#60a5fa', bg:'#f8fafc', card:'#ffffff', text:'#334155', textLight:'#94a3b8', dark:false },
  { id:'red-dark',      name:'Mars Red',        primary:'#b91c1c', secondary:'#991b1b', accent:'#f87171', bg:'#0f0505', card:'#1f0808', text:'#fef2f2', textLight:'#fca5a5', dark:true  },
  { id:'mint-white',    name:'Mint Fresh',      primary:'#10b981', secondary:'#059669', accent:'#34d399', bg:'#f0fdf8', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'navy-gold',     name:'Navy & Gold',     primary:'#ca8a04', secondary:'#a16207', accent:'#fbbf24', bg:'#0a0e1a', card:'#0f172a', text:'#fef3c7', textLight:'#fbbf24', dark:true  },
  { id:'coral-white',   name:'Coral Reef',      primary:'#f97316', secondary:'#ea580c', accent:'#fb923c', bg:'#fff8f5', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'silver-dark',   name:'Silver Ghost',    primary:'#94a3b8', secondary:'#64748b', accent:'#cbd5e1', bg:'#0f172a', card:'#1e293b', text:'#f1f5f9', textLight:'#94a3b8', dark:true  },
  { id:'fuchsia-white', name:'Fuchsia Bloom',   primary:'#c026d3', secondary:'#a21caf', accent:'#d946ef', bg:'#fdf4ff', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'teal-black',    name:'Deep Teal',       primary:'#0d9488', secondary:'#0f766e', accent:'#2dd4bf', bg:'#020f0e', card:'#041a18', text:'#ccfbf1', textLight:'#5eead4', dark:true  },
  { id:'brown-cream',   name:'Mocha Cream',     primary:'#92400e', secondary:'#78350f', accent:'#b45309', bg:'#fdf8f3', card:'#fffbf7', text:'#3b1f0a', textLight:'#92400e', dark:false },
  { id:'blue-black',    name:'Midnight Blue',   primary:'#1d4ed8', secondary:'#1e40af', accent:'#3b82f6', bg:'#020918', card:'#0a1628', text:'#dbeafe', textLight:'#60a5fa', dark:true  },
  { id:'green-white',   name:'Sage Green',      primary:'#15803d', secondary:'#166534', accent:'#4ade80', bg:'#f7fdf7', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'orange-dark',   name:'Lava Orange',     primary:'#c2410c', secondary:'#9a3412', accent:'#fb923c', bg:'#0f0800', card:'#1a1000', text:'#ffedd5', textLight:'#fb923c', dark:true  },
  { id:'lilac-white',   name:'Lilac Cloud',     primary:'#8b5cf6', secondary:'#7c3aed', accent:'#a78bfa', bg:'#f9f5ff', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'pink-dark',     name:'Neon Pink',       primary:'#db2777', secondary:'#be185d', accent:'#f472b6', bg:'#0f0010', card:'#1a0018', text:'#fdf2f8', textLight:'#f9a8d4', dark:true  },
  { id:'stone-white',   name:'Stone & Sand',    primary:'#78716c', secondary:'#57534e', accent:'#a8a29e', bg:'#fafaf9', card:'#ffffff', text:'#1c1917', textLight:'#78716c', dark:false },
  { id:'green-dark',    name:'Matrix Green',    primary:'#16a34a', secondary:'#15803d', accent:'#4ade80', bg:'#000f04', card:'#001a08', text:'#dcfce7', textLight:'#4ade80', dark:true  },
  { id:'red-white',     name:'Cherry Red',      primary:'#dc2626', secondary:'#b91c1c', accent:'#ef4444', bg:'#fff5f5', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'indigo-dark',   name:'Deep Indigo',     primary:'#4f46e5', secondary:'#4338ca', accent:'#818cf8', bg:'#030318', card:'#0c0c2e', text:'#e0e7ff', textLight:'#818cf8', dark:true  },
  { id:'yellow-dark',   name:'Goldenrod',       primary:'#ca8a04', secondary:'#a16207', accent:'#fde047', bg:'#0a0900', card:'#141200', text:'#fefce8', textLight:'#fde047', dark:true  },
  { id:'blue-green',    name:'Peacock',         primary:'#0891b2', secondary:'#0d9488', accent:'#06b6d4', bg:'#f0fdff', card:'#ffffff', text:'#0c4a6e', textLight:'#0891b2', dark:false },
  { id:'purple-gold',   name:'Imperial',        primary:'#7c3aed', secondary:'#ca8a04', accent:'#a78bfa', bg:'#0a0310', card:'#150520', text:'#f5f3ff', textLight:'#c4b5fd', dark:true  },
  { id:'white-dark',    name:'Pure Monochrome', primary:'#374151', secondary:'#1f2937', accent:'#6b7280', bg:'#ffffff', card:'#f9fafb', text:'#111827', textLight:'#6b7280', dark:false },
  { id:'rose-dark',     name:'Rose Noir',       primary:'#e11d48', secondary:'#be123c', accent:'#fb7185', bg:'#0a0008', card:'#180010', text:'#fff1f2', textLight:'#fda4af', dark:true  },
  { id:'amber-white',   name:'Honey Amber',     primary:'#d97706', secondary:'#b45309', accent:'#fbbf24', bg:'#fffbeb', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
  { id:'dark-white',    name:'Charcoal',        primary:'#374151', secondary:'#1f2937', accent:'#9ca3af', bg:'#111827', card:'#1f2937', text:'#f9fafb', textLight:'#d1d5db', dark:true  },
  { id:'sky-dark',      name:'Arctic Night',    primary:'#0284c7', secondary:'#0369a1', accent:'#38bdf8', bg:'#020c18', card:'#041828', text:'#e0f2fe', textLight:'#38bdf8', dark:true  },
  { id:'fuchsia-dark',  name:'Deep Fuchsia',    primary:'#a21caf', secondary:'#86198f', accent:'#e879f9', bg:'#0f0014', card:'#1a0022', text:'#fdf4ff', textLight:'#e879f9', dark:true  },
  { id:'olive-cream',   name:'Olive Grove',     primary:'#65a30d', secondary:'#4d7c0f', accent:'#84cc16', bg:'#f7fdf0', card:'#fafff5', text:'#1a2e05', textLight:'#65a30d', dark:false },
  { id:'copper-dark',   name:'Copper & Coal',   primary:'#b45309', secondary:'#92400e', accent:'#fb923c', bg:'#0c0a08', card:'#1a1410', text:'#fef3c7', textLight:'#fb923c', dark:true  },
  { id:'blue-silver',   name:'Frost',           primary:'#3b82f6', secondary:'#2563eb', accent:'#93c5fd', bg:'#f0f8ff', card:'#ffffff', text:'#1e3a5f', textLight:'#60a5fa', dark:false },
  { id:'green-black',   name:'Jungle Night',    primary:'#15803d', secondary:'#166534', accent:'#86efac', bg:'#010f05', card:'#021a0a', text:'#dcfce7', textLight:'#86efac', dark:true  },
  { id:'purple-white',  name:'Lavender Mist',   primary:'#7c3aed', secondary:'#6d28d9', accent:'#c4b5fd', bg:'#faf5ff', card:'#ffffff', text:'#1e293b', textLight:'#64748b', dark:false },
];

// ─── STORAGE & DEFAULTS ───────────────────────────────────────────────────────
const STORAGE_KEY = 'masaa_data';
const defaultData = {
  calendars: [
    { id:'personal', name:'Personal', color:'#10b981' },
    { id:'work',     name:'Work',     color:'#3b82f6' },
    { id:'school',   name:'School',   color:'#f59e0b' },
    { id:'church',   name:'Church',   color:'#8b5cf6' },
    { id:'family',   name:'Family',   color:'#ef4444' },
  ],
  events: [
    { id:'1', title:'Team Meeting',  date:new Date().toISOString().split('T')[0], startTime:'10:00', endTime:'11:00', calendarId:'work',     color:'#3b82f6', description:'Weekly sync', attendees:[{email:'john@co.com',status:'accepted'},{email:'sarah@co.com',status:'pending'}], reminders:['15'], recurring:'none', category:'work' },
    { id:'2', title:'Lunch Break',   date:new Date().toISOString().split('T')[0], startTime:'12:00', endTime:'13:00', calendarId:'personal', color:'#10b981', description:'',           attendees:[], reminders:[], recurring:'none', category:'personal' },
    { id:'3', title:'Client Call',   date:new Date(Date.now()+86400000).toISOString().split('T')[0], startTime:'14:00', endTime:'15:00', calendarId:'work', color:'#3b82f6', description:'Project discussion', attendees:[{email:'client@co.com',status:'maybe'}], reminders:['30'], recurring:'none', category:'work' },
  ],
  tasks: [
    { id:'1', title:'Finish project proposal', deadline:new Date().toISOString().split('T')[0],              priority:'high',   completed:false, category:'work',     subtasks:[{id:'1a',text:'Write intro',done:false},{id:'1b',text:'Add budget',done:false}] },
    { id:'2', title:'Review documents',         deadline:new Date(Date.now()+86400000).toISOString().split('T')[0],  priority:'medium', completed:false, category:'work',     subtasks:[] },
    { id:'3', title:'Call dentist',             deadline:new Date(Date.now()+172800000).toISOString().split('T')[0], priority:'low',    completed:false, category:'personal', subtasks:[] },
  ],
  contacts: [
    { id:'c1', name:'John Kamau',   email:'john@company.com', phone:'+254 700 111 222', category:'Colleague' },
    { id:'c2', name:'Sarah Wanjiku', email:'sarah@gmail.com',  phone:'+254 722 333 444', category:'Friend'    },
    { id:'c3', name:'Dr. Otieno',   email:'dr.otieno@clinic.com', phone:'+254 733 555 666', category:'Client' },
  ],
  bookingPage: {
    id:'booking-1', title:"My Booking Page", description:'Schedule a meeting with me',
    availability:{
      monday:{start:'09:00',end:'17:00',active:true}, tuesday:{start:'09:00',end:'17:00',active:true},
      wednesday:{start:'09:00',end:'17:00',active:true}, thursday:{start:'09:00',end:'17:00',active:true},
      friday:{start:'09:00',end:'17:00',active:true}, saturday:{start:'10:00',end:'14:00',active:false},
      sunday:{start:'10:00',end:'14:00',active:false},
    },
    meetingDuration:30, bufferTime:15, bookings:[],
  },
  notifications:[
    { id:'n1', type:'event',  title:'Team Meeting starts soon', message:'Your 10:00 AM meeting starts in 15 minutes.', time:'Just now',  read:false },
    { id:'n2', type:'task',   title:'Task deadline today',      message:'"Finish project proposal" is due today.',    time:'1 hr ago', read:false },
    { id:'n3', type:'invite', title:'New invitation',           message:'Sarah invited you to Book Club on Friday.',  time:'2 hr ago', read:true  },
  ],
  sharedCalendars:[],
};

function loadData() { try { const s=localStorage.getItem(STORAGE_KEY); return s?JSON.parse(s):defaultData; } catch { return defaultData; } }
function saveData(d) { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(d)); } catch {} }
function applyTheme(t) {
  const r=document.documentElement;
  r.style.setProperty('--color-primary',t.primary); r.style.setProperty('--color-secondary',t.secondary);
  r.style.setProperty('--color-accent',t.accent);   r.style.setProperty('--color-bg',t.bg);
  r.style.setProperty('--color-card',t.card);        r.style.setProperty('--color-text',t.text);
  r.style.setProperty('--color-text-light',t.textLight);
}

// ─── NATURAL LANGUAGE PARSER ──────────────────────────────────────────────────
function parseNaturalEvent(text) {
  const now = new Date();
  let date = now.toISOString().split('T')[0];
  let time = '09:00';
  let title = text;
  const lower = text.toLowerCase();
  if (lower.includes('tomorrow')) { const d=new Date(now); d.setDate(d.getDate()+1); date=d.toISOString().split('T')[0]; title=title.replace(/tomorrow/i,'').trim(); }
  else if (lower.includes('today'))    { date=now.toISOString().split('T')[0]; title=title.replace(/today/i,'').trim(); }
  else if (lower.includes('monday'))   { date=nextWeekday(1); title=title.replace(/monday/i,'').trim(); }
  else if (lower.includes('tuesday'))  { date=nextWeekday(2); title=title.replace(/tuesday/i,'').trim(); }
  else if (lower.includes('wednesday')){ date=nextWeekday(3); title=title.replace(/wednesday/i,'').trim(); }
  else if (lower.includes('thursday')) { date=nextWeekday(4); title=title.replace(/thursday/i,'').trim(); }
  else if (lower.includes('friday'))   { date=nextWeekday(5); title=title.replace(/friday/i,'').trim(); }
  else if (lower.includes('saturday')) { date=nextWeekday(6); title=title.replace(/saturday/i,'').trim(); }
  else if (lower.includes('sunday'))   { date=nextWeekday(0); title=title.replace(/sunday/i,'').trim(); }
  const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (timeMatch) {
    let h=parseInt(timeMatch[1]), m=parseInt(timeMatch[2]||'0');
    const ap=(timeMatch[3]||'').toLowerCase();
    if(ap==='pm'&&h<12) h+=12; if(ap==='am'&&h===12) h=0;
    time=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    title=title.replace(timeMatch[0],'').trim();
  }
  title = title.replace(/\bat\b/i,'').replace(/\s+/g,' ').trim();
  if (!title) title = 'New Event';
  const endH = Math.min(parseInt(time.split(':')[0])+1,23);
  return { title, date, startTime:time, endTime:`${String(endH).padStart(2,'0')}:${time.split(':')[1]}`, color:'#3b82f6', calendarId:'personal', recurring:'none', reminders:[], attendees:[], category:'personal', description:'' };
}
function nextWeekday(target) {
  const d=new Date(); const day=d.getDay(); let diff=target-day; if(diff<=0) diff+=7; d.setDate(d.getDate()+diff); return d.toISOString().split('T')[0];
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function MASAAApp() {
  const [session, setSession]   = useState(() => { try { return JSON.parse(localStorage.getItem('masaa_session')); } catch { return null; } });
  const [data, setData]         = useState(() => { const d=loadData(); return { ...defaultData, ...d }; });
  const [page, setPage]         = useState('dashboard');
  const [calView, setCalView]   = useState('month');
  const [sidebar, setSidebar]   = useState(true);
  const [showEvent, setShowEvent]     = useState(false);
  const [editEvent, setEditEvent]     = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNotif, setShowNotif]     = useState(false);
  const notifRef = useRef(null);

  const theme = THEMES.find(t => t.id === (session?.themeId || data?.user?.themeId || 'blue-white')) || THEMES[0];
  useEffect(() => { applyTheme(theme); }, [theme]);
  useEffect(() => { saveData(data); }, [data]);
  useEffect(() => {
    const h = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);

  if (!session) return <AuthScreen onLogin={s => { setSession(s); setData(d => ({ ...d, user: s })); }} />;

  const upd = (patch) => setData(d => ({ ...d, ...patch }));
  const unread = (data.notifications||[]).filter(n=>!n.read).length;

  const nav = [
    { id:'dashboard',  label:'Dashboard',  icon:Home      },
    { id:'calendar',   label:'Calendar',   icon:Calendar  },
    { id:'booking',    label:'Booking',    icon:BookOpen  },
    { id:'tasks',      label:'Tasks',      icon:ListTodo  },
    { id:'contacts',   label:'Contacts',   icon:Users     },
    { id:'sharing',    label:'Sharing',    icon:Share2    },
    { id:'analytics',  label:'Analytics',  icon:BarChart2 },
    { id:'reports',    label:'Reports',    icon:Brain     },
    { id:'settings',   label:'Settings',   icon:Settings  },
  ];

  const openAdd = (ev=null) => { setEditEvent(ev); setShowEvent(true); };

  return (
    <div style={{ background:'var(--color-bg)', color:'var(--color-text)', minHeight:'100vh' }} className="flex h-screen overflow-hidden">
      <Sidebar nav={nav} page={page} setPage={setPage} open={sidebar} setOpen={setSidebar} theme={theme}
        onLogout={() => { localStorage.removeItem('masaa_session'); setSession(null); }} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header style={{ background:'var(--color-card)', borderBottom:'1px solid rgba(128,128,128,0.2)' }} className="sticky top-0 z-30 px-4 md:px-6 py-3 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(!sidebar)} className="p-2 rounded-lg hover:bg-black/10 transition"><Menu size={22} style={{ color:'var(--color-text)' }}/></button>
            <img src="/logo.png" alt="MASAA" className="w-7 h-7 rounded-lg object-contain hidden sm:block" style={{ background:'var(--color-primary)', padding:'2px' }} />
            <span className="font-bold text-lg hidden sm:block" style={{ color:'var(--color-primary)' }}>MASAA</span>
          </div>
          {page==='calendar' && (
            <div className="flex gap-1 rounded-lg overflow-hidden border" style={{ borderColor:'var(--color-primary)' }}>
              {['month','week','day','year'].map(v => (
                <button key={v} onClick={() => setCalView(v)}
                  style={{ background:calView===v?'var(--color-primary)':'transparent', color:calView===v?'#fff':'var(--color-primary)' }}
                  className="px-3 py-1 text-xs font-semibold capitalize transition">{v}</button>
              ))}
            </div>
          )}
          {/* Natural language input */}
          <NLInput onCreate={ev => { upd({ events:[...data.events,{...ev,id:Date.now().toString()}] }); }} />
          <div className="flex items-center gap-3">
            {/* Bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotif(!showNotif)} className="p-2 hover:bg-black/10 rounded-lg relative transition">
                <Bell size={20} style={{ color:'var(--color-text-light)' }}/>
                {unread>0 && <span className="absolute top-1 right-1 w-4 h-4 text-white text-xs font-bold rounded-full flex items-center justify-center" style={{ background:'var(--color-primary)', fontSize:'9px' }}>{unread}</span>}
              </button>
              {showNotif && (
                <div className="absolute right-0 top-12 z-50">
                  <NotificationCenter
                    notifications={data.notifications||[]}
                    onDismiss={id => upd({ notifications:(data.notifications||[]).filter(n=>n.id!==id) })}
                    onClear={() => upd({ notifications:[] })} />
                </div>
              )}
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:opacity-80 transition"
              style={{ background:`linear-gradient(135deg,${theme.accent},${theme.primary})` }}
              onClick={() => setPage('settings')}
              title="Profile & Settings">
              {(session.name||'U').charAt(0)}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {page==='dashboard' && <Dashboard data={data} setPage={setPage} theme={theme} user={session} onAddEvent={() => openAdd(null)} />}
          {page==='calendar'  && <CalendarView events={data.events} calendars={data.calendars} calView={calView} currentDate={currentDate} setCurrentDate={setCurrentDate} theme={theme} onAddEvent={() => openAdd(null)} onEditEvent={ev => openAdd(ev)} onDeleteEvent={id => upd({ events:data.events.filter(e=>e.id!==id) })} />}
          {page==='booking'   && <BookingPage bookingPage={data.bookingPage} events={data.events} theme={theme} update={bp => upd({ bookingPage:bp })} />}
          {page==='tasks'     && <TasksView tasks={data.tasks} theme={theme}
            onAdd={t => upd({ tasks:[...data.tasks,{...t,id:Date.now().toString(),subtasks:[]}] })}
            onToggle={id => upd({ tasks:data.tasks.map(t=>t.id===id?{...t,completed:!t.completed}:t) })}
            onDelete={id => upd({ tasks:data.tasks.filter(t=>t.id!==id) })}
            onUpdateTask={t => upd({ tasks:data.tasks.map(x=>x.id===t.id?t:x) })} />}
          {page==='contacts'  && <ContactsPage contacts={data.contacts||[]} onAdd={c=>upd({contacts:[...(data.contacts||[]),c]})} onDelete={id=>upd({contacts:(data.contacts||[]).filter(c=>c.id!==id)})} />}
          {page==='sharing'   && <SharingPage events={data.events} calendars={data.calendars} sharedCalendars={data.sharedCalendars||[]} theme={theme} onShareCalendar={sc => upd({ sharedCalendars:[...(data.sharedCalendars||[]),sc] })} onRemoveShare={id => upd({ sharedCalendars:(data.sharedCalendars||[]).filter(s=>s.id!==id) })} onUpdateShare={(id,perm) => upd({ sharedCalendars:(data.sharedCalendars||[]).map(s=>s.id===id?{...s,permission:perm}:s) })} />}
          {page==='analytics' && <AnalyticsPage events={data.events} tasks={data.tasks} />}
          {page==='reports'   && <ReportsPage events={data.events} tasks={data.tasks} user={session} theme={theme} />}
          {page==='settings'  && <SettingsPage user={session} theme={theme} updateUser={u => { setSession(u); localStorage.setItem('masaa_session',JSON.stringify(u)); upd({ user:u }); }} />}
        </div>
      </main>
      {showEvent && <EventModal event={editEvent} calendars={data.calendars} theme={theme}
        onClose={() => { setShowEvent(false); setEditEvent(null); }}
        onSave={ev => {
          upd({ events: editEvent ? data.events.map(e=>e.id===ev.id?ev:e) : [...data.events,{...ev,id:Date.now().toString()}] });
          setShowEvent(false); setEditEvent(null);
        }} />}
    </div>
  );
}

// ─── NATURAL LANGUAGE INPUT ───────────────────────────────────────────────────
function NLInput({ onCreate }) {
  const [val, setVal] = useState('');
  const [hint, setHint] = useState('');
  const submit = () => {
    if (!val.trim()) return;
    const ev = parseNaturalEvent(val);
    setHint(`✓ Created "${ev.title}" on ${ev.date} at ${ev.startTime}`);
    onCreate(ev); setVal('');
    setTimeout(() => setHint(''), 3000);
  };
  return (
    <div className="hidden md:flex flex-col relative flex-1 max-w-sm">
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border text-sm" style={{ background:'var(--color-bg)', borderColor:'rgba(128,128,128,0.25)' }}>
        <Mic size={14} style={{ color:'var(--color-text-light)' }} />
        <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}
          placeholder='e.g. "Meeting tomorrow at 3pm"'
          className="flex-1 bg-transparent outline-none text-xs" style={{ color:'var(--color-text)' }} />
        <button onClick={submit}><Send size={14} style={{ color:'var(--color-primary)' }}/></button>
      </div>
      {hint && <span className="absolute top-9 left-0 text-xs px-2 py-1 rounded-lg shadow z-10" style={{ background:'var(--color-card)', color:'#10b981', whiteSpace:'nowrap' }}>{hint}</span>}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ nav, page, setPage, open, setOpen, theme, onLogout }) {
  const NavItems = ({ closeMobile }) => nav.map(item => {
    const Icon = item.icon; const active = page===item.id;
    return (
      <button key={item.id} onClick={() => { setPage(item.id); if (closeMobile) setOpen(false); }}
        style={active?{background:'rgba(255,255,255,0.2)',fontWeight:700}:{}}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-white/10 text-white text-left">
        <Icon size={20}/><span>{item.label}</span>
      </button>
    );
  });
  const Logo = () => (
    <div className="p-5 border-b border-white/20">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="MASAA" className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 flex-shrink-0" />
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">MASAA</h1>
          <p className="text-xs text-white/70 leading-tight">It's About Time!</p>
        </div>
      </div>
    </div>
  );
  const style = { background:theme.secondary };
  return (
    <>
      {/* Desktop — never closes on nav click */}
      <div style={style} className={`hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ${open?'w-64':'w-0 overflow-hidden'}`}>
        <Logo/>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto"><NavItems closeMobile={false}/></nav>
        <div className="p-4 border-t border-white/20">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white">
            <LogOut size={20}/><span>Sign Out</span>
          </button>
        </div>
      </div>
      {/* Mobile overlay */}
      {open && <div className="fixed md:hidden inset-0 bg-black/50 z-40" onClick={() => setOpen(false)}/>}
      <div style={style} className={`fixed md:hidden top-0 left-0 h-screen w-64 z-50 flex flex-col transition-transform duration-300 ${open?'translate-x-0':'-translate-x-full'}`}>
        <div className="p-5 border-b border-white/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="MASAA" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 flex-shrink-0" />
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">MASAA</h1>
              <p className="text-xs text-white/70 leading-tight">It's About Time!</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)}><X size={24} className="text-white"/></button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto"><NavItems closeMobile={true}/></nav>
        <div className="p-4 border-t border-white/20">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition text-white">
            <LogOut size={20}/><span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ data, setPage, theme, user, onAddEvent }) {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = (data.events||[]).filter(e=>e.date>=today).sort((a,b)=>new Date(`${a.date}T${a.startTime}`)-new Date(`${b.date}T${b.startTime}`)).slice(0,5);
  const incomplete = (data.tasks||[]).filter(t=>!t.completed).length;
  const todayCount = (data.events||[]).filter(e=>e.date===today).length;
  const stats = [
    { label:"Today's Events", value:todayCount, icon:<Calendar size={22}/> },
    { label:'Upcoming', value:upcoming.length, icon:<Clock size={22}/> },
    { label:'Tasks Done', value:(data.tasks||[]).filter(t=>t.completed).length, icon:<CheckCircle2 size={22}/> },
    { label:'Pending Tasks', value:incomplete, icon:<ListTodo size={22}/> },
  ];
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="rounded-2xl p-8 shadow-lg text-white" style={{ background:`linear-gradient(135deg,${theme.primary},${theme.secondary})` }}>
        <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name}!</h1>
        <p className="opacity-80">You have {todayCount} events today and {incomplete} pending tasks.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s,i)=>(
          <div key={i} className="rounded-2xl p-5 shadow" style={{ background:'var(--color-card)' }}>
            <div style={{ color:'var(--color-primary)' }} className="mb-2">{s.icon}</div>
            <p className="text-sm" style={{ color:'var(--color-text-light)' }}>{s.label}</p>
            <p className="text-3xl font-bold" style={{ color:'var(--color-primary)' }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color:'var(--color-text)' }}>Upcoming Events</h2>
          <div className="space-y-3">
            {upcoming.length>0?upcoming.map(ev=>(
              <div key={ev.id} className="flex items-center gap-3 pb-3 border-b last:border-0" style={{ borderColor:'rgba(128,128,128,0.12)' }}>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background:ev.color||'var(--color-primary)' }}/>
                <div className="flex-1"><p className="font-semibold text-sm" style={{ color:'var(--color-text)' }}>{ev.title}</p><p className="text-xs" style={{ color:'var(--color-text-light)' }}>{ev.date} · {ev.startTime}</p></div>
              </div>
            )):<p className="text-sm" style={{ color:'var(--color-text-light)' }}>No upcoming events</p>}
          </div>
          <button onClick={()=>setPage('calendar')} className="mt-4 w-full py-2 rounded-xl text-sm font-semibold hover:opacity-80 transition" style={{ background:`${theme.primary}20`, color:'var(--color-primary)' }}>View Calendar →</button>
        </div>
        <div className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color:'var(--color-text)' }}>Pending Tasks</h2>
          <div className="space-y-3">
            {(data.tasks||[]).filter(t=>!t.completed).slice(0,5).map(task=>(
              <div key={task.id} className="flex items-center gap-3 pb-3 border-b last:border-0" style={{ borderColor:'rgba(128,128,128,0.12)' }}>
                <div className={`w-2 h-8 rounded-full flex-shrink-0 ${task.priority==='high'?'bg-red-500':task.priority==='medium'?'bg-yellow-500':'bg-green-500'}`}/>
                <div className="flex-1"><p className="font-semibold text-sm" style={{ color:'var(--color-text)' }}>{task.title}</p><p className="text-xs" style={{ color:'var(--color-text-light)' }}>{task.deadline}</p></div>
              </div>
            ))}
          </div>
          <button onClick={()=>setPage('tasks')} className="mt-4 w-full py-2 rounded-xl text-sm font-semibold hover:opacity-80 transition" style={{ background:`${theme.primary}20`, color:'var(--color-primary)' }}>View All Tasks →</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{label:'New Event',icon:<Plus size={18}/>,action:onAddEvent},{label:'Booking Page',icon:<Share2 size={18}/>,action:()=>setPage('booking')},{label:'Share Calendar',icon:<Users size={18}/>,action:()=>setPage('sharing')}].map((b,i)=>(
          <button key={i} onClick={b.action} style={i===0?{background:'var(--color-primary)',color:'#fff'}:{background:'var(--color-card)',color:'var(--color-primary)',border:`2px solid var(--color-primary)`}}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition hover:opacity-80">{b.icon}{b.label}</button>
        ))}
      </div>

      {/* Sharing quick panel */}
      <SharingQuickCard setPage={setPage} sharedCalendars={data.sharedCalendars||[]} calendars={data.calendars} theme={theme} />
    </div>
  );
}

// ─── CALENDAR VIEWS ───────────────────────────────────────────────────────────
const MONTH_NAMES=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function navigate(d,view,dir){ const n=new Date(d); if(view==='month')n.setMonth(n.getMonth()+dir); else if(view==='week')n.setDate(n.getDate()+dir*7); else if(view==='day')n.setDate(n.getDate()+dir); else if(view==='year')n.setFullYear(n.getFullYear()+dir); return n; }

function CalendarView({ events, calendars, calView, currentDate, setCurrentDate, theme, onAddEvent, onEditEvent, onDeleteEvent }) {
  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color:'var(--color-text)' }}>
          {calView==='month'&&`${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          {calView==='week'&&`Week of ${new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()-currentDate.getDay()).toLocaleDateString()}`}
          {calView==='day'&&currentDate.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
          {calView==='year'&&`${currentDate.getFullYear()}`}
        </h2>
        <div className="flex gap-2">
          <button onClick={()=>setCurrentDate(d=>navigate(d,calView,-1))} className="p-2 rounded-lg hover:bg-black/10 transition"><ChevronLeft size={22} style={{ color:'var(--color-text)' }}/></button>
          <button onClick={()=>setCurrentDate(new Date())} className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold hover:opacity-80 transition" style={{ background:'var(--color-primary)' }}>Today</button>
          <button onClick={()=>setCurrentDate(d=>navigate(d,calView,1))} className="p-2 rounded-lg hover:bg-black/10 transition"><ChevronRight size={22} style={{ color:'var(--color-text)' }}/></button>
        </div>
      </div>
      {calView==='month'&&<MonthGrid events={events} currentDate={currentDate} theme={theme} onEdit={onEditEvent}/>}
      {calView==='week' &&<WeekGrid  events={events} currentDate={currentDate} theme={theme} onEdit={onEditEvent}/>}
      {calView==='day'  &&<DayGrid   events={events} currentDate={currentDate} theme={theme} onEdit={onEditEvent}/>}
      {calView==='year' &&<YearGrid  events={events} currentDate={currentDate} theme={theme} setCurrentDate={setCurrentDate}/>}
      <button onClick={onAddEvent} className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-80 transition" style={{ background:'var(--color-primary)' }}>
        <Plus size={20}/> Add Event
      </button>
    </div>
  );
}

function MonthGrid({ events, currentDate, theme, onEdit }) {
  const y=currentDate.getFullYear(), m=currentDate.getMonth();
  const first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate();
  const today=new Date().toISOString().split('T')[0];
  const cells=[...Array(first).fill(null),...Array.from({length:days},(_,i)=>i+1)];
  const evOn=(day)=>{ const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`; return events.filter(e=>e.date===ds); };
  return (
    <div className="rounded-2xl shadow overflow-hidden" style={{ background:'var(--color-card)' }}>
      <div className="grid grid-cols-7">
        {DAY_NAMES.map(d=><div key={d} className="p-3 text-center text-xs font-bold uppercase" style={{ background:`${theme.primary}15`, color:'var(--color-primary)' }}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day,i)=>{
          const ds=day?`${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`:null;
          const isToday=ds===today; const evs=day?evOn(day):[];
          return <div key={i} className="min-h-24 p-1.5 border-r border-b last:border-r-0 transition" style={{ borderColor:'rgba(128,128,128,0.12)', background:isToday?`${theme.primary}12`:'transparent' }}>
            {day&&<>
              <div className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold mb-1" style={{ background:isToday?'var(--color-primary)':'transparent', color:isToday?'#fff':'var(--color-text)' }}>{day}</div>
              <div className="space-y-0.5">
                {evs.slice(0,2).map(ev=><div key={ev.id} onClick={()=>onEdit(ev)} title={ev.title} className="text-xs px-1 py-0.5 rounded cursor-pointer truncate text-white hover:opacity-80 transition" style={{ background:ev.color||'var(--color-primary)' }}>{ev.title}</div>)}
                {evs.length>2&&<div className="text-xs" style={{ color:'var(--color-text-light)' }}>+{evs.length-2} more</div>}
              </div>
            </>}
          </div>;
        })}
      </div>
    </div>
  );
}

function WeekGrid({ events, currentDate, theme, onEdit }) {
  const sw=new Date(currentDate); sw.setDate(currentDate.getDate()-currentDate.getDay());
  const days=Array.from({length:7},(_,i)=>{ const d=new Date(sw); d.setDate(d.getDate()+i); return d; });
  const today=new Date().toISOString().split('T')[0];
  return (
    <div className="rounded-2xl shadow overflow-auto" style={{ background:'var(--color-card)', maxHeight:'65vh' }}>
      <div className="grid sticky top-0 z-10" style={{ gridTemplateColumns:'56px repeat(7,1fr)', background:'var(--color-card)' }}>
        <div className="p-2 border-r border-b" style={{ borderColor:'rgba(128,128,128,0.12)' }}/>
        {days.map((d,i)=>{ const ds=d.toISOString().split('T')[0]; return <div key={i} className="p-2 text-center text-xs font-bold border-r border-b last:border-r-0" style={{ borderColor:'rgba(128,128,128,0.12)', color:ds===today?'var(--color-primary)':'var(--color-text)' }}>{DAY_NAMES[d.getDay()]} {d.getDate()}</div>; })}
      </div>
      {Array.from({length:24},(_,h)=>(
        <div key={h} className="grid" style={{ gridTemplateColumns:'56px repeat(7,1fr)' }}>
          <div className="p-1 text-xs text-right pr-2 border-r border-b" style={{ borderColor:'rgba(128,128,128,0.12)', color:'var(--color-text-light)' }}>{String(h).padStart(2,'0')}:00</div>
          {days.map((d,i)=>{ const ds=d.toISOString().split('T')[0]; const evs=events.filter(e=>e.date===ds&&parseInt(e.startTime)===h);
            return <div key={i} className="border-r border-b last:border-r-0 min-h-12 p-0.5" style={{ borderColor:'rgba(128,128,128,0.12)' }}>
              {evs.map(ev=><div key={ev.id} onClick={()=>onEdit(ev)} className="text-xs px-1 py-0.5 rounded cursor-pointer truncate text-white hover:opacity-80 transition mb-0.5" style={{ background:ev.color||'var(--color-primary)' }}>{ev.title}</div>)}
            </div>; })}
        </div>
      ))}
    </div>
  );
}

function DayGrid({ events, currentDate, theme, onEdit }) {
  const ds=currentDate.toISOString().split('T')[0];
  const dayEvs=events.filter(e=>e.date===ds).sort((a,b)=>a.startTime.localeCompare(b.startTime));
  return (
    <div className="rounded-2xl shadow overflow-auto" style={{ background:'var(--color-card)', maxHeight:'65vh' }}>
      {Array.from({length:24},(_,h)=>{
        const evs=dayEvs.filter(e=>parseInt(e.startTime)===h);
        return <div key={h} className="flex border-b min-h-14" style={{ borderColor:'rgba(128,128,128,0.12)' }}>
          <div className="w-16 flex-shrink-0 p-2 text-xs text-right pr-3 border-r" style={{ borderColor:'rgba(128,128,128,0.12)', color:'var(--color-text-light)' }}>{String(h).padStart(2,'0')}:00</div>
          <div className="flex-1 p-1 space-y-1">
            {evs.map(ev=><div key={ev.id} onClick={()=>onEdit(ev)} className="px-3 py-2 rounded-xl text-sm text-white cursor-pointer hover:opacity-80 transition flex flex-wrap items-center gap-2" style={{ background:ev.color||'var(--color-primary)' }}>
              <span className="font-semibold">{ev.title}</span>
              <span className="opacity-80 text-xs">{ev.startTime}–{ev.endTime}</span>
              {ev.meetingType==='online'&&ev.onlineLink&&<a href={ev.onlineLink} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} className="text-xs bg-white/25 px-2 py-0.5 rounded-full hover:bg-white/40">🔗 Join</a>}
              {ev.meetingType==='physical'&&ev.location&&<span className="text-xs opacity-80">📍 {ev.location}</span>}
            </div>)}
          </div>
        </div>;
      })}
    </div>
  );
}

function YearGrid({ events, currentDate, theme, setCurrentDate }) {
  const year=currentDate.getFullYear();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({length:12},(_,m)=>{
        const first=new Date(year,m,1).getDay(), days=new Date(year,m+1,0).getDate();
        const cells=[...Array(first).fill(null),...Array.from({length:days},(_,i)=>i+1)];
        const today=new Date().toISOString().split('T')[0];
        const countOn=(d)=>{ const ds=`${year}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; return events.filter(e=>e.date===ds).length; };
        return (
          <div key={m} className="rounded-2xl shadow p-4" style={{ background:'var(--color-card)' }}>
            <button onClick={()=>{ const d=new Date(currentDate); d.setMonth(m); setCurrentDate(d); }} className="font-bold text-sm mb-2 hover:underline" style={{ color:'var(--color-primary)' }}>{MONTH_NAMES[m]}</button>
            <div className="grid grid-cols-7 gap-0">
              {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} className="text-center text-xs opacity-40" style={{ color:'var(--color-text)' }}>{d}</div>)}
              {cells.map((day,i)=>{
                const ds=day?`${year}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`:null;
                const isToday=ds===today, cnt=day?countOn(day):0;
                return <div key={i} className="w-full aspect-square flex items-center justify-center text-xs rounded-full" style={{ background:isToday?'var(--color-primary)':cnt>0?`${theme.primary}30`:'transparent', color:isToday?'#fff':'var(--color-text)', fontWeight:cnt>0||isToday?700:400 }}>
                  {day||''}
                </div>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── EVENT MODAL ─────────────────────────────────────────────────────────────
const EVENT_COLORS=['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316','#14b8a6','#6366f1'];
const REMINDER_OPTS=['5','10','15','30','60','1440'];
const REMINDER_LABELS={'5':'5 min','10':'10 min','15':'15 min','30':'30 min','60':'1 hour','1440':'1 day'};
const RECURRING_OPTS=['none','daily','weekly','biweekly','monthly','yearly'];
const INVITE_STATUS={ pending:'🕐 Pending', accepted:'✅ Accepted', declined:'❌ Declined', maybe:'🤔 Maybe' };

function EventModal({ event, calendars, theme, onClose, onSave }) {
  const [title,setTitle]=useState(event?.title||'');
  const [date,setDate]=useState(event?.date||new Date().toISOString().split('T')[0]);
  const [startTime,setStartTime]=useState(event?.startTime||'09:00');
  const [endTime,setEndTime]=useState(event?.endTime||'10:00');
  const [calId,setCalId]=useState(event?.calendarId||(calendars[0]?.id||'personal'));
  const [color,setColor]=useState(event?.color||'#3b82f6');
  const [desc,setDesc]=useState(event?.description||'');
  const [attendeeInput,setAttendeeInput]=useState('');
  const [attendees,setAttendees]=useState(event?.attendees||[]);
  const [reminders,setReminders]=useState(event?.reminders||[]);
  const [recurring,setRecurring]=useState(event?.recurring||'none');
  const [meetingType,setMeetingType]=useState(event?.meetingType||'physical');
  const [location,setLocation]=useState(event?.location||'');
  const [onlineLink,setOnlineLink]=useState(event?.onlineLink||'');
  const [detectingLoc,setDetectingLoc]=useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) { setLocation('Geolocation not supported'); return; }
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
          const country = data.address?.country || '';
          setLocation([city, country].filter(Boolean).join(', ') || `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        } catch {
          setLocation(`Location detected`);
        }
        setDetectingLoc(false);
      },
      () => { setLocation(''); setDetectingLoc(false); }
    );
  };

  const addAttendee=()=>{ if(!attendeeInput.trim()) return; setAttendees(a=>[...a,{email:attendeeInput.trim(),status:'pending'}]); setAttendeeInput(''); };
  const removeAttendee=(email)=>setAttendees(a=>a.filter(x=>x.email!==email));
  const toggleStatus=(email,status)=>setAttendees(a=>a.map(x=>x.email===email?{...x,status}:x));
  const toggleReminder=(v)=>setReminders(r=>r.includes(v)?r.filter(x=>x!==v):[...r,v]);

  const inp="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2";
  const is={ background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.25)' };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]" style={{ background:'var(--color-card)' }}>
        <div className="p-5 border-b flex justify-between items-center" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
          <h2 className="text-xl font-bold" style={{ color:'var(--color-text)' }}>{event?'Edit Event':'New Event'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-lg"><X size={20} style={{ color:'var(--color-text)' }}/></button>
        </div>
        <div className="p-5 space-y-4">
          <input className={inp} style={is} placeholder="Event title *" value={title} onChange={e=>setTitle(e.target.value)}/>
          <div className="grid grid-cols-3 gap-3">
            <input type="date" className={inp} style={is} value={date} onChange={e=>setDate(e.target.value)}/>
            <input type="time" className={inp} style={is} value={startTime} onChange={e=>setStartTime(e.target.value)}/>
            <input type="time" className={inp} style={is} value={endTime} onChange={e=>setEndTime(e.target.value)}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Calendar</label>
              <select className={inp} style={is} value={calId} onChange={e=>setCalId(e.target.value)}>
                {calendars.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Recurring</label>
              <select className={inp} style={is} value={recurring} onChange={e=>setRecurring(e.target.value)}>
                {RECURRING_OPTS.map(r=><option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}</select></div>
          </div>
          {/* Color */}
          <div><label className="text-xs font-semibold mb-2 block" style={{ color:'var(--color-text-light)' }}>Color</label>
            <div className="flex gap-2 flex-wrap">
              {EVENT_COLORS.map(c=><button key={c} onClick={()=>setColor(c)} className="w-7 h-7 rounded-full transition hover:scale-110" style={{ background:c, outline:color===c?`3px solid var(--color-text)`:'none', outlineOffset:2 }}/>)}
            </div></div>
          {/* Reminders */}
          <div><label className="text-xs font-semibold mb-2 block" style={{ color:'var(--color-text-light)' }}>Reminders</label>
            <div className="flex gap-2 flex-wrap">
              {REMINDER_OPTS.map(r=><button key={r} onClick={()=>toggleReminder(r)} className="px-3 py-1 rounded-full text-xs font-semibold transition"
                style={{ background:reminders.includes(r)?'var(--color-primary)':`${theme.primary}20`, color:reminders.includes(r)?'#fff':'var(--color-primary)' }}>{REMINDER_LABELS[r]}</button>)}
            </div></div>
          {/* Attendees */}
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color:'var(--color-text-light)' }}>Attendees</label>
            <div className="flex gap-2 mb-2">
              <input className={`flex-1 ${inp}`} style={is} placeholder="email@example.com" value={attendeeInput} onChange={e=>setAttendeeInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addAttendee()}/>
              <button onClick={addAttendee} className="px-3 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-80 transition" style={{ background:'var(--color-primary)' }}>Add</button>
            </div>
            {attendees.length>0&&(
              <div className="space-y-2">
                {attendees.map(a=>(
                  <div key={a.email} className="flex items-center gap-2 p-2 rounded-xl" style={{ background:'var(--color-bg)' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background:'var(--color-primary)' }}>{a.email[0].toUpperCase()}</div>
                    <span className="flex-1 text-xs truncate" style={{ color:'var(--color-text)' }}>{a.email}</span>
                    <select value={a.status} onChange={e=>toggleStatus(a.email,e.target.value)} className="text-xs border rounded-lg px-1 py-0.5 focus:outline-none" style={{ background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.25)' }}>
                      <option value="pending">Pending</option><option value="accepted">Accepted</option><option value="declined">Declined</option><option value="maybe">Maybe</option>
                    </select>
                    <button onClick={()=>removeAttendee(a.email)} className="p-1 text-red-500 hover:bg-red-50 rounded"><X size={12}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Meeting type */}
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color:'var(--color-text-light)' }}>Meeting Type</label>
            <div className="flex gap-2 mb-3">
              {[{v:'physical',label:'📍 Physical',icon:'📍'},{v:'online',label:'💻 Online',icon:'💻'}].map(opt=>(
                <button key={opt.v} onClick={()=>setMeetingType(opt.v)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition border-2"
                  style={{ borderColor: meetingType===opt.v ? 'var(--color-primary)' : 'rgba(128,128,128,0.2)',
                           background:  meetingType===opt.v ? 'var(--color-primary)' : 'var(--color-bg)',
                           color:       meetingType===opt.v ? '#fff' : 'var(--color-text)' }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {meetingType==='physical' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input className={`flex-1 ${inp}`} style={is} placeholder="📍 Location / Place name" value={location} onChange={e=>setLocation(e.target.value)}/>
                  <button onClick={detectLocation} disabled={detectingLoc} title="Detect my location"
                    className="px-3 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-80 transition flex-shrink-0"
                    style={{ background:'var(--color-primary)', opacity: detectingLoc ? 0.6 : 1 }}>
                    {detectingLoc ? '⏳' : '📍'}
                  </button>
                </div>
                {detectingLoc && <p className="text-xs" style={{ color:'var(--color-text-light)' }}>Detecting your location…</p>}
                {location && (
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                    style={{ color:'var(--color-primary)' }}>
                    🗺 Open in Google Maps
                  </a>
                )}
              </div>
            )}
            {meetingType==='online' && (
              <div className="space-y-2">
                <input className={inp} style={is} placeholder="💻 Meeting link (Zoom, Google Meet, Teams…)" value={onlineLink} onChange={e=>setOnlineLink(e.target.value)}/>
                {onlineLink && (
                  <a href={onlineLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                    style={{ color:'var(--color-primary)' }}>
                    🔗 Open meeting link
                  </a>
                )}
              </div>
            )}
          </div>
          <textarea className={`${inp} resize-none`} style={is} rows={3} placeholder="Description…" value={desc} onChange={e=>setDesc(e.target.value)}/>
        </div>
        <div className="p-5 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-semibold text-sm hover:opacity-80 transition" style={{ background:'rgba(128,128,128,0.15)', color:'var(--color-text)' }}>Cancel</button>
          <button onClick={()=>{ if(!title.trim()) return; onSave({...event,title,date,startTime,endTime,calendarId:calId,color,description:desc,attendees,reminders,recurring,meetingType,location,onlineLink}); }} className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white hover:opacity-80 transition" style={{ background:'var(--color-primary)' }}>Save Event</button>
        </div>
      </div>
    </div>
  );
}

// ─── TASKS VIEW (with subtasks) ───────────────────────────────────────────────
function TasksView({ tasks, theme, onAdd, onToggle, onDelete, onUpdateTask }) {
  const [title,setTitle]=useState(''); const [deadline,setDeadline]=useState(new Date().toISOString().split('T')[0]); const [priority,setPriority]=useState('medium');
  const [expandedTask, setExpandedTask]=useState(null);
  const add=()=>{ if(!title.trim()) return; onAdd({title,deadline,priority,completed:false,category:'personal',subtasks:[]}); setTitle(''); setPriority('medium'); };

  const addSubtask=(task,text)=>{ if(!text.trim()) return; onUpdateTask({...task,subtasks:[...(task.subtasks||[]),{id:Date.now().toString(),text,done:false}]}); };
  const toggleSub=(task,sid)=>onUpdateTask({...task,subtasks:(task.subtasks||[]).map(s=>s.id===sid?{...s,done:!s.done}:s)});
  const deleteSub=(task,sid)=>onUpdateTask({...task,subtasks:(task.subtasks||[]).filter(s=>s.id!==sid)});

  const inp="px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2";
  const is={ background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.25)' };
  const sections=[
    {label:'High Priority',   color:'#ef4444', items:tasks.filter(t=>t.priority==='high'   &&!t.completed)},
    {label:'Medium Priority', color:'#f59e0b', items:tasks.filter(t=>t.priority==='medium' &&!t.completed)},
    {label:'Low Priority',    color:'#10b981', items:tasks.filter(t=>t.priority==='low'    &&!t.completed)},
    {label:'Completed',       color:'#94a3b8', items:tasks.filter(t=>t.completed)},
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color:'var(--color-text)' }}>Add New Task</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input className={`flex-1 ${inp}`} style={is} placeholder="What needs to be done?" value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}/>
          <input type="date" className={inp} style={is} value={deadline} onChange={e=>setDeadline(e.target.value)}/>
          <select className={inp} style={is} value={priority} onChange={e=>setPriority(e.target.value)}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
          <button onClick={add} className="px-4 py-2 rounded-xl text-white font-semibold text-sm hover:opacity-80 transition" style={{ background:'var(--color-primary)' }}><Plus size={18}/></button>
        </div>
      </div>
      {sections.map(sec=>sec.items.length>0&&(
        <div key={sec.label} className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)', borderLeft:`4px solid ${sec.color}` }}>
          <h3 className="font-bold mb-3" style={{ color:'var(--color-text)' }}>{sec.label} <span className="text-xs font-normal opacity-60">({sec.items.length})</span></h3>
          <div className="space-y-2">
            {sec.items.map(task=>{
              const expanded=expandedTask===task.id;
              const subs=task.subtasks||[];
              const doneSubs=subs.filter(s=>s.done).length;
              return (
                <div key={task.id}>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition" style={{ background:'var(--color-bg)' }}>
                    <input type="checkbox" checked={task.completed} onChange={()=>onToggle(task.id)} className="w-4 h-4 cursor-pointer"/>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:sec.color }}/>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.completed?'line-through opacity-50':''}`} style={{ color:'var(--color-text)' }}>{task.title}</p>
                      <p className="text-xs" style={{ color:'var(--color-text-light)' }}>{task.deadline}{subs.length>0&&` · ${doneSubs}/${subs.length} subtasks`}</p>
                    </div>
                    <button onClick={()=>setExpandedTask(expanded?null:task.id)} className="text-xs px-2 py-1 rounded-lg hover:bg-black/10 transition" style={{ color:'var(--color-text-light)' }}>{expanded?'▲':'▼'}</button>
                    <button onClick={()=>onDelete(task.id)} className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition"><Trash2 size={14}/></button>
                  </div>
                  {expanded&&(
                    <div className="ml-8 mt-1 space-y-1 pb-2">
                      {subs.map(s=>(
                        <div key={s.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background:`${sec.color}10` }}>
                          <input type="checkbox" checked={s.done} onChange={()=>toggleSub(task,s.id)} className="w-3 h-3 cursor-pointer"/>
                          <span className={`text-xs flex-1 ${s.done?'line-through opacity-50':''}`} style={{ color:'var(--color-text)' }}>{s.text}</span>
                          <button onClick={()=>deleteSub(task,s.id)} className="text-red-400 hover:text-red-600"><X size={11}/></button>
                        </div>
                      ))}
                      <SubtaskInput onAdd={text=>addSubtask(task,text)} color={sec.color}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {tasks.length===0&&<div className="text-center py-16 rounded-2xl" style={{ background:'var(--color-card)' }}><CheckCircle2 size={48} className="mx-auto mb-3 opacity-20" style={{ color:'var(--color-text)' }}/><p style={{ color:'var(--color-text-light)' }}>No tasks yet.</p></div>}
    </div>
  );
}
function SubtaskInput({ onAdd, color }) {
  const [val,setVal]=useState('');
  return (
    <div className="flex gap-2 mt-1">
      <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){onAdd(val);setVal('');} }}
        placeholder="Add subtask…" className="flex-1 text-xs px-2 py-1.5 rounded-lg border focus:outline-none" style={{ background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.2)' }}/>
      <button onClick={()=>{ onAdd(val); setVal(''); }} className="text-xs px-2 py-1 rounded-lg text-white hover:opacity-80 transition" style={{ background:color }}><Plus size={12}/></button>
    </div>
  );
}

// ─── BOOKING PAGE ─────────────────────────────────────────────────────────────
function BookingPage({ bookingPage, events, theme, update }) {
  const [copied,setCopied]=useState(false);
  const link=`${window.location.origin}?booking=${bookingPage.id}`;
  const copy=()=>{ navigator.clipboard.writeText(link); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const dayNames=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const slots=[];
  for(let i=0;i<7;i++){
    const d=new Date(Date.now()+i*86400000);
    const day=dayNames[d.getDay()], cfg=bookingPage.availability[day];
    const ds=d.toISOString().split('T')[0];
    if(cfg.active){
      const [sh]=cfg.start.split(':').map(Number), [eh]=cfg.end.split(':').map(Number);
      for(let h=sh;h<eh;h++) for(let m=0;m<60;m+=bookingPage.meetingDuration){
        const t=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
        const busy=events.some(e=>e.date===ds&&e.startTime<=t&&e.endTime>t);
        if(!busy) slots.push({date:ds,time:t});
      }
    }
  }
  const inp="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2";
  const is={ background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.25)' };

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Settings */}
      <div className="rounded-2xl shadow p-5" style={{ background:'var(--color-card)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color:'var(--color-text)' }}>Booking Page Settings</h2>
        <div className="space-y-3">
          <input className={inp} style={is} placeholder="Page Title" value={bookingPage.title} onChange={e=>update({...bookingPage,title:e.target.value})}/>
          <textarea className={`${inp} resize-none`} style={is} rows={2} placeholder="Description" value={bookingPage.description} onChange={e=>update({...bookingPage,description:e.target.value})}/>
          {/* Duration + buffer — stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Duration (min)</label>
              <input type="number" className={inp} style={is} value={bookingPage.meetingDuration} onChange={e=>update({...bookingPage,meetingDuration:+e.target.value})}/>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Buffer time (min)</label>
              <input type="number" className={inp} style={is} value={bookingPage.bufferTime} onChange={e=>update({...bookingPage,bufferTime:+e.target.value})}/>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly availability — responsive row layout */}
      <div className="rounded-2xl shadow p-5" style={{ background:'var(--color-card)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color:'var(--color-text)' }}>Weekly Availability</h2>
        <div className="space-y-2">
          {Object.entries(bookingPage.availability).map(([day,cfg])=>(
            <div key={day} className="rounded-xl p-3" style={{ background:'var(--color-bg)' }}>
              {/* Top row: day name + toggle */}
              <div className="flex items-center gap-3">
                <span className="w-24 capitalize text-sm font-semibold flex-shrink-0" style={{ color:'var(--color-text)' }}>{day}</span>
                <input type="checkbox" checked={cfg.active} onChange={e=>{const u={...bookingPage};u.availability[day].active=e.target.checked;update(u);}} className="w-4 h-4 cursor-pointer flex-shrink-0"/>
                <span className="text-xs" style={{ color:'var(--color-text-light)' }}>{cfg.active ? 'Available' : 'Unavailable'}</span>
              </div>
              {/* Time pickers on their own row when active */}
              {cfg.active && (
                <div className="flex flex-wrap items-center gap-2 mt-2 ml-0 sm:ml-28">
                  <input type="time" value={cfg.start} onChange={e=>{const u={...bookingPage};u.availability[day].start=e.target.value;update(u);}}
                    className="px-2 py-1.5 rounded-lg border text-sm focus:outline-none flex-1 min-w-0" style={is}/>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color:'var(--color-text-light)' }}>to</span>
                  <input type="time" value={cfg.end} onChange={e=>{const u={...bookingPage};u.availability[day].end=e.target.value;update(u);}}
                    className="px-2 py-1.5 rounded-lg border text-sm focus:outline-none flex-1 min-w-0" style={is}/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking link */}
      <div className="rounded-2xl p-5 text-white" style={{ background:`linear-gradient(135deg,${theme.primary},${theme.secondary})` }}>
        <h2 className="text-lg font-bold mb-3">Your Booking Link</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input readOnly value={link} className="flex-1 px-3 py-2 rounded-xl text-sm bg-white/20 text-white border border-white/30 focus:outline-none min-w-0"/>
          <button onClick={copy} className="px-5 py-2 bg-white font-semibold rounded-xl text-sm hover:opacity-80 transition flex-shrink-0" style={{ color:'var(--color-primary)' }}>
            {copied?'Copied!':'Copy'}
          </button>
        </div>
      </div>

      {/* Available slots — 2 cols on mobile, 4 on desktop */}
      <div className="rounded-2xl shadow p-5" style={{ background:'var(--color-card)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color:'var(--color-text)' }}>Available Slots (Next 7 Days)</h2>
        {slots.length === 0 ? (
          <p className="text-sm text-center py-4" style={{ color:'var(--color-text-light)' }}>No available slots. Check your availability settings above.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {slots.slice(0,16).map((s,i)=>(
              <div key={i} className="p-3 rounded-xl text-center border" style={{ borderColor:'rgba(128,128,128,0.15)', background:'var(--color-bg)' }}>
                <p className="font-semibold text-sm" style={{ color:'var(--color-text)' }}>{s.time}</p>
                <p className="text-xs mt-0.5" style={{ color:'var(--color-text-light)' }}>{new Date(s.date+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BOOK SLOT PREVIEW ───────────────────────────────────────────────────────
function BookSlotPreview({ events, calendarId, theme }) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const today = new Date();
  const HOURS = [8,9,10,11,12,13,14,15,16,17];
  const days  = Array.from({length:5}, (_,i) => {
    const d = new Date(today); d.setDate(today.getDate() - today.getDay() + 1 + i); return d;
  });
  const isBusy = (date, hour) => {
    const ds = date.toISOString().split('T')[0];
    return events.some(e => {
      if (e.date !== ds) return false;
      const [sh] = e.startTime.split(':').map(Number);
      const [eh] = e.endTime.split(':').map(Number);
      return hour >= sh && hour < eh;
    });
  };
  const key = (d, h) => `${d.toISOString().split('T')[0]}-${h}`;
  return (
    <div className="rounded-xl border-2 overflow-hidden" style={{ borderColor:'var(--color-primary)' }}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{ background:`var(--color-primary)18` }}>
        <div className="w-2 h-2 rounded-full" style={{ background:'var(--color-primary)' }}/>
        <p className="text-xs font-bold" style={{ color:'var(--color-primary)' }}>
          Preview — what the recipient sees with "Book free slots"
        </p>
      </div>
      <div className="p-4" style={{ background:'var(--color-bg)' }}>
        <div className="flex gap-4 mb-3 text-xs flex-wrap" style={{ color:'var(--color-text-light)' }}>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 border border-green-300 inline-block"/>Free</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ background:'rgba(128,128,128,0.2)' }}/>Busy (blocked)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ background:'var(--color-primary)' }}/>Your booking</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="w-10 pb-2" style={{ color:'var(--color-text-light)' }}/>
                {days.map((d,i)=>(
                  <th key={i} className="pb-2 text-center font-semibold" style={{ color:'var(--color-text)' }}>
                    <div>{['Mon','Tue','Wed','Thu','Fri'][i]}</div>
                    <div className="font-normal opacity-60">{d.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map(h=>(
                <tr key={h}>
                  <td className="pr-2 text-right pb-1" style={{ color:'var(--color-text-light)' }}>{String(h).padStart(2,'0')}:00</td>
                  {days.map((d,i)=>{
                    const busy=isBusy(d,h), k=key(d,h), booked=bookedSlots.includes(k);
                    return (
                      <td key={i} className="pb-1 px-0.5">
                        <button disabled={busy} onClick={()=>setBookedSlots(b=>booked?b.filter(s=>s!==k):[...b,k])}
                          title={busy?'Busy — unavailable':`Book ${String(h).padStart(2,'0')}:00`}
                          className="w-full h-7 rounded-lg font-semibold transition"
                          style={{
                            background: busy?'rgba(128,128,128,0.12)':booked?'var(--color-primary)':'#dcfce7',
                            color:      busy?'rgba(128,128,128,0.35)':booked?'#fff':'#15803d',
                            cursor:     busy?'not-allowed':'pointer',
                            border:     '1.5px solid ' + (busy?'transparent':booked?'var(--color-primary)':'#86efac'),
                          }}>
                          {busy?'✕':booked?'✓':'+'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {bookedSlots.length>0&&(
          <div className="mt-3 p-3 rounded-xl text-xs" style={{ background:'var(--color-primary)12', color:'var(--color-primary)' }}>
            <span className="font-bold">{bookedSlots.length} slot{bookedSlots.length!==1?'s':''} selected.</span> The recipient can confirm. You will receive a notification.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ user, theme, updateUser }) {
  const [tab,setTab]=useState('profile'); const [search,setSearch]=useState('');
  const inp="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2"; const is={ background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.25)' };
  const filtered=THEMES.filter(t=>t.name.toLowerCase().includes(search.toLowerCase()));
  const tabs=[{id:'profile',label:'Profile'},{id:'themes',label:'Themes'}];
  const [tzSearch, setTzSearch] = useState('');
  const [tzOpen, setTzOpen]     = useState(false);

  // timezone list moved to ALL_TIMEZONES module-level constant below

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex gap-2 p-1 rounded-2xl w-fit" style={{ background:'var(--color-card)' }}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className="px-5 py-2 rounded-xl text-sm font-semibold transition" style={{ background:tab===t.id?'var(--color-primary)':'transparent', color:tab===t.id?'#fff':'var(--color-text-light)' }}>{t.label}</button>)}
      </div>
      {tab==='profile'&&(
        <div className="rounded-2xl shadow p-6 space-y-4" style={{ background:'var(--color-card)' }}>
          <h2 className="text-xl font-bold" style={{ color:'var(--color-text)' }}>Account Settings</h2>
          {[{label:'Full Name',key:'name',type:'text'},{label:'Email',key:'email',type:'email'}].map(f=>(
            <div key={f.key}><label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>{f.label}</label>
              <input type={f.type} className={inp} style={is} value={user[f.key]||''} onChange={e=>updateUser({...user,[f.key]:e.target.value})}/></div>
          ))}
          {/* Country */}
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Country</label>
            <input className={inp} style={is} placeholder="e.g. Kenya" value={user.country||''} onChange={e=>updateUser({...user,country:e.target.value})}/>
          </div>
          {/* Timezone searchable */}
          <div className="relative">
            <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Timezone</label>
            <input className={inp} style={is}
              placeholder="Search city, country or UTC offset…"
              value={tzSearch || user.timezone || ''}
              onFocus={() => { setTzOpen(true); setTzSearch(''); }}
              onChange={e => { setTzSearch(e.target.value); setTzOpen(true); }}
            />
            {tzOpen && (
              <div className="absolute z-50 w-full mt-1 rounded-xl shadow-xl border overflow-hidden" style={{ background:'var(--color-card)', borderColor:'rgba(128,128,128,0.2)', maxHeight:260, overflowY:'auto' }}>
                {ALL_TIMEZONES.filter(tz => {
                  const q = (tzSearch||'').toLowerCase();
                  return !q || tz.label.toLowerCase().includes(q) || tz.value.toLowerCase().includes(q);
                }).slice(0,40).map(tz => (
                  <button key={tz.value} onMouseDown={e=>e.preventDefault()} onClick={() => {
                    updateUser({...user, timezone: tz.value});
                    setTzSearch(''); setTzOpen(false);
                  }} className="w-full text-left px-4 py-2.5 text-sm hover:opacity-80 transition border-b last:border-0"
                    style={{ background: user.timezone===tz.value ? `var(--color-primary)15` : 'transparent', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.08)', fontWeight: user.timezone===tz.value?700:400 }}>
                    <span className="font-mono text-xs mr-2 font-semibold" style={{ color:'var(--color-primary)' }}>{tz.value}</span>
                    {tz.cities}
                  </button>
                ))}
                {ALL_TIMEZONES.filter(tz=>{ const q=(tzSearch||'').toLowerCase(); return !q||tz.label.toLowerCase().includes(q)||tz.value.toLowerCase().includes(q); }).length===0 &&
                  <div className="px-4 py-3 text-sm" style={{ color:'var(--color-text-light)' }}>No results found</div>
                }
              </div>
            )}
            {tzOpen && <div className="fixed inset-0 z-40" onClick={()=>setTzOpen(false)}/>}
            {user.timezone && !tzOpen && (
              <p className="text-xs mt-1" style={{ color:'var(--color-text-light)' }}>
                {ALL_TIMEZONES.find(t=>t.value===user.timezone)?.cities || user.timezone}
              </p>
            )}
          </div>
          <button className="w-full py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-80 transition" style={{ background:'var(--color-primary)' }}>Save Changes</button>
        </div>
      )}
      {tab==='themes'&&(
        <div className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color:'var(--color-text)' }}>Choose Your Theme</h2>
          <input className={`${inp} mb-4`} style={is} placeholder="Search themes…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto pr-1">
            {filtered.map(t=>{ const active=user.themeId===t.id; return (
              <button key={t.id} onClick={()=>updateUser({...user,themeId:t.id})}
                className="rounded-2xl p-4 text-left transition hover:scale-105 border-2"
                style={{ background:t.bg, borderColor:active?t.primary:'transparent', boxShadow:active?`0 0 0 2px ${t.primary}`:'none' }}>
                <div className="flex gap-1 mb-2"><div className="w-5 h-5 rounded-full" style={{ background:t.primary }}/><div className="w-5 h-5 rounded-full" style={{ background:t.secondary }}/><div className="w-5 h-5 rounded-full" style={{ background:t.accent }}/></div>
                <p className="text-xs font-bold truncate" style={{ color:t.text }}>{t.name}</p>
                <p className="text-xs opacity-60" style={{ color:t.text }}>{t.dark?'🌙 Dark':'☀️ Light'}</p>
                {active&&<div className="mt-1 text-xs font-bold" style={{ color:t.primary }}>✓ Active</div>}
              </button>); })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SHARING PAGE (standalone) ────────────────────────────────────────────────
const PERMISSIONS = [
  { value:'view',   label:'View only',       desc:'Can see all events, cannot make changes.' },
  { value:'book',   label:'Book free slots', desc:'Can only add events in your free time. Busy slots are blocked.' },
  { value:'edit',   label:'Add & Edit',      desc:'Can add new events and edit existing ones.' },
  { value:'manage', label:'Full manage',     desc:'Full control — add, edit, delete, and manage settings.' },
];

function SharingPage({ events, calendars, sharedCalendars, theme, onShareCalendar, onRemoveShare, onUpdateShare }) {
  const [shareEmail,setShareEmail]           = useState('');
  const [shareCal,setShareCal]               = useState(calendars[0]?.id||'');
  const [sharePermission,setSharePermission] = useState('view');
  const [editingId, setEditingId]            = useState(null); // which share is being edited

  const inp="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2";
  const is={ background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.25)' };

  const addShare = () => {
    if (!shareEmail.trim()) return;
    onShareCalendar({ id:Date.now().toString(), calendarId:shareCal, email:shareEmail, permission:sharePermission, sharedAt:new Date().toLocaleDateString() });
    setShareEmail('');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="rounded-2xl p-7 text-white" style={{ background:`linear-gradient(135deg,${theme.primary},${theme.secondary})` }}>
        <div className="flex items-center gap-3 mb-1">
          <Share2 size={26}/>
          <h1 className="text-2xl font-bold">Calendar Sharing</h1>
        </div>
        <p className="text-white/70 text-sm">Share your calendars and control exactly what others can see or do.</p>
      </div>

      {/* Share form */}
      <div className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)' }}>
        <h2 className="text-lg font-bold mb-1" style={{ color:'var(--color-text)' }}>Share a Calendar</h2>
        <p className="text-sm mb-5" style={{ color:'var(--color-text-light)' }}>Pick a calendar, enter an email, and choose what they can do.</p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Calendar</label>
              <select className={inp} style={is} value={shareCal} onChange={e=>setShareCal(e.target.value)}>
                {calendars.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--color-text-light)' }}>Share with (email)</label>
              <input className={inp} style={is} placeholder="colleague@example.com" value={shareEmail} onChange={e=>setShareEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addShare()} />
            </div>
          </div>

          {/* Permission selector */}
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color:'var(--color-text-light)' }}>Permission Level</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PERMISSIONS.map(p=>(
                <button key={p.value} onClick={()=>setSharePermission(p.value)}
                  className="text-left p-4 rounded-xl border-2 transition hover:shadow-md"
                  style={{ borderColor:sharePermission===p.value?'var(--color-primary)':'rgba(128,128,128,0.18)', background:sharePermission===p.value?`var(--color-primary)12`:'var(--color-bg)' }}>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                      style={{ borderColor:'var(--color-primary)', background:sharePermission===p.value?'var(--color-primary)':'transparent' }}>
                      {sharePermission===p.value&&<div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color:'var(--color-text)' }}>{p.label}</p>
                      <p className="text-xs mt-0.5" style={{ color:'var(--color-text-light)' }}>{p.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Live preview for book permission */}
          {sharePermission==='book' && (
            <BookSlotPreview events={events} calendarId={shareCal} theme={theme} />
          )}

          <button onClick={addShare} className="w-full py-3 rounded-xl text-white font-bold text-sm hover:opacity-80 transition flex items-center justify-center gap-2" style={{ background:'var(--color-primary)' }}>
            <Share2 size={16}/> Share Calendar
          </button>
        </div>
      </div>

      {/* Shared list */}
      <div className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color:'var(--color-text)' }}>
          Shared Calendars <span className="text-sm font-normal ml-1" style={{ color:'var(--color-text-light)' }}>({sharedCalendars.length})</span>
        </h2>
        {sharedCalendars.length === 0 ? (
          <div className="text-center py-10">
            <Share2 size={40} className="mx-auto mb-3 opacity-20" style={{ color:'var(--color-text)' }}/>
            <p className="text-sm" style={{ color:'var(--color-text-light)' }}>No calendars shared yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sharedCalendars.map(sc => {
              const cal  = calendars.find(c=>c.id===sc.calendarId);
              const perm = PERMISSIONS.find(p=>p.value===sc.permission);
              const isEditing = editingId === sc.id;
              return (
                <div key={sc.id} className="rounded-xl overflow-hidden" style={{ background:'var(--color-bg)', border:'1.5px solid rgba(128,128,128,0.15)' }}>
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:`${cal?.color||'var(--color-primary)'}20` }}>
                      <div className="w-3 h-3 rounded-full" style={{ background:cal?.color||'var(--color-primary)' }}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold" style={{ color:'var(--color-text)' }}>{cal?.name||sc.calendarId}</p>
                      <p className="text-xs mt-0.5" style={{ color:'var(--color-text-light)' }}>
                        Shared with <span className="font-semibold">{sc.email}</span> · {sc.sharedAt}
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0" style={{ background:`var(--color-primary)18`, color:'var(--color-primary)' }}>{perm?.label||sc.permission}</span>
                    <button onClick={()=>setEditingId(isEditing?null:sc.id)}
                      className="p-1.5 rounded-lg transition flex-shrink-0 font-semibold text-xs px-3 py-1.5"
                      style={{ background: isEditing?'var(--color-primary)':'rgba(128,128,128,0.12)', color: isEditing?'#fff':'var(--color-text-light)' }}>
                      {isEditing ? 'Done' : 'Edit'}
                    </button>
                    {onRemoveShare && (
                      <button onClick={()=>onRemoveShare(sc.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition flex-shrink-0">
                        <X size={14}/>
                      </button>
                    )}
                  </div>
                  {/* Inline permission editor */}
                  {isEditing && (
                    <div className="px-4 pb-4 border-t pt-3" style={{ borderColor:'rgba(128,128,128,0.1)' }}>
                      <p className="text-xs font-bold mb-2" style={{ color:'var(--color-text-light)' }}>Change permission level:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {PERMISSIONS.map(p => (
                          <button key={p.value} onClick={()=>{ onUpdateShare(sc.id, p.value); setEditingId(null); }}
                            className="p-3 rounded-xl border-2 text-left transition hover:shadow-sm"
                            style={{ borderColor: sc.permission===p.value?'var(--color-primary)':'rgba(128,128,128,0.18)', background: sc.permission===p.value?`var(--color-primary)12`:'var(--color-card)' }}>
                            <p className="text-xs font-bold" style={{ color:'var(--color-text)' }}>{p.label}</p>
                            <p className="text-xs mt-0.5 opacity-70" style={{ color:'var(--color-text-light)' }}>{p.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SHARING QUICK CARD (Dashboard widget) ────────────────────────────────────
function SharingQuickCard({ setPage, sharedCalendars, calendars, theme }) {
  return (
    <div className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)', borderLeft:`4px solid var(--color-primary)` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl" style={{ background:`var(--color-primary)18` }}>
            <Share2 size={18} style={{ color:'var(--color-primary)' }}/>
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color:'var(--color-text)' }}>Calendar Sharing</h3>
            <p className="text-xs" style={{ color:'var(--color-text-light)' }}>{sharedCalendars.length} calendar{sharedCalendars.length!==1?'s':''} shared</p>
          </div>
        </div>
        <button onClick={()=>setPage('sharing')} className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold hover:opacity-80 transition" style={{ background:'var(--color-primary)' }}>
          Manage
        </button>
      </div>
      {sharedCalendars.length > 0 ? (
        <div className="space-y-2">
          {sharedCalendars.slice(0,3).map(sc => {
            const cal  = calendars.find(c=>c.id===sc.calendarId);
            const perm = PERMISSIONS.find(p=>p.value===sc.permission);
            return (
              <div key={sc.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background:'var(--color-bg)' }}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background:cal?.color||'var(--color-primary)' }}/>
                <span className="text-xs flex-1 truncate font-medium" style={{ color:'var(--color-text)' }}>{cal?.name} → {sc.email}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:`var(--color-primary)15`, color:'var(--color-primary)' }}>{perm?.label}</span>
              </div>
            );
          })}
          {sharedCalendars.length > 3 && (
            <button onClick={()=>setPage('sharing')} className="text-xs font-semibold hover:underline w-full text-center pt-1" style={{ color:'var(--color-primary)' }}>
              +{sharedCalendars.length-3} more — View all
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-xl" style={{ background:'var(--color-bg)' }}>
          <p className="text-xs" style={{ color:'var(--color-text-light)' }}>No calendars shared yet.</p>
          <button onClick={()=>setPage('sharing')} className="text-xs font-semibold hover:underline" style={{ color:'var(--color-primary)' }}>Share now →</button>
        </div>
      )}
    </div>
  );
}

// ─── COMPREHENSIVE WORLD TIMEZONES ───────────────────────────────────────────
export const ALL_TIMEZONES = [
  { value:'UTC-12',   cities:'Baker Island, Howland Island',                                                  label:'UTC-12 Baker Island' },
  { value:'UTC-11',   cities:'Pago Pago, American Samoa, Niue',                                               label:'UTC-11 Pago Pago American Samoa' },
  { value:'UTC-10',   cities:'Honolulu, Hilo, Hawaii, Cook Islands, Tahiti',                                  label:'UTC-10 Honolulu Hawaii Tahiti' },
  { value:'UTC-9:30', cities:'Marquesas Islands, French Polynesia',                                           label:'UTC-9:30 Marquesas' },
  { value:'UTC-9',    cities:'Anchorage, Juneau, Fairbanks, Alaska',                                          label:'UTC-9 Anchorage Alaska' },
  { value:'UTC-8',    cities:'Los Angeles, San Francisco, Seattle, Vancouver, Tijuana',                       label:'UTC-8 Los Angeles Vancouver Seattle' },
  { value:'UTC-7',    cities:'Denver, Phoenix, Calgary, Salt Lake City, El Paso',                             label:'UTC-7 Denver Phoenix Calgary' },
  { value:'UTC-6',    cities:'Chicago, Mexico City, Guadalajara, Houston, Winnipeg, Guatemala City',          label:'UTC-6 Chicago Mexico City Houston' },
  { value:'UTC-5',    cities:'New York, Toronto, Miami, Bogotá, Lima, Havana, Panama City',                   label:'UTC-5 New York Toronto Bogota Lima' },
  { value:'UTC-4',    cities:'Santiago, Caracas, Halifax, La Paz, Manaus, Santo Domingo, Barbados',           label:'UTC-4 Santiago Caracas Halifax' },
  { value:'UTC-3',    cities:'São Paulo, Rio de Janeiro, Buenos Aires, Montevideo, Brasília, Asunción',       label:'UTC-3 Sao Paulo Buenos Aires Montevideo' },
  { value:'UTC-2:30', cities:'St. John\'s, Newfoundland',                                                     label:'UTC-2:30 St Johns Newfoundland' },
  { value:'UTC-2',    cities:'Fernando de Noronha, South Georgia',                                            label:'UTC-2 Fernando de Noronha' },
  { value:'UTC-1',    cities:'Azores, Cape Verde, Praia',                                                     label:'UTC-1 Azores Cape Verde' },
  { value:'UTC+0',    cities:'London, Dublin, Lisbon, Accra, Dakar, Reykjavik, Abidjan, Monrovia, Bamako',   label:'UTC+0 London Dublin Lisbon Accra Dakar' },
  { value:'UTC+1',    cities:'Lagos, Kinshasa, Luanda, Paris, Berlin, Rome, Madrid, Amsterdam, Douala, Tunis, Algiers, Casablanca, Libreville, Bangui, Niamey, Yaoundé, Brazzaville, Malabo, Porto-Novo, Ndjamena, Lomé, Cotonou', label:'UTC+1 Lagos Paris Berlin Rome Madrid Casablanca' },
  { value:'UTC+2',    cities:'Cairo, Johannesburg, Nairobi area, Athens, Bucharest, Harare, Kigali, Kampala, Lusaka, Lilongwe, Gaborone, Maputo, Windhoek, Tripoli, Juba, Khartoum, Helsinki, Tallinn, Riga, Vilnius, Kyiv',       label:'UTC+2 Cairo Johannesburg Athens Harare Kigali Kampala' },
  { value:'UTC+3',    cities:'Nairobi, Dar es Salaam, Addis Ababa, Riyadh, Moscow, Mogadishu, Antananarivo, Djibouti, Asmara, Baghdad, Kuwait City, Doha, Istanbul, Minsk, Amman, Beirut, Damascus',                               label:'UTC+3 Nairobi Dar es Salaam Addis Ababa Riyadh Moscow Baghdad' },
  { value:'UTC+3:30', cities:'Tehran, Iran',                                                                  label:'UTC+3:30 Tehran Iran' },
  { value:'UTC+4',    cities:'Dubai, Abu Dhabi, Muscat, Baku, Tbilisi, Yerevan, Mahe, Mauritius, Port Louis, Samara', label:'UTC+4 Dubai Abu Dhabi Muscat Baku Tbilisi' },
  { value:'UTC+4:30', cities:'Kabul, Afghanistan',                                                            label:'UTC+4:30 Kabul Afghanistan' },
  { value:'UTC+5',    cities:'Karachi, Islamabad, Lahore, Tashkent, Ashgabat, Yekaterinburg, Maldives',      label:'UTC+5 Karachi Islamabad Tashkent' },
  { value:'UTC+5:30', cities:'New Delhi, Mumbai, Kolkata, Chennai, Bangalore, Colombo, Sri Lanka',           label:'UTC+5:30 New Delhi Mumbai Kolkata Colombo' },
  { value:'UTC+5:45', cities:'Kathmandu, Nepal',                                                              label:'UTC+5:45 Kathmandu Nepal' },
  { value:'UTC+6',    cities:'Dhaka, Chittagong, Almaty, Bishkek, Thimphu, Bhutan',                          label:'UTC+6 Dhaka Almaty Bishkek' },
  { value:'UTC+6:30', cities:'Yangon, Mandalay, Myanmar, Cocos Islands',                                     label:'UTC+6:30 Yangon Myanmar' },
  { value:'UTC+7',    cities:'Bangkok, Jakarta, Hanoi, Ho Chi Minh City, Phnom Penh, Vientiane, Novosibirsk, Krasnoyarsk', label:'UTC+7 Bangkok Jakarta Hanoi Ho Chi Minh' },
  { value:'UTC+8',    cities:'Beijing, Shanghai, Singapore, Kuala Lumpur, Perth, Manila, Hong Kong, Taipei, Ulaanbaatar, Makassar, Denpasar', label:'UTC+8 Beijing Singapore Kuala Lumpur Perth Manila Hong Kong' },
  { value:'UTC+8:45', cities:'Eucla, Australia',                                                              label:'UTC+8:45 Eucla Australia' },
  { value:'UTC+9',    cities:'Tokyo, Osaka, Seoul, Pyongyang, Yakutsk, Palau',                               label:'UTC+9 Tokyo Osaka Seoul' },
  { value:'UTC+9:30', cities:'Adelaide, Darwin, Australia Central',                                          label:'UTC+9:30 Adelaide Darwin' },
  { value:'UTC+10',   cities:'Sydney, Melbourne, Brisbane, Canberra, Vladivostok, Port Moresby, Guam',       label:'UTC+10 Sydney Melbourne Brisbane Vladivostok' },
  { value:'UTC+10:30',cities:'Lord Howe Island, Australia',                                                   label:'UTC+10:30 Lord Howe Island' },
  { value:'UTC+11',   cities:'Noumea, New Caledonia, Honiara, Solomon Islands, Magadan, Vanuatu',            label:'UTC+11 Noumea Solomon Islands' },
  { value:'UTC+12',   cities:'Auckland, Wellington, Fiji, Suva, Kamchatka, Marshall Islands, Tarawa',        label:'UTC+12 Auckland Wellington Fiji' },
  { value:'UTC+12:45',cities:'Chatham Islands, New Zealand',                                                  label:'UTC+12:45 Chatham Islands' },
  { value:'UTC+13',   cities:'Nuku\'alofa, Tonga, Samoa, Apia, Phoenix Islands',                             label:'UTC+13 Tongatapu Samoa Apia' },
  { value:'UTC+14',   cities:'Kiritimati, Line Islands, Kiribati',                                            label:'UTC+14 Kiritimati Kiribati' },
];
