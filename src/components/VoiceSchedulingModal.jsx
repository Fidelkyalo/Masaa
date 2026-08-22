import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, CheckCircle2, X, RefreshCw, Volume2 } from 'lucide-react';
import { parseNaturalEventEnhanced } from './AIAssistant.jsx';

export default function VoiceSchedulingModal({ contacts, onCreateEvent, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedEvent, setParsedEvent] = useState(null);

  const startVoiceRecognition = () => {
    setIsListening(true);
    setTranscript('Listening... "Schedule lunch with Sarah tomorrow at 1pm"');

    // Simulate Web Speech API voice capture
    setTimeout(() => {
      const simulatedSpeech = 'Schedule team sync with John tomorrow at 2pm for 1 hour';
      setTranscript(simulatedSpeech);
      setIsListening(false);
      const ev = parseNaturalEventEnhanced(simulatedSpeech, contacts || []);
      setParsedEvent(ev);
    }, 2200);
  };

  const handleConfirm = () => {
    if (parsedEvent) {
      onCreateEvent(parsedEvent);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 font-sans space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-red-500 rounded-xl">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">MASAA Voice Scheduler</h2>
              <p className="text-xs text-slate-400">Speak naturally to schedule meetings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Microphone Pulse Circle */}
        <div className="py-6 text-center space-y-4">
          <button
            onClick={startVoiceRecognition}
            disabled={isListening}
            className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all shadow-xl ${
              isListening
                ? 'bg-red-500 animate-pulse text-white ring-8 ring-red-500/30'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:scale-105 text-white shadow-blue-500/25'
            }`}
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>

          <p className="text-xs text-slate-400 font-medium">
            {isListening ? 'Speak now into your microphone...' : 'Tap the microphone to begin voice input'}
          </p>
        </div>

        {/* Transcript & Interpretation Display */}
        {transcript && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Captured Voice Transcript</div>
            <p className="text-xs text-slate-200 italic">"{transcript}"</p>

            {parsedEvent && (
              <div className="pt-3 border-t border-slate-900 space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interpreted Event Details</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl space-y-1 text-xs">
                  <div className="font-bold text-white">{parsedEvent.title}</div>
                  <div className="text-slate-400">📅 Date: {parsedEvent.date}</div>
                  <div className="text-slate-400">⏰ Time: {parsedEvent.startTime} - {parsedEvent.endTime}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={onClose}
            className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!parsedEvent}
            className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-bold text-white rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Add Event</span>
          </button>
        </div>
      </div>
    </div>
  );
}
