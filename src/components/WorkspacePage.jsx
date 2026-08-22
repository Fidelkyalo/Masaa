import React, { useState } from 'react';
import {
  Building2, Church, GraduationCap, Users, Plus, Trash2,
  Calendar, Clock, ChevronRight, Settings, Shield, BookOpen,
  UserCheck, MapPin, Bell, Briefcase, Home, Star
} from 'lucide-react';

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
const inp = "w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2";
const is  = { background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.25)' };

function Card({ children, style }) {
  return <div className="rounded-2xl shadow p-5" style={{ background:'var(--color-card)', ...style }}>{children}</div>;
}
function SectionTitle({ icon, title, sub }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 rounded-xl" style={{ background:'var(--color-primary)18' }}>{icon}</div>
      <div><h3 className="font-bold" style={{ color:'var(--color-text)' }}>{title}</h3>
        {sub && <p className="text-xs" style={{ color:'var(--color-text-light)' }}>{sub}</p>}</div>
    </div>
  );
}

const ROLES = ['Admin','Manager','Member','Viewer'];
const DEPT_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316'];

// ─── MAIN WORKSPACE PAGE ──────────────────────────────────────────────────────
export default function WorkspacePage({ workspace, updateWorkspace, events, theme }) {
  const [tab, setTab] = useState('overview');
  const ws = workspace;

  const tabs = ws.type === 'business'
    ? [{id:'overview',label:'Overview'},{id:'departments',label:'Departments'},{id:'members',label:'Members'},{id:'rooms',label:'Resources'},{id:'leave',label:'Leave'},{id:'schedule',label:'Schedule'}]
    : ws.type === 'church'
    ? [{id:'overview',label:'Overview'},{id:'ministries',label:'Ministries'},{id:'members',label:'Members'},{id:'services',label:'Services'},{id:'schedule',label:'Schedule'}]
    : [{id:'overview',label:'Overview'},{id:'classes',label:'Classes'},{id:'staff',label:'Staff'},{id:'schedule',label:'Timetable'},{id:'events',label:'Events'}];

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header banner */}
      <div className="rounded-2xl p-7 text-white" style={{ background:`linear-gradient(135deg,${theme.primary},${theme.secondary})` }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              {ws.type==='business' ? <Building2 size={28}/> : ws.type==='church' ? <Church size={28}/> : <GraduationCap size={28}/>}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{ws.name}</h1>
              <p className="text-white/70 text-sm capitalize">{ws.type} Workspace · {(ws.members||[]).length} members</p>
            </div>
          </div>
        </div>
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {[
            { l:'Members',    v:(ws.members||[]).length },
            { l:ws.type==='business'?'Departments':ws.type==='church'?'Ministries':'Classes', v:(ws.departments||ws.ministries||ws.classes||[]).length },
            { l:'Events This Week', v: events.filter(e=>{ const d=new Date(e.date+'T12:00'); const now=new Date(); const ws2=new Date(now); ws2.setDate(now.getDate()-now.getDay()); const we=new Date(ws2); we.setDate(ws2.getDate()+6); return d>=ws2&&d<=we; }).length },
            { l:'Resources', v:(ws.resources||[]).length },
          ].map((s,i)=>(
            <div key={i} className="bg-white/15 rounded-xl p-3">
              <p className="text-white/70 text-xs">{s.l}</p>
              <p className="text-xl font-bold">{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition"
            style={{ background:tab===t.id?'var(--color-primary)':'var(--color-card)', color:tab===t.id?'#fff':'var(--color-text-light)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab==='overview'    && <OverviewTab ws={ws} updateWorkspace={updateWorkspace} theme={theme} events={events} />}
      {tab==='departments' && <DepartmentsTab ws={ws} updateWorkspace={updateWorkspace} />}
      {tab==='ministries'  && <DepartmentsTab ws={ws} updateWorkspace={updateWorkspace} label="Ministry" />}
      {tab==='classes'     && <ClassesTab ws={ws} updateWorkspace={updateWorkspace} />}
      {tab==='members'     && <MembersTab ws={ws} updateWorkspace={updateWorkspace} theme={theme} />}
      {tab==='staff'       && <MembersTab ws={ws} updateWorkspace={updateWorkspace} theme={theme} label="Staff" />}
      {tab==='rooms'       && <ResourcesTab ws={ws} updateWorkspace={updateWorkspace} />}
      {tab==='leave'       && <LeaveTab ws={ws} updateWorkspace={updateWorkspace} theme={theme} />}
      {tab==='services'    && <ServicesTab ws={ws} updateWorkspace={updateWorkspace} theme={theme} />}
      {tab==='schedule'    && <ScheduleTab ws={ws} events={events} theme={theme} />}
      {tab==='events'      && <ScheduleTab ws={ws} events={events} theme={theme} label="School Events" />}
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ ws, updateWorkspace, theme, events }) {
  const [editing, setEditing] = useState(false);
  const [name, setName]   = useState(ws.name);
  const [desc, setDesc]   = useState(ws.description||'');

  const today = new Date().toISOString().split('T')[0];
  const upcoming = events.filter(e=>e.date>=today).slice(0,4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card>
        <SectionTitle icon={<Settings size={16} style={{ color:'var(--color-primary)' }}/>} title="Workspace Settings" />
        {editing ? (
          <div className="space-y-3">
            <input className={inp} style={is} value={name} onChange={e=>setName(e.target.value)} placeholder="Workspace name"/>
            <textarea className={`${inp} resize-none`} style={is} rows={2} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description"/>
            <div className="flex gap-2">
              <button onClick={()=>setEditing(false)} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background:'rgba(128,128,128,0.15)', color:'var(--color-text)' }}>Cancel</button>
              <button onClick={()=>{ updateWorkspace({...ws,name,description:desc}); setEditing(false); }} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background:'var(--color-primary)' }}>Save</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div><p className="text-xs mb-0.5" style={{ color:'var(--color-text-light)' }}>Name</p><p className="font-semibold" style={{ color:'var(--color-text)' }}>{ws.name}</p></div>
            <div><p className="text-xs mb-0.5" style={{ color:'var(--color-text-light)' }}>Type</p><p className="font-semibold capitalize" style={{ color:'var(--color-text)' }}>{ws.type}</p></div>
            {ws.description && <div><p className="text-xs mb-0.5" style={{ color:'var(--color-text-light)' }}>Description</p><p className="text-sm" style={{ color:'var(--color-text)' }}>{ws.description}</p></div>}
            <button onClick={()=>setEditing(true)} className="text-xs font-semibold hover:underline" style={{ color:'var(--color-primary)' }}>Edit settings</button>
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle icon={<Calendar size={16} style={{ color:'var(--color-primary)' }}/>} title="Upcoming Events" />
        {upcoming.length>0 ? (
          <div className="space-y-2">
            {upcoming.map(ev=>(
              <div key={ev.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background:'var(--color-bg)' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:ev.color||'var(--color-primary)' }}/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color:'var(--color-text)' }}>{ev.title}</p>
                  <p className="text-xs" style={{ color:'var(--color-text-light)' }}>{ev.date} · {ev.startTime}</p>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-sm" style={{ color:'var(--color-text-light)' }}>No upcoming events.</p>}
      </Card>

      <Card>
        <SectionTitle icon={<Shield size={16} style={{ color:'var(--color-primary)' }}/>} title="Role-Based Access" sub="Manage who can do what"/>
        <div className="space-y-2">
          {ROLES.map(role=>(
            <div key={role} className="flex items-center justify-between p-2.5 rounded-xl" style={{ background:'var(--color-bg)' }}>
              <span className="text-sm font-semibold" style={{ color:'var(--color-text)' }}>{role}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:`var(--color-primary)18`, color:'var(--color-primary)' }}>
                {(ws.members||[]).filter(m=>m.role===role).length} member{(ws.members||[]).filter(m=>m.role===role).length!==1?'s':''}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<Star size={16} style={{ color:'#f59e0b' }}/>} title="Attendance Summary" />
        <div className="space-y-2">
          {[{ l:'Present today', v: Math.floor(Math.random()*((ws.members||[]).length||5)+1), c:'#10b981' },
            { l:'On leave', v:(ws.leaveRequests||[]).filter(l=>l.status==='approved'&&l.startDate<=new Date().toISOString().split('T')[0]&&l.endDate>=new Date().toISOString().split('T')[0]).length, c:'#f59e0b' },
            { l:'Total members', v:(ws.members||[]).length, c:'var(--color-primary)' }
          ].map((s,i)=>(
            <div key={i} className="flex justify-between p-2.5 rounded-xl" style={{ background:'var(--color-bg)' }}>
              <span className="text-sm" style={{ color:'var(--color-text-light)' }}>{s.l}</span>
              <span className="font-bold text-sm" style={{ color:s.c }}>{s.v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
