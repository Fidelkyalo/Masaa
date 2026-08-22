// MASAA Mobile State Store
import create from 'zustand';

export const useMobileStore = create((set) => ({
  user: { name: 'Fidel Kyalo', email: 'fidel@masaa.app', plan: 'Enterprise', timezone: 'UTC+3' },
  theme: 'blue-white',
  events: [
    { id: 'm_ev1', title: 'Team Sync Meeting', date: new Date().toISOString().split('T')[0], startTime: '10:00', endTime: '11:00', category: 'work', color: '#3b82f6' },
    { id: 'm_ev2', title: 'Lunch & Break', date: new Date().toISOString().split('T')[0], startTime: '12:00', endTime: '13:00', category: 'personal', color: '#10b981' }
  ],
  tasks: [
    { id: 'm_tk1', title: 'Review Phase 3 Mobile Launch', priority: 'high', completed: false, deadline: new Date().toISOString().split('T')[0] },
    { id: 'm_tk2', title: 'Check M-Pesa Webhook Logs', priority: 'medium', completed: true, deadline: new Date().toISOString().split('T')[0] }
  ],

  addEvent: (event) => set((state) => ({ events: [...state.events, { ...event, id: `ev_${Date.now()}` }] })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
  })),
  setUser: (user) => set({ user })
}));
