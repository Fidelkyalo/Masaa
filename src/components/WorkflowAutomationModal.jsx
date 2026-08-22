import React, { useState } from 'react';
import { Zap, Plus, ArrowRight, CheckCircle2, Trash2, X, Sliders } from 'lucide-react';

export default function WorkflowAutomationModal({ onClose }) {
  const [workflows, setWorkflows] = useState([
    { id: 'wf_1', trigger: 'When a new meeting is booked', action: 'Auto-create Zoom Room & send Slack notification', active: true },
    { id: 'wf_2', trigger: '15 minutes before event start', action: 'Send SMS & Push reminder to attendees', active: true },
    { id: 'wf_3', trigger: 'When task is marked complete', action: 'Update Goal progress bar & log to activity feed', active: true }
  ]);

  const [selectedTrigger, setSelectedTrigger] = useState('When a new meeting is booked');
  const [selectedAction, setSelectedAction] = useState('Generate Zoom room link');

  const triggersList = [
    'When a new meeting is booked',
    'When event is rescheduled',
    '15 minutes before event start',
    'When task is marked complete',
    'When new contact is registered'
  ];

  const actionsList = [
    'Generate Zoom room link',
    'Send Slack channel notification',
    'Send M-Pesa STK Push receipt',
    'Broadcast email invitation',
    'Update Goal progress bar'
  ];

  const handleAddWorkflow = () => {
    setWorkflows(prev => [
      ...prev,
      { id: `wf_${Date.now()}`, trigger: selectedTrigger, action: selectedAction, active: true }
    ]);
  };

  const toggleWorkflow = (id) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 font-sans space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-2xl">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">MASAA Workflow Automation</h2>
              <p className="text-xs text-slate-400">Build custom Trigger ➔ Action automation rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Builder Form */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400">Create Automation Rule</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">WHEN (Trigger)</label>
              <select
                value={selectedTrigger}
                onChange={(e) => setSelectedTrigger(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {triggersList.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">THEN (Action)</label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {actionsList.map((a, idx) => <option key={idx} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleAddWorkflow}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Automation Workflow</span>
          </button>
        </div>

        {/* Active Workflows List */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Workflows ({workflows.length})</div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {workflows.map((wf) => (
              <div key={wf.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <span>{wf.trigger}</span>
                    <ArrowRight className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-300">{wf.action}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleWorkflow(wf.id)}
                  className={`w-9 h-5 rounded-full transition p-0.5 ${wf.active ? 'bg-purple-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition transform ${wf.active ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl transition"
        >
          Close & Save Workflows
        </button>
      </div>
    </div>
  );
}
