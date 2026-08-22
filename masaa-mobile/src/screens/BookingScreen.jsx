import React, { useState } from 'react';
import { BookOpen, Copy, Check, Clock, Link as LinkIcon } from 'lucide-react';

export default function BookingScreen() {
  const [copied, setCopied] = useState(false);
  const bookingUrl = 'https://masaa.app/book/fidel-kyalo';

  const handleCopy = () => {
    navigator.clipboard?.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const sampleSlots = [
    { time: '09:00 AM', status: 'Available' },
    { time: '10:30 AM', status: 'Available' },
    { time: '02:00 PM', status: 'Available' },
    { time: '04:00 PM', status: 'Available' }
  ];

  return (
    <div className="p-4 space-y-4 bg-slate-950 min-h-screen text-slate-100 font-sans pb-24">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 rounded-2xl space-y-2">
        <h1 className="text-lg font-bold text-white">Smart Booking Link</h1>
        <p className="text-xs text-purple-100">Share your custom link to let clients book available slots automatically.</p>
        
        <div className="flex space-x-2 pt-2">
          <input
            readOnly
            value={bookingUrl}
            className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-xs text-white outline-none"
          />
          <button onClick={handleCopy} className="px-3 py-2 bg-white text-purple-900 font-bold text-xs rounded-xl">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Slots (Tomorrow)</h2>
        <div className="grid grid-cols-2 gap-2">
          {sampleSlots.map((s, idx) => (
            <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <div className="text-xs font-bold text-white">{s.time}</div>
              <span className="text-[10px] text-emerald-400 font-semibold">● {s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
