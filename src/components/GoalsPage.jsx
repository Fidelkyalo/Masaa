import React, { useState } from 'react';
import { Plus, Target, CheckCircle2, Trash2, TrendingUp, Calendar, ChevronRight } from 'lucide-react';

const GOAL_CATEGORIES = ['Work','Personal','Health','Learning','Financial','Spiritual','Family','Other'];
const GOAL_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316'];

export default function GoalsPage({ goals, tasks, onAddGoal, onDeleteGoal, onUpdateGoal, onLinkTask, theme }) {
  const [showForm, setShowForm]   = useState(false);
  const [title,    setTitle]      = useState('');
  const [category, setCategory]   = useState('Work');
  const [deadline, setDeadline]   = useState('');
  const [target,   setTarget]     = useState(100);
  const [color,    setColor]      = useState('#3b82f6');
  const [desc,     setDesc]       = useState('');

  const inp = "w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2";
  const is  = { background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.25)' };

  const add = () => {
    if (!title.trim()) return;
    onAddGoal({ id: Date.now().toString(), title, category, deadline, target: +target, current: 0, color, description: desc, linkedTasks: [], createdAt: new Date().toISOString().split('T')[0] });
    setTitle(''); setCategory('Work'); setDeadline(''); setTarget(100); setColor('#3b82f6'); setDesc(''); setShowForm(false);
  };

  const getLinkedTasks = (goal) => tasks.filter(t => (goal.linkedTasks||[]).includes(t.id));
  const computeProgress = (goal) => {
    const linked = getLinkedTasks(goal);
    if (linked.length === 0) return goal.current || 0;
    return Math.round((linked.filter(t=>t.completed).length / linked.length) * 100);
  };

  const daysLeft = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - new Date()) / 86400000);
    return diff;
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl p-7 text-white" style={{ background:`linear-gradient(135deg,${theme.primary},${theme.secondary})` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target size={26} />
            <div>
              <h1 className="text-2xl font-bold">Goals</h1>
              <p className="text-white/70 text-sm">{goals.length} goal{goals.length!==1?'s':''} · {goals.filter(g=>computeProgress(g)>=100).length} completed</p>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold text-sm transition">
            <Plus size={16}/> New Goal
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-2xl shadow p-6 space-y-4" style={{ background:'var(--color-card)' }}>
          <h3 className="font-bold text-lg" style={{ color:'var(--color-text)' }}>Create New Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className={inp} style={is} placeholder="Goal title *" value={title} onChange={e=>setTitle(e.target.value)} />
            <select className={inp} style={is} value={category} onChange={e=>setCategory(e.target.value)}>
              {GOAL_CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
            <input type="date" className={inp} style={is} value={deadline} onChange={e=>setDeadline(e.target.value)} placeholder="Target date" />
            <input type="number" className={inp} style={is} value={target} onChange={e=>setTarget(e.target.value)} min={1} max={1000} placeholder="Target value (default 100%)" />
          </div>
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color:'var(--color-text-light)' }}>Color</label>
            <div className="flex gap-2">
              {GOAL_COLORS.map(c=><button key={c} onClick={()=>setColor(c)} className="w-7 h-7 rounded-full transition hover:scale-110" style={{ background:c, outline:color===c?'3px solid var(--color-text)':'none', outlineOffset:2 }}/>)}
            </div>
          </div>
          <textarea className={`${inp} resize-none`} style={is} rows={2} placeholder="Description (optional)" value={desc} onChange={e=>setDesc(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={()=>setShowForm(false)} className="px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-80" style={{ background:'rgba(128,128,128,0.15)', color:'var(--color-text)' }}>Cancel</button>
            <button onClick={add} className="px-5 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-80" style={{ background:'var(--color-primary)' }}>Create Goal</button>
          </div>
        </div>
      )}

      {/* Goals grid */}
      {goals.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background:'var(--color-card)' }}>
          <Target size={48} className="mx-auto mb-3 opacity-20" style={{ color:'var(--color-text)' }} />
          <p className="font-semibold text-lg mb-1" style={{ color:'var(--color-text)' }}>No goals yet</p>
          <p className="text-sm" style={{ color:'var(--color-text-light)' }}>Create a goal and link tasks to track your progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {goals.map(goal => {
            const progress = computeProgress(goal);
            const linked   = getLinkedTasks(goal);
            const dl       = daysLeft(goal.deadline);
            const done     = progress >= 100;
            return (
              <div key={goal.id} className="rounded-2xl shadow p-5" style={{ background:'var(--color-card)', borderTop:`3px solid ${goal.color}` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background:`${goal.color}20`, color:goal.color }}>{goal.category}</span>
                      {done && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Completed</span>}
                    </div>
                    <h3 className="font-bold text-base mt-1" style={{ color:'var(--color-text)' }}>{goal.title}</h3>
                    {goal.description && <p className="text-xs mt-0.5" style={{ color:'var(--color-text-light)' }}>{goal.description}</p>}
                  </div>
                  <button onClick={()=>onDeleteGoal(goal.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition ml-2 flex-shrink-0"><Trash2 size={14}/></button>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color:'var(--color-text-light)' }}>Progress</span>
                    <span className="text-xs font-bold" style={{ color:goal.color }}>{progress}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background:'rgba(128,128,128,0.12)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width:`${Math.min(100,progress)}%`, background:goal.color }} />
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs mb-3" style={{ color:'var(--color-text-light)' }}>
                  {goal.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11}/>
                      {dl !== null ? (dl > 0 ? `${dl} days left` : dl === 0 ? 'Due today' : `${Math.abs(dl)} days overdue`) : goal.deadline}
                    </span>
                  )}
                  {linked.length > 0 && (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={11}/>
                      {linked.filter(t=>t.completed).length}/{linked.length} tasks
                    </span>
                  )}
                </div>

                {/* Manual progress adjustment (if no linked tasks) */}
                {linked.length === 0 && !done && (
                  <div className="mb-3">
                    <label className="text-xs mb-1 block" style={{ color:'var(--color-text-light)' }}>Update progress manually</label>
                    <input type="range" min={0} max={100} value={goal.current||0}
                      onChange={e=>onUpdateGoal({...goal, current:+e.target.value})}
                      className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor:goal.color }} />
                  </div>
                )}

                {/* Linked tasks */}
                {linked.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {linked.slice(0,3).map(t=>(
                      <div key={t.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background:'var(--color-bg)' }}>
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${t.completed?'bg-green-500':'bg-gray-300'}`} />
                        <span className={`text-xs flex-1 truncate ${t.completed?'line-through opacity-50':''}`} style={{ color:'var(--color-text)' }}>{t.title}</span>
                      </div>
                    ))}
                    {linked.length > 3 && <p className="text-xs" style={{ color:'var(--color-text-light)' }}>+{linked.length-3} more tasks</p>}
                  </div>
                )}

                {/* Link tasks */}
                <LinkTasksDropdown goal={goal} tasks={tasks} onLink={onLinkTask} is={is} inp={inp} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LinkTasksDropdown({ goal, tasks, onLink, is, inp }) {
  const [open, setOpen] = useState(false);
  const unlinked = tasks.filter(t => !(goal.linkedTasks||[]).includes(t.id));
  return (
    <div className="relative">
      <button onClick={()=>setOpen(!open)} className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition" style={{ color:'var(--color-primary)' }}>
        <Plus size={12}/> Link tasks <ChevronRight size={12} className={`transition-transform ${open?'rotate-90':''}`} />
      </button>
      {open && (
        <div className="absolute left-0 bottom-8 z-10 rounded-xl shadow-xl border w-64 overflow-hidden" style={{ background:'var(--color-card)', borderColor:'rgba(128,128,128,0.15)' }}>
          {unlinked.length === 0 ? (
            <div className="px-4 py-3 text-xs" style={{ color:'var(--color-text-light)' }}>All tasks are linked.</div>
          ) : (
            unlinked.slice(0,8).map(t=>(
              <button key={t.id} onClick={()=>{ onLink(goal.id, t.id); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-xs border-b last:border-0 hover:bg-black/5 transition flex items-center gap-2"
                style={{ color:'var(--color-text)', borderColor:'rgba(128,128,128,0.08)' }}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority==='high'?'bg-red-500':t.priority==='medium'?'bg-yellow-500':'bg-green-500'}`}/>
                <span className="flex-1 truncate">{t.title}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
