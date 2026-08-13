import React from 'react';
import { TrendingUp, Clock, Calendar, CheckCircle2, BarChart2 } from 'lucide-react';

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs w-10 text-right flex-shrink-0" style={{ color:'var(--color-text-light)' }}>{label}</span>
      <div className="flex-1 rounded-full h-6 overflow-hidden" style={{ background:'rgba(128,128,128,0.12)' }}>
        <div className="h-full rounded-full flex items-center px-2 transition-all duration-500"
          style={{ width:`${pct}%`, background: color, minWidth: value > 0 ? '28px' : 0 }}>
          {value > 0 && <span className="text-white text-xs font-bold">{value}</span>}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="rounded-2xl p-5 shadow" style={{ background:'var(--color-card)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ background:`${color}20` }}>{icon}</div>
      </div>
      <p className="text-3xl font-bold mb-0.5" style={{ color }}>{value}</p>
      <p className="text-xs font-semibold" style={{ color:'var(--color-text)' }}>{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color:'var(--color-text-light)' }}>{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage({ events, tasks }) {
  const today     = new Date();
  const todayStr  = today.toISOString().split('T')[0];
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd   = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
  const wStart    = weekStart.toISOString().split('T')[0];
  const wEnd      = weekEnd.toISOString().split('T')[0];

  const thisWeekEvents  = events.filter(e => e.date >= wStart && e.date <= wEnd);
  const todayEvents     = events.filter(e => e.date === todayStr);
  const completedTasks  = tasks.filter(t => t.completed).length;
  const totalTasks      = tasks.length;
  const completionRate  = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Events by day of week
  const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const byDay = [0,0,0,0,0,0,0];
  events.forEach(e => { const d = new Date(e.date+'T12:00'); byDay[d.getDay()]++; });
  const maxDay = Math.max(...byDay, 1);
  const busiestDay = dayLabels[byDay.indexOf(Math.max(...byDay))];

  // Events by category
  const catCount = {};
  events.forEach(e => { catCount[e.category||'other'] = (catCount[e.category||'other']||0)+1; });
  const catEntries = Object.entries(catCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxCat = Math.max(...catEntries.map(c=>c[1]), 1);

  // Total meeting hours
  const totalMins = events.reduce((acc, e) => {
    if (!e.startTime || !e.endTime) return acc;
    const [sh,sm] = e.startTime.split(':').map(Number);
    const [eh,em] = e.endTime.split(':').map(Number);
    return acc + ((eh*60+em) - (sh*60+sm));
  }, 0);
  const totalHours = Math.round(totalMins / 60);

  // Tasks by priority
  const priCount = { high:0, medium:0, low:0 };
  tasks.forEach(t => { if (!t.completed) priCount[t.priority] = (priCount[t.priority]||0)+1; });

  const catColors = { work:'#3b82f6', personal:'#10b981', meeting:'#8b5cf6', school:'#f59e0b', church:'#ec4899', family:'#ef4444', other:'#94a3b8' };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold" style={{ color:'var(--color-text)' }}>Analytics</h2>
        <p className="text-sm" style={{ color:'var(--color-text-light)' }}>How you're spending your time</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Calendar size={20} style={{ color:'var(--color-primary)' }}/>} label="This Week's Events" value={thisWeekEvents.length} sub={`${todayEvents.length} today`} color="var(--color-primary)" />
        <StatCard icon={<CheckCircle2 size={20} style={{ color:'#10b981' }}/>} label="Task Completion" value={`${completionRate}%`} sub={`${completedTasks}/${totalTasks} done`} color="#10b981" />
        <StatCard icon={<Clock size={20} style={{ color:'#f59e0b' }}/>} label="Total Meeting Hours" value={totalHours} sub="across all events" color="#f59e0b" />
        <StatCard icon={<TrendingUp size={20} style={{ color:'#8b5cf6' }}/>} label="Busiest Day" value={busiestDay} sub={`${byDay[dayLabels.indexOf(busiestDay)]} events`} color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Events by day of week */}
        <div className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)' }}>
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color:'var(--color-text)' }}>
            <BarChart2 size={18} style={{ color:'var(--color-primary)' }}/> Events by Day of Week
          </h3>
          {dayLabels.map((d, i) => (
            <Bar key={d} label={d} value={byDay[i]} max={maxDay} color="var(--color-primary)" />
          ))}
        </div>

        {/* Events by category */}
        <div className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)' }}>
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color:'var(--color-text)' }}>
            <BarChart2 size={18} style={{ color:'#10b981' }}/> Events by Category
          </h3>
          {catEntries.length > 0 ? catEntries.map(([cat, cnt]) => (
            <Bar key={cat} label={cat.slice(0,6)} value={cnt} max={maxCat} color={catColors[cat]||'#94a3b8'} />
          )) : <p className="text-sm" style={{ color:'var(--color-text-light)' }}>No events yet.</p>}
        </div>

        {/* Task breakdown */}
        <div className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)' }}>
          <h3 className="font-bold mb-4" style={{ color:'var(--color-text)' }}>Pending Tasks by Priority</h3>
          <Bar label="High"   value={priCount.high}   max={Math.max(priCount.high, priCount.medium, priCount.low, 1)} color="#ef4444" />
          <Bar label="Med"    value={priCount.medium} max={Math.max(priCount.high, priCount.medium, priCount.low, 1)} color="#f59e0b" />
          <Bar label="Low"    value={priCount.low}    max={Math.max(priCount.high, priCount.medium, priCount.low, 1)} color="#10b981" />
          {/* Completion donut-style */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color:'var(--color-text)' }}>Overall Completion</span>
              <span className="text-xs font-bold" style={{ color:'#10b981' }}>{completionRate}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background:'rgba(128,128,128,0.12)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width:`${completionRate}%`, background:'#10b981' }} />
            </div>
          </div>
        </div>

        {/* Upcoming busy periods */}
        <div className="rounded-2xl shadow p-6" style={{ background:'var(--color-card)' }}>
          <h3 className="font-bold mb-4" style={{ color:'var(--color-text)' }}>This Week's Schedule</h3>
          {thisWeekEvents.length > 0 ? (
            <div className="space-y-2">
              {thisWeekEvents.sort((a,b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)).slice(0,6).map(ev => (
                <div key={ev.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background:'var(--color-bg)' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ev.color || 'var(--color-primary)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color:'var(--color-text)' }}>{ev.title}</p>
                    <p className="text-xs" style={{ color:'var(--color-text-light)' }}>{new Date(ev.date+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})} · {ev.startTime}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color:'var(--color-text-light)' }}>No events this week.</p>
          )}
        </div>
      </div>
    </div>
  );
}
