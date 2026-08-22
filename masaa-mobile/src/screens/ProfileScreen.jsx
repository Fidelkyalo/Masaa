import React from 'react';
import { User, Shield, Zap, Globe, LogOut } from 'lucide-react';
import { useMobileStore } from '../store/mobileStore.js';

export default function ProfileScreen() {
  const { user } = useMobileStore();

  return (
    <div className="p-4 space-y-4 bg-slate-950 min-h-screen text-slate-100 font-sans pb-24">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          {user.name[0]}
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{user.name}</h2>
          <div className="text-xs text-slate-400">{user.email}</div>
          <span className="inline-block mt-1 px-2.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-bold">
            {user.plan} Tier
          </span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-200">Timezone</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">{user.timezone}</span>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">Mobile API Sync Status</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold">● REST API Connected</span>
        </div>
      </div>
    </div>
  );
}
