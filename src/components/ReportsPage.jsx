import React, { useState, useMemo } from 'react';
import {
  Brain, TrendingUp, TrendingDown, Calendar, Clock, CheckCircle2,
  AlertTriangle, Target, Users, Zap, BarChart2, ArrowUp, ArrowDown,
  Minus, ChevronRight, Send, Lightbulb, Shield, Star, Activity,
  RefreshCw, XCircle, MessageSquare
} from 'lucide-react';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getWeekRange(offset = 0) {
  const now = new Date();
  const s = new Date(now); s.setDate(now.getDate() - now.getDay() + offset * 7);
  const e = new Date(s); e.setDate(s.getDate() + 6);
  return { start: s.toISOString().split('T')[0], end: e.toISOString().split('T')[0] };
}
function getMonthRange(offset = 0) {
  const now = new Date();
  const s = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const e = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  return { start: s.toISOString().split('T')[0], end: e.toISOString().split('T')[0] };
}
function getTodayStr() { return new Date().toISOString().split('T')[0]; }
function eventsInRange(events, start, end) { return events.filter(e => e.date >= start && e.date <= end); }
function totalMins(events) {
  return events.reduce((acc, e) => {
    if (!e.startTime || !e.endTime) return acc;
    const [sh, sm] = e.startTime.split(':').map(Number);
    const [eh, em] = e.endTime.split(':').map(Number);
    return acc + Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
  }, 0);
}
function fmtHM(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}
function pct(a, b) { return b > 0 ? Math.round((a / b) * 100) : 0; }
function delta(curr, prev) {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
}
function isMeeting(ev) {
  return ['meeting','work'].includes(ev.category) || (ev.attendees && ev.attendees.length > 0);
}
const CATEGORY_COLORS = {
  work:'#3b82f6', meeting:'#8b5cf6', personal:'#10b981', family:'#ef4444',
  church:'#f59e0b', school:'#06b6d4', health:'#ec4899', other:'#94a3b8',
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function Section({ title, icon, children, accent }) {
  return (
    <div className="rounded-2xl shadow p-6" style={{ background: 'var(--color-card)' }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl" style={{ background: `${accent}20` }}>{icon}</div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MetricRow({ label, value, sub, color, icon }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(128,128,128,0.1)' }}>
      <div className="flex items-center gap-2">
        {icon && <span style={{ color: color || 'var(--color-primary)' }}>{icon}</span>}
        <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>{label}</span>
      </div>
      <div className="text-right">
        <span className="font-bold text-sm" style={{ color: color || 'var(--color-text)' }}>{value}</span>
        {sub && <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>{sub}</p>}
      </div>
    </div>
  );
}

function DeltaBadge({ d }) {
  if (d === 0) return <span className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"><Minus size={10}/> No change</span>;
  const up = d > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full font-semibold ${up ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
      {up ? <ArrowUp size={10}/> : <ArrowDown size={10}/>} {Math.abs(d)}%
    </span>
  );
}

function ProgressBar({ value, max, color, label, showPct = true }) {
  const p = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="mb-3">
      {label && <div className="flex justify-between mb-1">
        <span className="text-xs capitalize" style={{ color: 'var(--color-text-light)' }}>{label}</span>
        {showPct && <span className="text-xs font-bold" style={{ color }}>{p}%</span>}
      </div>}
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(128,128,128,0.12)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p}%`, background: color }} />
      </div>
    </div>
  );
}

function ScoreRing({ score, label }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const strokeDash = (score / 100) * 220;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(128,128,128,0.12)" strokeWidth="8"/>
          <circle cx="40" cy="40" r="35" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${strokeDash} 220`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>/100</span>
        </div>
      </div>
      <p className="text-sm font-bold mt-1" style={{ color: 'var(--color-text)' }}>{label}</p>
    </div>
  );
}

function AISummaryBox({ text, accent = 'var(--color-primary)' }) {
  return (
    <div className="rounded-xl p-4 mb-4" style={{ background: `${accent}12`, borderLeft: `3px solid ${accent}` }}>
      <div className="flex items-start gap-2">
        <Brain size={16} style={{ color: accent, marginTop: 2 }} />
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>{text}</p>
      </div>
    </div>
  );
}

function RecommendationCard({ num, title, body, onApply, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  const [applied, setApplied] = useState(false);
  if (dismissed) return null;
  return (
    <div className="rounded-xl p-4 border" style={{ borderColor: 'rgba(128,128,128,0.15)', background: 'var(--color-bg)' }}>
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'var(--color-primary)' }}>{num}</div>
        <div className="flex-1">
          <p className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{title}</p>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-light)' }}>{body}</p>
          <div className="flex gap-2 flex-wrap">
            {!applied ? (
              <button onClick={() => setApplied(true)} className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold hover:opacity-80 transition" style={{ background: 'var(--color-primary)' }}>Apply Recommendation</button>
            ) : (
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700">✓ Applied</span>
            )}
            <button onClick={() => setDismissed(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80 transition" style={{ background: 'rgba(128,128,128,0.12)', color: 'var(--color-text-light)' }}>Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ASK MASAA CHAT ───────────────────────────────────────────────────────────
function AskMASAA({ events, tasks }) {
  const [q, setQ] = useState('');
  const [history, setHistory] = useState([
    { role: 'ai', text: 'Hi! Ask me anything about your time, schedule, or productivity.' }
  ]);

  const answer = (question) => {
    const ql = question.toLowerCase();
    const today = getTodayStr();
    const { start: ws, end: we } = getWeekRange(0);
    const { start: ms, end: me } = getMonthRange(0);
    const weekEvs = eventsInRange(events, ws, we);
    const monthEvs = eventsInRange(events, ms, me);
    const todayEvs = events.filter(e => e.date === today);
    const meetings = weekEvs.filter(isMeeting);
    const done = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;

    if (ql.includes('meeting') && (ql.includes('month') || ql.includes('this month')))
      return `You have ${monthEvs.filter(isMeeting).length} meetings this month, totalling ${fmtHM(totalMins(monthEvs.filter(isMeeting)))}.`;
    if (ql.includes('meeting') && (ql.includes('week') || ql.includes('this week')))
      return `You have ${meetings.length} meetings this week, totalling ${fmtHM(totalMins(meetings))}.`;
    if (ql.includes('today'))
      return `Today you have ${todayEvs.length} event${todayEvs.length !== 1 ? 's' : ''} scheduled.${todayEvs.length > 0 ? ' Starting with: ' + todayEvs[0].title + ' at ' + todayEvs[0].startTime + '.' : ''}`;
    if (ql.includes('task') && ql.includes('complet'))
      return `You've completed ${done} task${done !== 1 ? 's' : ''}. You have ${pending} still pending.`;
    if (ql.includes('busiest') || ql.includes('busy day')) {
      const byDay = [0,0,0,0,0,0,0];
      monthEvs.forEach(e => { const d = new Date(e.date + 'T12:00'); byDay[d.getDay()]++; });
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const max = Math.max(...byDay);
      return `Your busiest day is ${days[byDay.indexOf(max)]} with an average of ${max} events.`;
    }
    if (ql.includes('free') || ql.includes('available'))
      return `Based on your current week, you have approximately ${Math.max(0, 40 - Math.floor(totalMins(weekEvs) / 60))} free hours remaining this week.`;
    if (ql.includes('productive') || ql.includes('productive'))
      return `Your task completion rate is ${pct(done, done + pending)}%. ${done > pending ? 'Great work keeping on top of things!' : 'You have more pending tasks than completed — consider reviewing your priorities.'}`;
    if (ql.includes('total hour') || ql.includes('time spent'))
      return `This month you have ${fmtHM(totalMins(monthEvs))} of scheduled time across ${monthEvs.length} events.`;
    if (ql.includes('who') && ql.includes('most'))
      return 'I can see attendees in your events. To get full meeting frequency analysis, connect your MASAA account to the backend in Phase 3.';
    if (ql.includes('next week'))
      return `Next week you currently have ${eventsInRange(events, getWeekRange(1).start, getWeekRange(1).end).length} events scheduled.`;
    return `I analyzed your ${events.length} events and ${tasks.length} tasks. Try asking: "How many meetings this week?", "What's my busiest day?", "How many tasks are pending?", or "How much free time do I have?"`;
  };

  const ask = () => {
    if (!q.trim()) return;
    const userMsg = { role: 'user', text: q };
    const aiMsg   = { role: 'ai',   text: answer(q) };
    setHistory(h => [...h, userMsg, aiMsg]);
    setQ('');
  };

  return (
    <div className="rounded-2xl shadow p-6" style={{ background: 'var(--color-card)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl" style={{ background: 'var(--color-primary)20' }}>
          <MessageSquare size={18} style={{ color: 'var(--color-primary)' }} />
        </div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Ask MASAA</h3>
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: 'var(--color-primary)' }}>AI</span>
      </div>
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
        {history.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2.5 rounded-2xl max-w-xs text-sm leading-relaxed ${m.role === 'user' ? 'text-white rounded-br-sm' : 'rounded-bl-sm'}`}
              style={{ background: m.role === 'user' ? 'var(--color-primary)' : 'var(--color-bg)', color: m.role === 'user' ? '#fff' : 'var(--color-text)', maxWidth: '80%' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()}
          placeholder='e.g. "How many meetings this week?"'
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
          style={{ background: 'var(--color-bg)', color: 'var(--color-text)', borderColor: 'rgba(128,128,128,0.25)' }} />
        <button onClick={ask} className="px-4 py-2.5 rounded-xl text-white font-semibold hover:opacity-80 transition" style={{ background: 'var(--color-primary)' }}>
          <Send size={16} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {['How many meetings this week?', "What's my busiest day?", 'How much free time?', 'Task completion rate?'].map(s => (
          <button key={s} onClick={() => { setQ(s); }} className="text-xs px-3 py-1 rounded-full hover:opacity-80 transition"
            style={{ background: `var(--color-primary)15`, color: 'var(--color-primary)' }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN REPORTS PAGE ────────────────────────────────────────────────────────
export default function ReportsPage({ events, tasks, user, theme }) {
  const [reportType, setReportType] = useState('weekly');

  const today = getTodayStr();
  const { start: ws,  end: we  } = getWeekRange(0);
  const { start: pws, end: pwe } = getWeekRange(-1);
  const { start: ms,  end: me  } = getMonthRange(0);
  const { start: pms, end: pme } = getMonthRange(-1);

  const weekEvs  = useMemo(() => eventsInRange(events, ws,  we),  [events, ws,  we]);
  const prevWeek = useMemo(() => eventsInRange(events, pws, pwe), [events, pws, pwe]);
  const monthEvs = useMemo(() => eventsInRange(events, ms,  me),  [events, ms,  me]);
  const prevMonth= useMemo(() => eventsInRange(events, pms, pme), [events, pms, pme]);
  const todayEvs = useMemo(() => events.filter(e => e.date === today), [events, today]);

  const weekMeetings  = weekEvs.filter(isMeeting);
  const monthMeetings = monthEvs.filter(isMeeting);
  const weekMins      = totalMins(weekEvs);
  const meetingMins   = totalMins(weekMeetings);
  const prevMeetMins  = totalMins(prevWeek.filter(isMeeting));
  const doneT    = tasks.filter(t => t.completed).length;
  const pendingT = tasks.filter(t => !t.completed).length;
  const overdueT = tasks.filter(t => !t.completed && t.deadline < today).length;
  const completionRate = pct(doneT, doneT + pendingT);

  // Category breakdown
  const catMins = {};
  weekEvs.forEach(e => { const c = e.category || 'other'; catMins[c] = (catMins[c] || 0) + totalMins([e]); });
  const catEntries = Object.entries(catMins).sort((a, b) => b[1] - a[1]);
  const totalCatMins = Object.values(catMins).reduce((a, b) => a + b, 0) || 1;

  // Busiest day
  const byDay = [0,0,0,0,0,0,0];
  weekEvs.forEach(e => { const d = new Date(e.date + 'T12:00'); byDay[d.getDay()]++; });
  const DAY_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const busiestDay = DAY_FULL[byDay.indexOf(Math.max(...byDay))];
  const busiestCount = Math.max(...byDay);

  // Conflicts
  const conflicts = [];
  for (let i = 0; i < weekEvs.length; i++) {
    for (let j = i + 1; j < weekEvs.length; j++) {
      const a = weekEvs[i], b = weekEvs[j];
      if (a.date === b.date && a.startTime < b.endTime && b.startTime < a.endTime) {
        conflicts.push({ a, b });
      }
    }
  }

  // Schedule health score
  const healthBase = 60 + (completionRate > 70 ? 10 : completionRate > 50 ? 5 : 0) + (overdueT === 0 ? 10 : overdueT < 3 ? 5 : 0) + (conflicts.length === 0 ? 10 : conflicts.length < 2 ? 5 : 0) + (meetingMins / (weekMins || 1) < 0.5 ? 10 : 5);
  const healthScore = Math.min(100, Math.max(0, Math.round(healthBase)));

  const REPORT_TABS = [
    { id: 'daily',       label: 'Daily'       },
    { id: 'weekly',      label: 'Weekly'      },
    { id: 'monthly',     label: 'Monthly'     },
    { id: 'productivity',label: 'Productivity'},
    { id: 'meetings',    label: 'Meetings'    },
    { id: 'health',      label: 'Schedule Health' },
    { id: 'conflicts',   label: 'Conflicts'   },
    { id: 'time',        label: 'Time Dist.'  },
    { id: 'personal',    label: 'Personal'    },
    { id: 'ask',         label: 'Ask MASAA' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="rounded-2xl p-8 text-white" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Brain size={24} /></div>
          <div>
            <h1 className="text-2xl font-bold">MASAA Reports</h1>
            <p className="text-white/70 text-sm">What happened · Why · What it means · What to do</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { label: 'Scheduled hrs', value: fmtHM(weekMins) },
            { label: 'Task completion', value: `${completionRate}%` },
            { label: 'Meetings', value: `${weekMeetings.length}` },
            { label: 'Schedule Health', value: `${healthScore}/100` },
          ].map((s, i) => (
            <div key={i} className="bg-white/15 rounded-xl p-3">
              <p className="text-white/70 text-xs">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap">
        {REPORT_TABS.map(t => (
          <button key={t.id} onClick={() => setReportType(t.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition"
            style={{ background: reportType === t.id ? 'var(--color-primary)' : 'var(--color-card)', color: reportType === t.id ? '#fff' : 'var(--color-text-light)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DAILY ── */}
      {reportType === 'daily' && (
        <div className="space-y-5">
          <Section title="Your Day" icon={<Calendar size={18} style={{ color: '#3b82f6' }}/>} accent="#3b82f6">
            <AISummaryBox accent="var(--color-primary)"
              text={`You have ${todayEvs.length} event${todayEvs.length !== 1 ? 's' : ''} scheduled today. ${doneT > 0 ? `You've completed ${doneT} task${doneT !== 1 ? 's' : ''} overall.` : 'No tasks completed yet today.'} ${overdueT > 0 ? `⚠️ ${overdueT} task${overdueT !== 1 ? 's are' : ' is'} overdue.` : 'You are on top of your tasks.'}`} />
            <MetricRow label="Events today"        value={todayEvs.length}       icon={<Calendar size={14}/>} />
            <MetricRow label="Total scheduled time" value={fmtHM(totalMins(todayEvs))} icon={<Clock size={14}/>} />
            <MetricRow label="Tasks completed"     value={doneT}                 icon={<CheckCircle2 size={14}/>} color="#10b981" />
            <MetricRow label="Tasks pending"       value={pendingT}              icon={<Activity size={14}/>} />
            <MetricRow label="Tasks overdue"       value={overdueT}              icon={<AlertTriangle size={14}/>} color={overdueT > 0 ? '#ef4444' : undefined} />
            {todayEvs.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--color-text-light)' }}>Today's Schedule</p>
                {todayEvs.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(ev => (
                  <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: ev.color || 'var(--color-primary)' }}/>
                    <span className="text-xs font-mono" style={{ color: 'var(--color-text-light)' }}>{ev.startTime}–{ev.endTime}</span>
                    <span className="text-sm font-semibold flex-1" style={{ color: 'var(--color-text)' }}>{ev.title}</span>
                    {ev.attendees?.length > 0 && <span className="text-xs" style={{ color: 'var(--color-text-light)' }}><Users size={11} className="inline mr-1"/>{ev.attendees.length}</span>}
                  </div>
                ))}
              </div>
            )}
          </Section>
          <RecommendationsSection events={todayEvs} tasks={tasks} scope="day" theme={theme} />
          <AskMASAA events={events} tasks={tasks} />
        </div>
      )}

      {/* ── WEEKLY ── */}
      {reportType === 'weekly' && (
        <div className="space-y-5">
          <Section title="Your Week" icon={<TrendingUp size={18} style={{ color: 'var(--color-primary)' }}/>} accent="var(--color-primary)">
            <AISummaryBox accent="var(--color-primary)"
              text={generateWeeklySummary(weekEvs, weekMeetings, weekMins, meetingMins, completionRate, busiestDay, prevWeek)} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {[
                { label:'Total events',    value:weekEvs.length,        prev:prevWeek.length },
                { label:'Meetings',        value:weekMeetings.length,   prev:prevWeek.filter(isMeeting).length },
                { label:'Meeting time',    value:fmtHM(meetingMins),    sub:`vs ${fmtHM(prevMeetMins)} last week` },
                { label:'Task completion', value:`${completionRate}%`,  sub:`${doneT} done, ${pendingT} pending` },
                { label:'Overdue tasks',   value:overdueT,              sub:overdueT>0?'Needs attention':'All good!' },
                { label:'Busiest day',     value:busiestDay,            sub:`${busiestCount} events` },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: 'var(--color-bg)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-light)' }}>{s.label}</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{s.value}</p>
                  {s.prev !== undefined && <DeltaBadge d={delta(typeof s.value === 'number' ? s.value : 0, s.prev)} />}
                  {s.sub && !s.prev && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-light)' }}>{s.sub}</p>}
                </div>
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-light)' }}>Events by Day</p>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => (
              <ProgressBar key={d} label={`${d} (${byDay[i]})`} value={byDay[i]} max={Math.max(...byDay, 1)} color="var(--color-primary)" showPct={false} />
            ))}
          </Section>
          <WellAttentionSection weekEvs={weekEvs} overdueT={overdueT} conflicts={conflicts} meetingMins={meetingMins} weekMins={weekMins} completionRate={completionRate} />
          <RecommendationsSection events={weekEvs} tasks={tasks} scope="week" theme={theme} />
          <AskMASAA events={events} tasks={tasks} />
        </div>
      )}

      {/* ── MONTHLY ── */}
      {reportType === 'monthly' && (
        <div className="space-y-5">
          <Section title={`Monthly Report — ${new Date(ms).toLocaleDateString('en-US',{month:'long',year:'numeric'})}`} icon={<Calendar size={18} style={{ color:'#8b5cf6' }}/>} accent="#8b5cf6">
            <AISummaryBox accent="#8b5cf6"
              text={`You scheduled ${monthEvs.length} events this month totalling ${fmtHM(totalMins(monthEvs))}. You attended ${monthMeetings.length} meetings. Your task completion rate stands at ${completionRate}%. ${delta(monthEvs.length, prevMonth.length) > 0 ? `This month is ${delta(monthEvs.length, prevMonth.length)}% busier than last month.` : delta(monthEvs.length, prevMonth.length) < 0 ? `This month is ${Math.abs(delta(monthEvs.length, prevMonth.length))}% lighter than last month.` : 'Similar activity to last month.'}`} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l:'Total events',   v:monthEvs.length,               prev:prevMonth.length },
                { l:'Meetings',       v:monthMeetings.length,           prev:prevMonth.filter(isMeeting).length },
                { l:'Scheduled hrs',  v:fmtHM(totalMins(monthEvs)),    prev:null },
                { l:'Meeting hrs',    v:fmtHM(totalMins(monthMeetings)),prev:null },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: 'var(--color-bg)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-light)' }}>{s.l}</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{s.v}</p>
                  {s.prev !== null && <DeltaBadge d={delta(typeof s.v === 'number' ? s.v : 0, s.prev)} />}
                </div>
              ))}
            </div>
          </Section>
          <RecommendationsSection events={monthEvs} tasks={tasks} scope="month" theme={theme} />
          <AskMASAA events={events} tasks={tasks} />
        </div>
      )}

      {/* ── PRODUCTIVITY ── */}
      {reportType === 'productivity' && (
        <div className="space-y-5">
          <Section title="Productivity Report" icon={<Target size={18} style={{ color:'#10b981' }}/>} accent="#10b981">
            <AISummaryBox accent="#10b981"
              text={`Your overall task completion rate is ${completionRate}%. ${overdueT > 0 ? `You have ${overdueT} overdue task${overdueT !== 1 ? 's' : ''} that need attention.` : 'No overdue tasks — great discipline!'} ${completionRate > 75 ? 'Excellent productivity this period.' : completionRate > 50 ? 'Good progress, but there is room to improve.' : 'Consider reviewing your task load and priorities.'}`} />
            <div className="mb-4">
              <ProgressBar label={`Completed (${doneT})`} value={doneT} max={doneT+pendingT} color="#10b981" />
              <ProgressBar label={`Pending (${pendingT})`} value={pendingT} max={doneT+pendingT} color="#f59e0b" />
              <ProgressBar label={`Overdue (${overdueT})`} value={overdueT} max={doneT+pendingT} color="#ef4444" />
            </div>
            <MetricRow label="Focus hours (est.)" value={fmtHM(Math.max(0, weekMins - meetingMins))} icon={<Zap size={14}/>} color="#f59e0b" />
            <MetricRow label="Meeting to focus ratio" value={`${pct(meetingMins, weekMins)}% meetings`} icon={<BarChart2 size={14}/>} />
            <MetricRow label="High priority tasks done" value={tasks.filter(t=>t.completed&&t.priority==='high').length} icon={<Star size={14}/>} color="#ef4444" />
            <MetricRow label="High priority still pending" value={tasks.filter(t=>!t.completed&&t.priority==='high').length} icon={<AlertTriangle size={14}/>} color={tasks.filter(t=>!t.completed&&t.priority==='high').length>0?'#ef4444':undefined} />
          </Section>
          <RecommendationsSection events={weekEvs} tasks={tasks} scope="productivity" theme={theme} />
          <AskMASAA events={events} tasks={tasks} />
        </div>
      )}

      {/* ── MEETINGS ── */}
      {reportType === 'meetings' && (
        <div className="space-y-5">
          <Section title="Meeting Intelligence" icon={<Users size={18} style={{ color:'#8b5cf6' }}/>} accent="#8b5cf6">
            <AISummaryBox accent="#8b5cf6"
              text={generateMeetingSummary(weekMeetings, prevWeek.filter(isMeeting), meetingMins, weekMins)} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {[
                { l:'Meetings this week', v:weekMeetings.length, prev:prevWeek.filter(isMeeting).length },
                { l:'Total meeting time', v:fmtHM(meetingMins) },
                { l:'Average length',    v:weekMeetings.length>0?fmtHM(Math.round(meetingMins/weekMeetings.length)):'—' },
                { l:'% of scheduled time',v:`${pct(meetingMins,weekMins||1)}%` },
                { l:'With attendees',    v:weekEvs.filter(e=>(e.attendees||[]).length>0).length },
                { l:'Busiest meeting day',v:busiestDay },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: 'var(--color-bg)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-light)' }}>{s.l}</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{s.v}</p>
                  {s.prev !== undefined && <DeltaBadge d={delta(typeof s.v === 'number' ? s.v : 0, s.prev)} />}
                </div>
              ))}
            </div>
            {weekMeetings.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-light)' }}>This Week's Meetings</p>
                <div className="space-y-2">
                  {weekMeetings.map(ev => (
                    <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: ev.color || '#8b5cf6' }}/>
                      <div className="flex-1"><p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{ev.title}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>{ev.date} · {ev.startTime}–{ev.endTime} · {fmtHM(totalMins([ev]))}</p></div>
                      {(ev.attendees||[]).length > 0 && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#8b5cf620', color: '#8b5cf6' }}><Users size={10} className="inline mr-1"/>{ev.attendees.length}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>
          <AskMASAA events={events} tasks={tasks} />
        </div>
      )}

      {/* ── SCHEDULE HEALTH ── */}
      {reportType === 'health' && (
        <div className="space-y-5">
          <Section title="Schedule Health Score" icon={<Shield size={18} style={{ color:'#10b981' }}/>} accent="#10b981">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
              <ScoreRing score={healthScore} label="Schedule Health" />
              <div className="flex-1">
                <AISummaryBox accent="#10b981" text={generateHealthSummary(healthScore, overdueT, conflicts, completionRate, meetingMins, weekMins)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: '#10b98112' }}>
                <p className="text-xs font-bold mb-2 text-green-700">✓ What Went Well</p>
                {generateStrengths(overdueT, conflicts, completionRate, meetingMins, weekMins).map((s, i) => (
                  <p key={i} className="text-sm text-green-800 mb-1">• {s}</p>
                ))}
              </div>
              <div className="rounded-xl p-4" style={{ background: '#ef444412' }}>
                <p className="text-xs font-bold mb-2 text-red-700">⚠ Needs Attention</p>
                {generateConcerns(overdueT, conflicts, completionRate, meetingMins, weekMins).map((c, i) => (
                  <p key={i} className="text-sm text-red-800 mb-1">• {c}</p>
                ))}
              </div>
            </div>
          </Section>
          <RecommendationsSection events={weekEvs} tasks={tasks} scope="health" theme={theme} />
          <AskMASAA events={events} tasks={tasks} />
        </div>
      )}

      {/* ── CONFLICTS ── */}
      {reportType === 'conflicts' && (
        <div className="space-y-5">
          <Section title="Calendar Conflict Report" icon={<AlertTriangle size={18} style={{ color:'#ef4444' }}/>} accent="#ef4444">
            {conflicts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="mx-auto mb-3" style={{ color: '#10b981' }}/>
                <p className="font-bold" style={{ color: '#10b981' }}>No conflicts detected!</p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Your schedule is clean this week.</p>
              </div>
            ) : (
              <>
                <AISummaryBox accent="#ef4444" text={`${conflicts.length} scheduling conflict${conflicts.length !== 1 ? 's' : ''} detected this week. These overlapping events may cause issues. Review and resolve them to avoid missed commitments.`} />
                <div className="space-y-4">
                  {conflicts.map((c, i) => (
                    <div key={i} className="rounded-xl p-4 border" style={{ borderColor: '#ef444430', background: '#ef444408' }}>
                      <p className="text-xs font-bold mb-3 text-red-600">Conflict {i + 1}</p>
                      {[c.a, c.b].map(ev => (
                        <div key={ev.id} className="flex items-center gap-3 mb-2 p-2 rounded-lg bg-white/50">
                          <div className="w-2 h-2 rounded-full" style={{ background: ev.color || '#ef4444' }}/>
                          <div><p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{ev.title}</p>
                            <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>{ev.date} · {ev.startTime}–{ev.endTime}</p></div>
                        </div>
                      ))}
                      <p className="text-xs mt-2 font-semibold" style={{ color: '#ef4444' }}>
                        💡 Recommendation: Consider moving "{c.b.title}" to a free slot later in the day.
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Section>
          <AskMASAA events={events} tasks={tasks} />
        </div>
      )}

      {/* ── TIME DISTRIBUTION ── */}
      {reportType === 'time' && (
        <div className="space-y-5">
          <Section title="Time Distribution" icon={<BarChart2 size={18} style={{ color:'#f59e0b' }}/>} accent="#f59e0b">
            <AISummaryBox accent="#f59e0b" text={generateTimeSummary(catEntries, totalCatMins, weekMins)} />
            {catEntries.length > 0 ? (
              <div className="space-y-3">
                {catEntries.map(([cat, mins]) => (
                  <div key={cat}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize font-semibold" style={{ color: 'var(--color-text)' }}>{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>{fmtHM(mins)}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: CATEGORY_COLORS[cat] || '#94a3b8' }}>{pct(mins, totalCatMins)}%</span>
                      </div>
                    </div>
                    <ProgressBar value={mins} max={totalCatMins} color={CATEGORY_COLORS[cat] || '#94a3b8'} showPct={false} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{ color: 'var(--color-text-light)' }}>No events this week to analyze.</p>
            )}
          </Section>
          <AskMASAA events={events} tasks={tasks} />
        </div>
      )}

      {/* ── PERSONAL ── */}
      {reportType === 'personal' && (
        <div className="space-y-5">
          <Section title="Personal Time Report" icon={<Star size={18} style={{ color:'#ec4899' }}/>} accent="#ec4899">
            <AISummaryBox accent="#ec4899"
              text={generatePersonalSummary(weekEvs, totalCatMins)} />
            {['personal','family','church','health','other'].map(cat => {
              const m = catMins[cat] || 0;
              return m > 0 ? (
                <MetricRow key={cat} label={cat.charAt(0).toUpperCase()+cat.slice(1)} value={fmtHM(m)} color={CATEGORY_COLORS[cat]} sub={`${pct(m, totalCatMins)}% of your week`} />
              ) : null;
            })}
            {!['personal','family','church','health'].some(c => catMins[c] > 0) && (
              <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-light)' }}>No personal events this week. Consider scheduling some time for yourself.</p>
            )}
          </Section>
          <RecommendationsSection events={weekEvs} tasks={tasks} scope="personal" theme={theme} />
          <AskMASAA events={events} tasks={tasks} />
        </div>
      )}

      {/* ── ASK AI ── */}
      {reportType === 'ask' && (
        <div className="space-y-5">
          <AskMASAA events={events} tasks={tasks} />
        </div>
      )}
    </div>
  );
}

// ─── WELL / ATTENTION SECTION ─────────────────────────────────────────────────
function WellAttentionSection({ weekEvs, overdueT, conflicts, meetingMins, weekMins, completionRate }) {
  const strengths  = generateStrengths(overdueT, conflicts, completionRate, meetingMins, weekMins);
  const concerns   = generateConcerns(overdueT, conflicts, completionRate, meetingMins, weekMins);
  const insights   = generateInsights(weekEvs, meetingMins, weekMins, completionRate);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-2xl shadow p-5" style={{ background: 'var(--color-card)', borderTop: '3px solid #10b981' }}>
        <p className="text-xs font-bold uppercase tracking-wide mb-3 text-green-600">✓ What Went Well</p>
        {strengths.map((s, i) => <p key={i} className="text-sm mb-1.5" style={{ color: 'var(--color-text)' }}>• {s}</p>)}
      </div>
      <div className="rounded-2xl shadow p-5" style={{ background: 'var(--color-card)', borderTop: '3px solid #ef4444' }}>
        <p className="text-xs font-bold uppercase tracking-wide mb-3 text-red-600">⚠ Needs Attention</p>
        {concerns.length > 0 ? concerns.map((c, i) => <p key={i} className="text-sm mb-1.5" style={{ color: 'var(--color-text)' }}>• {c}</p>) : <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>Nothing critical this week.</p>}
      </div>
      <div className="rounded-2xl shadow p-5" style={{ background: 'var(--color-card)', borderTop: '3px solid #f59e0b' }}>
        <p className="text-xs font-bold uppercase tracking-wide mb-3 text-yellow-600">💡 Insights</p>
        {insights.map((s, i) => <p key={i} className="text-sm mb-1.5" style={{ color: 'var(--color-text)' }}>• {s}</p>)}
      </div>
    </div>
  );
}

// ─── RECOMMENDATIONS SECTION ──────────────────────────────────────────────────
function RecommendationsSection({ events, tasks, scope, theme }) {
  const recs = generateRecommendations(events, tasks, scope);
  if (recs.length === 0) return null;
  return (
    <div className="rounded-2xl shadow p-6" style={{ background: 'var(--color-card)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl" style={{ background: 'var(--color-primary)20' }}><Lightbulb size={18} style={{ color: 'var(--color-primary)' }}/></div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>MASAA Recommendations</h3>
      </div>
      <div className="space-y-3">
        {recs.map((r, i) => <RecommendationCard key={i} num={i + 1} title={r.title} body={r.body} />)}
      </div>
    </div>
  );
}

// ─── AI TEXT GENERATORS ───────────────────────────────────────────────────────
function generateWeeklySummary(weekEvs, meetings, weekMins, meetMins, completionRate, busiestDay, prevWeek) {
  const meetPct = weekMins > 0 ? Math.round((meetMins / weekMins) * 100) : 0;
  const d = delta(weekEvs.length, prevWeek.length);
  const tone = completionRate > 75 ? 'productive' : completionRate > 50 ? 'moderately productive' : 'challenging';
  return `Your week was ${tone}. You scheduled ${weekEvs.length} event${weekEvs.length !== 1 ? 's' : ''} totalling ${fmtHM(weekMins)}, of which ${meetPct}% was in meetings. ${busiestDay} was your busiest day. ${d > 10 ? `This week was ${d}% busier than last week.` : d < -10 ? `This week was ${Math.abs(d)}% lighter than last week.` : 'Your activity was similar to last week.'} Task completion: ${completionRate}%.`;
}

function generateMeetingSummary(meetings, prevMeetings, meetMins, weekMins) {
  const d = delta(meetings.length, prevMeetings.length);
  const meetPct = weekMins > 0 ? Math.round((meetMins / weekMins) * 100) : 0;
  return `You had ${meetings.length} meeting${meetings.length !== 1 ? 's' : ''} this week, totalling ${fmtHM(meetMins)} — that's ${meetPct}% of your scheduled time. ${d > 20 ? `Your meetings increased by ${d}% compared with last week.` : d < -20 ? `Meeting load decreased by ${Math.abs(d)}% from last week.` : 'Meeting frequency is consistent with last week.'} ${meetPct > 50 ? 'Consider protecting more focus time — over half your week is in meetings.' : 'Good balance between meetings and focused work.'}`;
}

function generateHealthSummary(score, overdueT, conflicts, completionRate, meetMins, weekMins) {
  const grade = score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs improvement';
  return `Your schedule health is ${grade} at ${score}/100. ${conflicts.length > 0 ? `You have ${conflicts.length} scheduling conflict${conflicts.length !== 1 ? 's' : ''} to resolve.` : 'No conflicts detected.'} ${overdueT > 0 ? `${overdueT} overdue task${overdueT !== 1 ? 's' : ''} need${overdueT === 1 ? 's' : ''} attention.` : 'All tasks are on track.'} ${score >= 80 ? 'Keep up the excellent time management.' : 'Follow the recommendations below to improve your score.'}`;
}

function generateTimeSummary(catEntries, totalCatMins, weekMins) {
  if (catEntries.length === 0) return 'No scheduled events this week to analyze.';
  const top = catEntries[0];
  return `Your time this week was spread across ${catEntries.length} categories. The largest was ${top[0]} at ${fmtHM(top[1])} (${pct(top[1], totalCatMins)}%). ${catEntries.length > 2 ? `You also had time in ${catEntries.slice(1, 3).map(c => c[0]).join(' and ')}.` : ''} Total scheduled time: ${fmtHM(weekMins)}.`;
}

function generatePersonalSummary(weekEvs, totalCatMins) {
  const personalMins = weekEvs.filter(e => ['personal','family','church','health'].includes(e.category)).reduce((a, e) => a + totalMins([e]), 0);
  const pPct = pct(personalMins, totalCatMins || 1);
  return `Personal and wellbeing activities account for ${fmtHM(personalMins)} (${pPct}%) of your scheduled week. ${pPct < 15 ? 'You may be underinvesting in personal time. Consider scheduling activities for rest, family, or personal growth.' : pPct > 50 ? 'You have a strong personal life balance this week.' : 'Your personal time balance looks reasonable.'}`;
}

function generateStrengths(overdueT, conflicts, completionRate, meetMins, weekMins) {
  const s = [];
  if (completionRate >= 70) s.push(`Strong task completion rate (${completionRate}%)`);
  if (overdueT === 0) s.push('No overdue tasks');
  if (conflicts.length === 0) s.push('No scheduling conflicts');
  if (weekMins > 0 && meetMins / weekMins < 0.4) s.push('Good meeting-to-focus balance');
  if (s.length === 0) s.push('You are tracking your time — that is the first step.');
  return s;
}

function generateConcerns(overdueT, conflicts, completionRate, meetMins, weekMins) {
  const c = [];
  if (overdueT > 0) c.push(`${overdueT} overdue task${overdueT !== 1 ? 's' : ''} need attention`);
  if (conflicts.length > 0) c.push(`${conflicts.length} scheduling conflict${conflicts.length !== 1 ? 's' : ''} detected`);
  if (completionRate < 50) c.push('Task completion rate below 50%');
  if (weekMins > 0 && meetMins / weekMins > 0.6) c.push('Over 60% of scheduled time is in meetings');
  return c;
}

function generateInsights(weekEvs, meetMins, weekMins, completionRate) {
  const s = [];
  if (weekEvs.length > 0) {
    const byHour = {};
    weekEvs.forEach(e => { const h = e.startTime?.split(':')[0]; if (h) byHour[h] = (byHour[h] || 0) + 1; });
    const peakHour = Object.entries(byHour).sort((a,b)=>b[1]-a[1])[0];
    if (peakHour) s.push(`Your peak scheduling hour is ${peakHour[0]}:00 with ${peakHour[1]} event${peakHour[1] !== 1 ? 's' : ''}`);
  }
  if (weekMins > 0) s.push(`${pct(meetMins, weekMins)}% of your time is in meetings`);
  s.push(`Estimated focus time: ${fmtHM(Math.max(0, weekMins - meetMins))}`);
  return s;
}

function generateRecommendations(events, tasks, scope) {
  const recs = [];
  const overdueT = tasks.filter(t => !t.completed && t.deadline < getTodayStr()).length;
  const highPending = tasks.filter(t => !t.completed && t.priority === 'high').length;
  const today = getTodayStr();
  const { start: ws, end: we } = getWeekRange(0);
  const weekEvs = eventsInRange(events, ws, we);
  const meetMins = totalMins(weekEvs.filter(isMeeting));
  const weekMins = totalMins(weekEvs);

  if (overdueT > 0) recs.push({ title: `Clear ${overdueT} overdue task${overdueT !== 1 ? 's' : ''}`, body: 'Schedule 30–60 minutes today to work through your overdue items. Clearing them reduces cognitive load and improves your schedule health score.' });
  if (highPending > 0) recs.push({ title: 'Prioritise high-priority tasks', body: `You have ${highPending} high-priority task${highPending !== 1 ? 's' : ''} pending. Block time in your next available morning slot to make progress.` });
  if (weekMins > 0 && meetMins / weekMins > 0.5) recs.push({ title: 'Protect focus time', body: `Over ${pct(meetMins, weekMins)}% of your week is meetings. Reserve at least one 90-minute block each day for deep, uninterrupted work.` });
  if (scope === 'personal') recs.push({ title: 'Schedule personal time', body: 'Block at least 2 hours this week for personal activities — rest, exercise, family, or hobbies. Personal time improves long-term productivity.' });
  if (scope === 'health') recs.push({ title: 'Review Thursday load', body: 'Consider moving one meeting to a lighter day to create breathing room and reduce back-to-back scheduling.' });
  recs.push({ title: 'Create a weekly review', body: 'Set aside 20 minutes every Friday to review your week, update tasks, and plan the next week. This alone can improve productivity by 15–20%.' });
  return recs.slice(0, 4);
}
