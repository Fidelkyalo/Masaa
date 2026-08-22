import React, { useState } from 'react';
import { Layers, Zap, Check, CheckCircle2, X, RefreshCw, ExternalLink, Calendar, Video, MessageSquare, CreditCard, Shield } from 'lucide-react';

export default function IntegrationsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('integrations'); // 'integrations' | 'pricing'
  const [connectedServices, setConnectedServices] = useState({
    google: true,
    outlook: false,
    zoom: true,
    teams: false,
    slack: false,
    stripe: true,
    mpesa: true
  });

  const toggleConnection = (service) => {
    setConnectedServices(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const integrationsList = [
    { id: 'google', name: 'Google Calendar & Meet', category: 'Calendar & Video', desc: 'Sync events seamlessly and auto-generate Google Meet links.', icon: Calendar, color: 'text-red-400' },
    { id: 'outlook', name: 'Microsoft Outlook 365', category: 'Calendar & Mail', desc: 'Two-way synchronization with Outlook personal & business schedules.', icon: Calendar, color: 'text-blue-400' },
    { id: 'zoom', name: 'Zoom Meetings', category: 'Video Conferencing', desc: 'Automatically create Zoom meeting links for booked appointments.', icon: Video, color: 'text-blue-500' },
    { id: 'teams', name: 'Microsoft Teams', category: 'Collaboration', desc: 'Embed Teams video rooms into MASAA events.', icon: Video, color: 'text-indigo-400' },
    { id: 'slack', name: 'Slack Notifications', category: 'Productivity', desc: 'Get instant meeting reminders and task alerts in your Slack channels.', icon: MessageSquare, color: 'text-emerald-400' },
    { id: 'mpesa', name: 'M-Pesa STK Push Gateway', category: 'Payments', desc: 'Direct Kenyan Shilling event ticketing and booking fee collection.', icon: CreditCard, color: 'text-emerald-500' },
    { id: 'stripe', name: 'Stripe Payments', category: 'Payments', desc: 'Global credit card processing for paid bookings and subscriptions.', icon: CreditCard, color: 'text-purple-400' },
  ];

  const subscriptionPlans = [
    { id: 'free', name: 'Free Tier', price: '$0', period: 'forever', features: ['1 Personal Calendar', 'Basic Tasks & Reminders', 'Standard Booking Link', 'Basic AI Assistant'] },
    { id: 'pro', name: 'Pro Professional', price: '$12', period: 'per month', popular: true, features: ['Unlimited Calendars', 'Advanced AI Scheduling & Reports', 'Multi-type Booking Pages', 'Schedule Health Score', 'Integrations Hub Access'] },
    { id: 'business', name: 'Business Team', price: '$35', period: 'per user/mo', features: ['Organization Workspaces', 'Shared Resource Booking', 'Department Timetables', 'QR Event Attendance & Ticketing', 'Role-based Permissions'] },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', period: 'annual billing', features: ['Dedicated SLA & Account Manager', 'Custom SSO & Audit Logs', 'MASAA Admin Platform Access', 'Unlimited AI Intelligence Tokens'] },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-100 font-sans">
        
        {/* Header Tabs */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('integrations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activeTab === 'integrations'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Integrations Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activeTab === 'pricing'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Subscription Plans & Upgrades</span>
            </button>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: INTEGRATIONS MARKETPLACE */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Connected Tools & Ecosystem</h3>
                <p className="text-xs text-slate-400">Connect MASAA to your calendar providers, video meeting suites, and payment processors.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrationsList.map((item) => {
                  const Icon = item.icon;
                  const isConnected = connectedServices[item.id];
                  return (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                          <Icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm text-white">{item.name}</div>
                          <span className="text-[11px] text-slate-500">{item.category}</span>
                          <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                        <span className={`text-xs font-semibold ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isConnected ? '● Connected' : 'Disconnected'}
                        </span>
                        <button
                          onClick={() => toggleConnection(item.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isConnected
                              ? 'bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300'
                              : 'bg-blue-600 hover:bg-blue-500 text-white'
                          }`}
                        >
                          {isConnected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & SUBSCRIPTION PLANS */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto">
                <h3 className="text-xl font-extrabold text-white">Choose Your MASAA Power Plan</h3>
                <p className="text-xs text-slate-400 mt-1">Unlock AI intelligence, organizational workspaces, and unlimited scheduling capacity.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {subscriptionPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`bg-slate-950 border rounded-2xl p-5 flex flex-col justify-between space-y-4 relative ${
                      plan.popular ? 'border-amber-500 shadow-xl shadow-amber-500/10' : 'border-slate-800'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase rounded-full tracking-wider">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <h4 className="font-bold text-white text-base">{plan.name}</h4>
                      <div className="mt-2">
                        <span className="text-2xl font-black text-amber-400">{plan.price}</span>
                        <span className="text-xs text-slate-400 ml-1">/ {plan.period}</span>
                      </div>

                      <div className="space-y-2 mt-4 pt-3 border-t border-slate-900">
                        {plan.features.map((f, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                      plan.popular
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}>
                      {plan.id === 'free' ? 'Current Active Plan' : `Upgrade to ${plan.name}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
