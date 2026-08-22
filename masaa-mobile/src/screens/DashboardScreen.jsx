import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, ListTodo, Plus, Brain, Sparkles, Send } from 'lucide-react';
import { useMobileStore } from '../store/mobileStore.js';
import { mobileApi } from '../services/mobileApi.js';

export default function DashboardScreen({ onNavigate }) {
  const { user, events, tasks, addEvent } = useMobileStore();
  const [nlQuery, setNlQuery] = useState('');
  const [nlStatus, setNlStatus] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter((e) => e.date === today);
  const pendingTasks = tasks.filter((t) => !t.completed);

  const handleNlSubmit = async (e) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;

    const res = await mobileApi.parseNaturalLanguage(nlQuery);
    if (res.event) {
      addEvent(res.event);
      setNlStatus(`✓ Added "${res.event.title}" on ${res.event.date}`);
      setNlQuery('');
      setTimeout(() => setNlStatus(''), 3000);
    }
  };

  return (
    <div className="p-4 space-y-4 bg-slate-950 min-h-screen text-slate-100 font-sans pb-24">
      {/* Mobile Top Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 rounded-2xl shadow-lg space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">MASAA Mobile Edition</span>
        <h1 className="text-xl font-bold text-white">Hello, {user.name}! 👋</h1>
        <p className="text-xs text-blue-100">You have {todayEvents.length} events today & {pendingTasks.length} pending tasks.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex justify-between items-center text-blue-400">
            <Calendar className="w-5 h-5" />
            <span className="text-xl font-bold text-white">{todayEvents.length}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Today's Schedule</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex justify-between items-center text-amber-400">
            <ListTodo className="w-5 h-5" />
            <span className="text-xl font-bold text-white">{pendingTasks.length}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Pending Tasks</p>
        </div>
      </div>

      {/* Natural Language Voice/Text Input Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Brain className="w-4 h-4 text-blue-400" />
          <span>Quick Natural Language Scheduler</span>
        </div>

        <form onSubmit={handleNlSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder='e.g. "Meeting tomorrow at 3pm"'
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
            <Send className="w-4 h-4" />
          </button>
        </form>

        {nlStatus && <div className="text-xs font-medium text-emerald-400 pt-1">{nlStatus}</div>}
      </div>

      {/* Today's Schedule List */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-white">Today's Agenda</h2>
          <button onClick={() => onNavigate('Calendar')} className="text-xs text-blue-400 font-semibold hover:underline">
            View All →
          </button>
        </div>

        <div className="space-y-2">
          {todayEvents.length > 0 ? (
            todayEvents.map((ev) => (
              <div key={ev.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center space-x-3">
                <div className="w-2.5 h-8 rounded-full" style={{ backgroundColor: ev.color }} />
                <div className="flex-1">
                  <div className="text-xs font-bold text-white">{ev.title}</div>
                  <div className="text-[11px] text-slate-400">{ev.startTime} - {ev.endTime}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 py-2">No events scheduled for today.</p>
          )}
        </div>
      </div>
    </div>
  );
}
