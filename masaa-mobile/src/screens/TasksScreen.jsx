import React from 'react';
import { ListTodo, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useMobileStore } from '../store/mobileStore.js';

export default function TasksScreen() {
  const { tasks, toggleTask } = useMobileStore();

  return (
    <div className="p-4 space-y-4 bg-slate-950 min-h-screen text-slate-100 font-sans pb-24">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <h1 className="text-base font-bold text-white">Tasks & Productivity</h1>
        <span className="text-xs text-amber-400 font-semibold">{tasks.filter((t) => !t.completed).length} Pending</span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-3 cursor-pointer hover:border-slate-700"
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-slate-600 shrink-0" />
            )}

            <div className="flex-1">
              <div className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                {task.title}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Deadline: {task.deadline}</div>
            </div>

            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              task.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
