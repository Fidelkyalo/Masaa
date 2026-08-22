import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Tag } from 'lucide-react';
import { useMobileStore } from '../store/mobileStore.js';

export default function CalendarScreen() {
  const { events, addEvent } = useMobileStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('14:00');

  const filteredEvents = events.filter((e) => e.date === selectedDate);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addEvent({
      title,
      date: selectedDate,
      startTime,
      endTime: `${parseInt(startTime.split(':')[0]) + 1}:00`,
      color: '#3b82f6',
      category: 'work'
    });
    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 space-y-4 bg-slate-950 min-h-screen text-slate-100 font-sans pb-24">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <h1 className="text-base font-bold text-white">Mobile Calendar</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Date Bar Picker */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
        />
        <span className="text-xs text-slate-400 font-semibold">{filteredEvents.length} Events</span>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((ev) => (
            <div key={ev.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-start space-x-3">
              <div className="w-3 h-10 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
              <div className="flex-1">
                <div className="text-sm font-bold text-white">{ev.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{ev.startTime} - {ev.endTime}</div>
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-semibold text-blue-400">
                  {ev.category || 'general'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            No events scheduled for {selectedDate}. Tap "Add Event" to schedule.
          </div>
        )}
      </div>

      {/* Simple Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Create New Event</h3>
            <input
              type="text"
              placeholder="Event Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-1/2 py-2 bg-slate-800 text-xs font-semibold text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button type="submit" className="w-1/2 py-2 bg-blue-600 text-xs font-bold text-white rounded-xl">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
