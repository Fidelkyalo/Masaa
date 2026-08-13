import React, { useState } from 'react';
import { Brain, Zap, Clock, Calendar, CheckCircle2, AlertTriangle, X, Plus, Lightbulb } from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────────────────────
function fmtHM(mins) { const h=Math.floor(mins/60),m=mins%60; return h>0?(m>0?`${h}h ${m}m`:`${h}h`):`${m}m`; }
function totalMins(evs) { return evs.reduce((acc,e)=>{ if(!e.startTime||!e.endTime) return acc; const [sh,sm]=e.startTime.split(':').map(Number),[eh,em]=e.endTime.split(':').map(Number); return acc+Math.max(0,(eh*60+em)-(sh*60+sm)); },0); }
function eventsOnDay(events,ds) { return events.filter(e=>e.date===ds); }
function isBusy(events, ds, startH, endH) {
  return eventsOnDay(events,ds).some(e=>{
    const [sh]=e.startTime.split(':').map(Number), [eh]=e.endTime.split(':').map(Number);
    return !(endH<=sh || startH>=eh);
  });
}

// Find free slots in next N days
function findFreeSlots(events, durationMins=60, daysAhead=7) {
  const slots = [];
  for (let i=0; i<daysAhead; i++) {
    const d = new Date(); d.setDate(d.getDate()+i);
    const ds = d.toISOString().split('T')[0];
    for (let h=8; h<18; h++) {
      const endH = h + Math.ceil(durationMins/60);
      if (!isBusy(events, ds, h, endH)) {
        slots.push({ date:ds, startTime:`${String(h).padStart(2,'0')}:00`, endTime:`${String(endH).padStart(2,'0')}:00`, day:d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}) });
      }
    }
  }
  return slots.slice(0,9);
}

// Detect back-to-back meetings (< 10 min gap)
function detectBackToBack(events) {
  const today = new Date().toISOString().split('T')[0];
  const week = new Date(); week.setDate(week.getDate()+7);
  const upcoming = events.filter(e=>e.date>=today && e.date<=week.toISOString().split('T')[0])
    .sort((a,b)=>new Date(`${a.date}T${a.startTime}`)-new Date(`${b.date}T${b.startTime}`));
  const pairs = [];
  for (let i=0;i<upcoming.length-1;i++) {
    const a=upcoming[i], b=upcoming[i+1];
    if (a.date===b.date) {
      const [aeh,aem]=a.endTime.split(':').map(Number);
      const [bsh,bsm]=b.startTime.split(':').map(Number);
      const gap = (bsh*60+bsm)-(aeh*60+aem);
      if (gap>=0 && gap<15) pairs.push({ a, b, gap });
    }
  }
  return pairs;
}

// Smart priority suggestion based on deadline
export function suggestPriority(deadline) {
  if (!deadline) return 'medium';
  const days = Math.ceil((new Date(deadline)-new Date())/86400000);
  if (days<=1) return 'high';
  if (days<=4) return 'medium';
  return 'low';
}

// Enhanced NL parser
export function parseNaturalEventEnhanced(text, contacts=[]) {
  const now = new Date();
  let date = now.toISOString().split('T')[0];
  let startTime = '09:00';
  let endTime = '10:00';
  let title = text;
  let attendees = [];
  const lower = text.toLowerCase();

  // Date parsing
  if (/\bin (\d+) days?\b/i.test(text)) {
    const m=text.match(/in (\d+) days?/i);
    const d=new Date(now); d.setDate(d.getDate()+parseInt(m[1]));
    date=d.toISOString().split('T')[0]; title=title.replace(m[0],'').trim();
  } else if (/\bnext (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(lower)) {
    const m=lower.match(/next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
    const days={monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6,sunday:0};
    const target=days[m[1]]; const d=new Date(now); const cur=d.getDay();
    let diff=target-cur; if(diff<=0) diff+=7;
    d.setDate(d.getDate()+diff+7); date=d.toISOString().split('T')[0];
    title=title.replace(/next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,'').trim();
  } else if (lower.includes('tomorrow')) { const d=new Date(now); d.setDate(d.getDate()+1); date=d.toISOString().split('T')[0]; title=title.replace(/tomorrow/i,'').trim(); }
  else if (lower.includes('today'))    { date=now.toISOString().split('T')[0]; title=title.replace(/today/i,'').trim(); }
  else { const days2={monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6,sunday:0};
    for(const [name,num] of Object.entries(days2)) {
      if(lower.includes(name)) { const d=new Date(now); const cur=d.getDay(); let diff=num-cur; if(diff<=0) diff+=7; d.setDate(d.getDate()+diff); date=d.toISOString().split('T')[0]; title=title.replace(new RegExp(name,'i'),'').trim(); break; }
    }
  }

  // Time parsing
  const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (timeMatch) {
    let h=parseInt(timeMatch[1]), m=parseInt(timeMatch[2]||'0');
    const ap=(timeMatch[3]||'').toLowerCase();
    if(ap==='pm'&&h<12) h+=12; if(ap==='am'&&h===12) h=0;
    startTime=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    title=title.replace(timeMatch[0],'').trim();
  }

  // Duration parsing "for X hour(s)/min(s)"
  const durMatch = text.match(/for (\d+(?:\.\d+)?)\s*(hour|hr|h|minute|min|m)s?/i);
  if (durMatch) {
    const val=parseFloat(durMatch[1]);
    const unit=durMatch[2].toLowerCase();
    const mins = unit.startsWith('h') ? Math.round(val*60) : Math.round(val);
    const [sh,sm]=startTime.split(':').map(Number);
    const endTotal = sh*60+sm+mins;
    endTime=`${String(Math.floor(endTotal/60)).padStart(2,'0')}:${String(endTotal%60).padStart(2,'0')}`;
    title=title.replace(durMatch[0],'').trim();
  } else {
    const endH=Math.min(parseInt(startTime.split(':')[0])+1,23);
    endTime=`${String(endH).padStart(2,'0')}:${startTime.split(':')[1]}`;
  }

  // Contact extraction "with John" / "with Sarah"
  const withMatch = text.match(/\bwith\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/);
  if (withMatch && contacts.length>0) {
    const name=withMatch[1].toLowerCase();
    const matched=contacts.filter(c=>c.name.toLowerCase().includes(name));
    attendees=matched.map(c=>({ email:c.email, status:'pending', name:c.name }));
    title=title.replace(withMatch[0],'').trim();
  }

  title=title.replace(/\bat\b/i,'').replace(/\s+/g,' ').trim();
  if (!title) title='New Event';

  return { title, date, startTime, endTime, color:'#3b82f6', calendarId:'personal', recurring:'none', reminders:[], attendees, category:'personal', description:'', meetingType:'physical', location:'', onlineLink:'' };
}

// ── AI ASSISTANT PANEL ────────────────────────────────────────────────────────
export default function AIAssistant({ events, tasks, contacts, theme, onCreateEvent, onClose }) {
  const [activeTab, setActiveTab] = useState('slots');
  const [duration, setDuration]   = useState(60);
  const [slotEvs, setSlotEvs]     = useState(() => findFreeSlots(events, 60));

  const backToBack    = detectBackToBack(events);
  const overdueTasks  = tasks.filter(t=>!t.completed && t.deadline < new Date().toISOString().split('T')[0]);
  const highPending   = tasks.filter(t=>!t.completed && t.priority==='high');

  const refreshSlots = (dur) => {
    setDuration(dur);
    setSlotEvs(findFreeSlots(events, dur));
  };

  const tabs = [
    { id:'slots',    label:'Free Slots'  },
    { id:'insights', label:'Insights'    },
    { id:'tasks',    label:'Smart Tasks' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div className="rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" style={{ background:'var(--color-card)', maxHeight:'85vh' }} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 text-white flex items-center justify-between" style={{ background:`linear-gradient(135deg,${theme.primary},${theme.secondary})` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Brain size={22}/></div>
            <div><h2 className="font-bold text-lg">AI Scheduling Assistant</h2><p className="text-white/70 text-xs">Powered by your calendar data</p></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition"><X size={20}/></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              className="flex-1 py-3 text-sm font-semibold transition"
              style={{ color:activeTab===t.id?'var(--color-primary)':'var(--color-text-light)', borderBottom:activeTab===t.id?`2px solid var(--color-primary)`:'2px solid transparent' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto p-5 space-y-4" style={{ maxHeight:'calc(85vh - 160px)' }}>

          {/* ── FREE SLOTS ── */}
          {activeTab==='slots' && (
            <>
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold flex-shrink-0" style={{ color:'var(--color-text)' }}>Meeting duration:</label>
                <div className="flex gap-2">
                  {[30,45,60,90,120].map(d=>(
                    <button key={d} onClick={()=>refreshSlots(d)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                      style={{ background:duration===d?'var(--color-primary)':'rgba(128,128,128,0.12)', color:duration===d?'#fff':'var(--color-text-light)' }}>
                      {d<60?`${d}m`:`${d/60}h`}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs" style={{ color:'var(--color-text-light)' }}>Available {duration}-minute slots in the next 7 days:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {slotEvs.length===0 ? (
                  <div className="col-span-3 text-center py-6" style={{ color:'var(--color-text-light)' }}>No free {duration}-minute slots found in the next 7 days.</div>
                ) : slotEvs.map((s,i)=>(
                  <div key={i} className="rounded-xl p-3 border" style={{ background:'var(--color-bg)', borderColor:'rgba(128,128,128,0.15)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color:'var(--color-text)' }}>{s.day}</p>
                    <p className="font-bold" style={{ color:'var(--color-primary)' }}>{s.startTime} – {s.endTime}</p>
                    <button onClick={()=>{ onCreateEvent({ title:'New Meeting', date:s.date, startTime:s.startTime, endTime:s.endTime, color:'var(--color-primary)'.replace('var(--color-primary)','#3b82f6'), calendarId:'work', recurring:'none', reminders:['15'], attendees:[], category:'work', description:'', meetingType:'physical', location:'', onlineLink:'' }); onClose(); }}
                      className="mt-2 w-full py-1 rounded-lg text-xs font-semibold text-white hover:opacity-80 transition" style={{ background:'var(--color-primary)' }}>
                      <Plus size={12} className="inline mr-1"/>Schedule
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── INSIGHTS ── */}
          {activeTab==='insights' && (
            <>
              {backToBack.length > 0 && (
                <div className="rounded-xl p-4" style={{ background:'#f59e0b15', borderLeft:'3px solid #f59e0b' }}>
                  <p className="font-bold text-sm mb-2" style={{ color:'#b45309' }}>⚠ Back-to-back meetings detected</p>
                  {backToBack.map((p,i)=>(
                    <div key={i} className="text-xs mb-1" style={{ color:'var(--color-text)' }}>
                      "{p.a.title}" → "{p.b.title}" on {p.a.date} — only {p.gap} min gap
                    </div>
                  ))}
                  <p className="text-xs mt-2" style={{ color:'#b45309' }}>💡 Consider adding at least 15 minutes between these meetings.</p>
                </div>
              )}

              <div className="rounded-xl p-4" style={{ background:'var(--color-bg)' }}>
                <p className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color:'var(--color-text)' }}><Lightbulb size={16} style={{ color:'var(--color-primary)' }}/>Schedule Insights</p>
                {[
                  overdueTasks.length > 0 && `You have ${overdueTasks.length} overdue task${overdueTasks.length!==1?'s':''} — block 1 hour today to clear them.`,
                  highPending.length > 0 && `${highPending.length} high-priority task${highPending.length!==1?'s':''} need attention. Schedule them before Friday.`,
                  backToBack.length === 0 && overdueTasks.length === 0 && 'Your schedule looks healthy! No major issues detected.',
                  events.filter(e=>e.date===new Date().toISOString().split('T')[0]).length === 0 && 'You have no events today — a great day for deep work.',
                ].filter(Boolean).map((msg,i)=>(
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background:'var(--color-primary)' }}/>
                    <p className="text-sm" style={{ color:'var(--color-text)' }}>{msg}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-4" style={{ background:'var(--color-bg)' }}>
                <p className="font-bold text-sm mb-3" style={{ color:'var(--color-text)' }}>🔮 Next Week Prediction</p>
                {(() => {
                  const nws = new Date(); nws.setDate(nws.getDate()-nws.getDay()+7);
                  const nwe = new Date(nws); nwe.setDate(nws.getDate()+6);
                  const nextEvs = events.filter(e=>e.date>=nws.toISOString().split('T')[0]&&e.date<=nwe.toISOString().split('T')[0]);
                  const thisEvs = events.filter(e=>{const tw=new Date();tw.setDate(tw.getDate()-tw.getDay());const twe=new Date(tw);twe.setDate(tw.getDate()+6);return e.date>=tw.toISOString().split('T')[0]&&e.date<=twe.toISOString().split('T')[0];});
                  const diff = nextEvs.length - thisEvs.length;
                  return (
                    <div className="space-y-1 text-sm" style={{ color:'var(--color-text)' }}>
                      <p>Next week: <strong>{nextEvs.length} events</strong> scheduled
                        {diff>0?<span className="text-red-500 ml-1">↑ {diff} more than this week</span>:diff<0?<span className="text-green-500 ml-1">↓ {Math.abs(diff)} fewer</span>:<span className="opacity-60 ml-1">(same as this week)</span>}
                      </p>
                      <p>Estimated focus time: <strong>{fmtHM(Math.max(0, 40*60 - totalMins(nextEvs)))}</strong></p>
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {/* ── SMART TASKS ── */}
          {activeTab==='tasks' && (
            <>
              <p className="text-sm" style={{ color:'var(--color-text-light)' }}>AI-suggested priorities based on deadlines and current workload:</p>
              {tasks.filter(t=>!t.completed).length===0 ? (
                <div className="text-center py-8" style={{ color:'var(--color-text-light)' }}>All tasks completed! 🎉</div>
              ) : (
                <div className="space-y-2">
                  {tasks.filter(t=>!t.completed)
                    .map(t=>({ ...t, suggestedPriority: suggestPriority(t.deadline) }))
                    .sort((a,b)=>{ const o={high:0,medium:1,low:2}; return o[a.suggestedPriority]-o[b.suggestedPriority]; })
                    .map(task=>{
                      const days=task.deadline?Math.ceil((new Date(task.deadline)-new Date())/86400000):null;
                      const changed = task.suggestedPriority !== task.priority;
                      return (
                        <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background:'var(--color-bg)' }}>
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.suggestedPriority==='high'?'bg-red-500':task.suggestedPriority==='medium'?'bg-yellow-500':'bg-green-500'}`}/>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color:'var(--color-text)' }}>{task.title}</p>
                            <p className="text-xs" style={{ color:'var(--color-text-light)' }}>
                              {days!==null?(days<0?`${Math.abs(days)} days overdue`:days===0?'Due today':`Due in ${days} days`):'No deadline'}
                            </p>
                          </div>
                          {changed && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background:`${task.suggestedPriority==='high'?'#ef444420':task.suggestedPriority==='medium'?'#f59e0b20':'#10b98120'}`, color:task.suggestedPriority==='high'?'#ef4444':task.suggestedPriority==='medium'?'#f59e0b':'#10b981' }}>
                              AI: {task.suggestedPriority}
                            </span>
                          )}
                        </div>
                      );
                    })
                  }
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
