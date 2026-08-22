import React, { useState } from 'react';
import { 
  BarChart3, Users, Building2, DollarSign, Cpu, ShieldCheck, Activity, 
  Layers, Settings, Bell, Search, Filter, AlertTriangle, CheckCircle2, 
  Clock, ArrowUpRight, TrendingUp, Download, Lock, RefreshCw, MessageSquare, 
  Sparkles, ExternalLink, Zap, HelpCircle
} from 'lucide-react';

export default function AdminPlatform({ onClose, onSwitchUserView }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);

  // Mock Admin Data
  const stats = {
    totalUsers: '14,820',
    activeUsers: '9,450',
    mrr: '$42,500',
    arr: '$510,000',
    activeOrgs: '312',
    aiCost: '$1,240.50',
    systemHealth: '99.98%',
    pendingTickets: 8
  };

  const usersList = [
    { id: 1, name: 'Fidel Kyalo', email: 'fidel@masaa.app', role: 'System Admin', plan: 'Enterprise', status: 'Active', org: 'MASAA Inc', joined: '2024-01-10' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah@acmecorp.com', role: 'Org Admin', plan: 'Business', status: 'Active', org: 'Acme Corp', joined: '2024-02-15' },
    { id: 3, name: 'Pastor David Omondi', email: 'pastor@gracechurch.org', role: 'Church Manager', plan: 'Pro', status: 'Active', org: 'Grace Church Nairobi', joined: '2024-03-01' },
    { id: 4, name: 'Dr. Michael Chen', email: 'mchen@stanford.edu', role: 'School Admin', plan: 'Enterprise', status: 'Active', org: 'Stanford Dept of CS', joined: '2024-03-12' },
    { id: 5, name: 'Elena Rostova', email: 'elena@freelance.design', role: 'User', plan: 'Free', status: 'Inactive', org: 'Independent', joined: '2024-04-05' },
    { id: 6, name: 'James Kariuki', email: 'james@techkenya.co.ke', role: 'Business User', plan: 'Business', status: 'Suspended', org: 'Tech Kenya Ltd', joined: '2024-05-20' },
  ];

  const orgsList = [
    { id: 1, name: 'Acme Corporation', type: 'Business', members: 145, plan: 'Business', mrr: '$1,450', admin: 'Sarah Jenkins' },
    { id: 2, name: 'Grace Community Church', type: 'Church', members: 82, plan: 'Pro', mrr: '$290', admin: 'Pastor David' },
    { id: 3, name: 'Nairobi International Academy', type: 'School', members: 320, plan: 'Enterprise', mrr: '$3,200', admin: 'Dr. Michael Chen' },
    { id: 4, name: 'Apex Tech Solutions', type: 'Business', members: 28, plan: 'Business', mrr: '$450', admin: 'Alex Vance' },
  ];

  const featureFlags = [
    { key: 'ai_natural_language', label: 'Natural Language Scheduling Engine', category: 'AI', enabled: true },
    { key: 'qr_attendance', label: 'QR Code Attendance & Event Ticketing', category: 'Events', enabled: true },
    { key: 'mpesa_payments', label: 'M-Pesa Direct STK Push Payment Gateway', category: 'Finance', enabled: true },
    { key: 'zoom_auto_sync', label: 'Automatic Zoom/Meet Room Allocation', category: 'Integrations', enabled: true },
    { key: 'resource_booking_v2', label: 'Advanced Resource & Facility Booking', category: 'Workspaces', enabled: true },
    { key: 'schedule_health_v2', label: 'Predictive Schedule Burnout Shield', category: 'AI Intelligence', enabled: false },
  ];

  const handleRunAdminAi = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    
    // Simulate AI response for platform admin queries
    setAiResponse({
      query: aiQuery,
      text: `Based on current platform analytics: Revenue grew 18.4% month-over-month, primarily driven by Business tier conversions in East Africa. AI token usage is within expected thresholds ($1.2k spent vs $4.5k budgeted). Recommendation: Consider expanding localized M-Pesa subscription options.`,
      timestamp: 'Just now'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-hidden flex flex-col text-slate-100 font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">MASAA Executive Admin Console</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">Owner Access</span>
            </div>
            <p className="text-xs text-slate-400">System Monitoring, Subscriptions, AI Operations & Platform Controls</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={onSwitchUserView}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <span>Switch to User View</span>
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Admin Navigation Sidebar */}
        <aside className="w-64 bg-slate-900/70 border-r border-slate-800 p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">Core Management</div>
          {[
            { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'orgs', label: 'Organizations', icon: Building2 },
            { id: 'finance', label: 'Finance & Revenue', icon: DollarSign },
            { id: 'ai', label: 'AI Operations & Token Cost', icon: Cpu },
            { id: 'admin_ai', label: 'Ask Admin AI', icon: Sparkles },
            { id: 'system', label: 'System & Health Status', icon: Activity },
            { id: 'feature_flags', label: 'Feature Management', icon: Layers },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active 
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-950 p-6 overflow-y-auto">
          
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Total Registered Users</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{stats.totalUsers}</div>
                  <div className="flex items-center space-x-1 text-emerald-400 text-xs mt-2 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+12.4% this month</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Monthly Recurring Revenue (MRR)</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{stats.mrr}</div>
                  <div className="flex items-center space-x-1 text-emerald-400 text-xs mt-2 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>ARR: {stats.arr}</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Active Workspaces</span>
                    <Building2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{stats.activeOrgs}</div>
                  <p className="text-xs text-slate-400 mt-2">Businesses, Churches & Schools</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>System Uptime & Health</span>
                    <Activity className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 mt-2">{stats.systemHealth}</div>
                  <div className="flex items-center space-x-1 text-slate-400 text-xs mt-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>All services operational</span>
                  </div>
                </div>
              </div>

              {/* Charts & System Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-base font-semibold text-white mb-4">Revenue & User Growth</h3>
                  <div className="h-64 flex items-end space-x-3 pt-6 pb-2 border-b border-slate-800 px-2">
                    {[35, 45, 52, 60, 68, 75, 84, 92, 105, 120, 138, 160].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div 
                          style={{ height: `${h}px` }} 
                          className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-md group-hover:brightness-125 transition"
                        />
                        <span className="text-[10px] text-slate-500">M{i+1}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400 mt-4">
                    <span>Monthly breakdown</span>
                    <span className="font-semibold text-amber-400">Target: $50k MRR</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4">Platform System Alerts</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-emerald-300">Database Optimization Complete</div>
                          <div className="text-[11px] text-slate-400">PostgreSQL indices updated at 03:00 UTC.</div>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-amber-300">AI Cost Spike Detection</div>
                          <div className="text-[11px] text-slate-400">High volume of Natural Language queries from Org #32.</div>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start space-x-3">
                        <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-blue-300">M-Pesa Webhook Operational</div>
                          <div className="text-[11px] text-slate-400">Instant payment reconciliation active.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-xl border border-slate-700 transition">
                    View Full Security Audit Log
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or organization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  {['all', 'Enterprise', 'Business', 'Pro', 'Free'].map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setUserFilter(plan)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        userFilter === plan 
                          ? 'bg-amber-500 text-slate-950 font-bold' 
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Organization</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Plan</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {usersList
                      .filter(u => userFilter === 'all' || u.plan === userFilter)
                      .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-xs text-slate-400">{u.email}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{u.org}</td>
                          <td className="px-6 py-4 text-slate-400 text-xs">{u.role}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              u.plan === 'Enterprise' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                              u.plan === 'Business' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              u.plan === 'Pro' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {u.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center space-x-1 text-xs font-medium ${
                              u.status === 'Active' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                              <span>{u.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-xs text-amber-400 hover:underline font-medium">Manage Account</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORGANIZATIONS */}
          {activeTab === 'orgs' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Registered Organizations & Workspaces</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orgsList.map((org) => (
                  <div key={org.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white text-base">{org.name}</h3>
                        <span className="text-xs text-amber-400 font-medium">{org.type} Workspace</span>
                      </div>
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 font-semibold text-xs rounded-full border border-amber-500/20">
                        {org.mrr} / mo
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800 text-slate-400">
                      <div>Members: <span className="text-white font-medium">{org.members} active</span></div>
                      <div>Plan: <span className="text-purple-400 font-medium">{org.plan}</span></div>
                      <div>Primary Admin: <span className="text-slate-200">{org.admin}</span></div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition">
                        Workspace Analytics
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCE & REVENUE */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="text-xs font-semibold text-slate-400">MRR Growth Rate</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">+18.4%</div>
                  <p className="text-xs text-slate-400 mt-2">Vs. previous 30 days</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="text-xs font-semibold text-slate-400">Payment Gateways</div>
                  <div className="text-base font-bold text-white mt-1">Stripe + M-Pesa</div>
                  <p className="text-xs text-emerald-400 mt-2">● Active & Reconciled</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="text-xs font-semibold text-slate-400">Churn Rate</div>
                  <div className="text-2xl font-bold text-blue-400 mt-1">0.82%</div>
                  <p className="text-xs text-slate-400 mt-2">Lowest in Q3</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI OPERATIONS */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-2">AI Token & Infrastructure Cost Engine</h3>
                <p className="text-xs text-slate-400 mb-6">Real-time monitoring of natural language parsers, recommendation generators, and conversational queries.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Total API Requests</div>
                    <div className="text-xl font-bold text-white mt-1">248,910</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Estimated Cost This Month</div>
                    <div className="text-xl font-bold text-amber-400 mt-1">{stats.aiCost}</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Avg Latency</div>
                    <div className="text-xl font-bold text-emerald-400 mt-1">180ms</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ASK ADMIN AI */}
          {activeTab === 'admin_ai' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <h2 className="text-lg font-bold text-white">Ask MASAA Executive AI</h2>
                </div>
                <p className="text-xs text-slate-300">Ask natural language questions regarding revenue, system performance, subscription growth, or feature adoption.</p>

                <form onSubmit={handleRunAdminAi} className="mt-4 flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. How is MASAA revenue performing compared to last quarter?"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 font-bold text-slate-950 text-sm rounded-xl hover:brightness-110 transition shadow-lg shadow-amber-500/20"
                  >
                    Analyze
                  </button>
                </form>

                {aiResponse && (
                  <div className="mt-4 p-4 bg-slate-900/90 border border-slate-700 rounded-xl space-y-2">
                    <div className="text-xs font-semibold text-amber-400">Executive Insight Summary</div>
                    <p className="text-sm text-slate-200 leading-relaxed">{aiResponse.text}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: FEATURE FLAGS */}
          {activeTab === 'feature_flags' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Platform Feature Management & Rollout Controls</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
                {featureFlags.map((flag) => (
                  <div key={flag.key} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-sm">{flag.label}</div>
                      <div className="text-xs text-slate-400">Key: <code className="text-amber-400">{flag.key}</code> | Category: {flag.category}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-medium ${flag.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button className={`w-12 h-6 rounded-full transition p-1 ${flag.enabled ? 'bg-amber-500' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-slate-950 transition transform ${flag.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SYSTEM HEALTH */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">System Architecture & Infrastructure Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'PostgreSQL Database Engine', status: 'Operational', latency: '12ms' },
                  { name: 'REST API Gateway (Laravel 11)', status: 'Operational', latency: '45ms' },
                  { name: 'Firebase Cloud Messaging (Push)', status: 'Operational', latency: '98ms' },
                  { name: 'M-Pesa STK Push Connector', status: 'Operational', latency: '320ms' },
                  { name: 'Stripe Billing Webhook', status: 'Operational', latency: '110ms' },
                  { name: 'Zoom & Meet Meeting Engine', status: 'Operational', latency: '60ms' },
                ].map((s, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white text-sm">{s.name}</div>
                      <div className="text-xs text-slate-400">Response latency: {s.latency}</div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                      ● {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
