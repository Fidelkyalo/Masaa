import React from 'react';
import { Bell, Calendar, CheckCircle2, Users, X } from 'lucide-react';

const TYPE_ICONS = {
  event:   <Calendar size={16}/>,
  task:    <CheckCircle2 size={16}/>,
  invite:  <Users size={16}/>,
  system:  <Bell size={16}/>,
};
const TYPE_COLORS = {
  event:  '#3b82f6',
  task:   '#10b981',
  invite: '#8b5cf6',
  system: '#f59e0b',
};

export default function NotificationCenter({ notifications, onDismiss, onClear }) {
  const unread = notifications.filter(n => !n.read);

  return (
    <div className="rounded-2xl shadow-xl overflow-hidden" style={{ background:'var(--color-card)', width:360, maxHeight:480 }}>
      <div className="p-4 border-b flex justify-between items-center" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
        <div className="flex items-center gap-2">
          <Bell size={18} style={{ color:'var(--color-primary)' }}/>
          <h3 className="font-bold text-sm" style={{ color:'var(--color-text)' }}>Notifications</h3>
          {unread.length > 0 && (
            <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background:'var(--color-primary)' }}>{unread.length}</span>
          )}
        </div>
        {notifications.length > 0 && (
          <button onClick={onClear} className="text-xs font-semibold hover:underline" style={{ color:'var(--color-text-light)' }}>Clear all</button>
        )}
      </div>

      <div className="overflow-y-auto" style={{ maxHeight:400 }}>
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={36} className="mx-auto mb-2 opacity-20" style={{ color:'var(--color-text)' }}/>
            <p className="text-sm" style={{ color:'var(--color-text-light)' }}>You're all caught up!</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="flex items-start gap-3 p-4 border-b hover:bg-black/5 transition"
              style={{ borderColor:'rgba(128,128,128,0.1)', background: !n.read ? `${TYPE_COLORS[n.type]}08` : 'transparent' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                style={{ background: TYPE_COLORS[n.type] || 'var(--color-primary)' }}>
                {TYPE_ICONS[n.type] || <Bell size={16}/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color:'var(--color-text)' }}>{n.title}</p>
                <p className="text-xs mt-0.5" style={{ color:'var(--color-text-light)' }}>{n.message}</p>
                <p className="text-xs mt-1 opacity-60" style={{ color:'var(--color-text-light)' }}>{n.time}</p>
              </div>
              <button onClick={() => onDismiss(n.id)} className="p-1 rounded hover:bg-black/10 flex-shrink-0">
                <X size={14} style={{ color:'var(--color-text-light)' }}/>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
