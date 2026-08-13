import React, { useState } from 'react';
import { Calendar, Eye, EyeOff } from 'lucide-react';

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login'); // login | register
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState('');

  const inp = "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition";
  const is  = { background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.3)' };

  const handle = () => {
    setError('');
    if (!email || !password) { setError('Email and password are required.'); return; }
    if (mode === 'register' && !name) { setError('Name is required.'); return; }

    const users = JSON.parse(localStorage.getItem('masaa_users') || '[]');

    if (mode === 'register') {
      if (users.find(u => u.email === email)) { setError('An account with this email already exists.'); return; }
      const user = { id: Date.now().toString(), name, email, password, timezone:'UTC+3', themeId:'blue-white' };
      users.push(user);
      localStorage.setItem('masaa_users', JSON.stringify(users));
      localStorage.setItem('masaa_session', JSON.stringify({ id: user.id, name, email, timezone:'UTC+3', themeId:'blue-white' }));
      onLogin({ id: user.id, name, email, timezone:'UTC+3', themeId:'blue-white' });
    } else {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) { setError('Invalid email or password.'); return; }
      localStorage.setItem('masaa_session', JSON.stringify({ id: user.id, name: user.name, email: user.email, timezone: user.timezone, themeId: user.themeId }));
      onLogin({ id: user.id, name: user.name, email: user.email, timezone: user.timezone, themeId: user.themeId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background:'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background:'var(--color-primary)' }}>
            <Calendar size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color:'var(--color-primary)' }}>MASAA</h1>
          <p className="text-sm mt-1 font-medium" style={{ color:'var(--color-text-light)' }}>It's About Time.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl shadow-xl p-8" style={{ background:'var(--color-card)' }}>
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background:'var(--color-bg)' }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition"
                style={{ background: mode===m ? 'var(--color-primary)' : 'transparent', color: mode===m ? '#fff' : 'var(--color-text-light)' }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === 'register' && (
              <input className={inp} style={is} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            )}
            <input className={inp} style={is} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            <div className="relative">
              <input className={inp} style={is} type={showPass ? 'text' : 'password'} placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()} />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5" style={{ color:'var(--color-text-light)' }}>
                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button onClick={handle} className="w-full py-3 rounded-xl text-white font-bold text-sm transition hover:opacity-80"
              style={{ background:'var(--color-primary)' }}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t text-center" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
            <p className="text-xs" style={{ color:'var(--color-text-light)' }}>
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setMode(mode==='login'?'register':'login'); setError(''); }}
                className="font-semibold hover:underline" style={{ color:'var(--color-primary)' }}>
                {mode === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-4 p-3 rounded-xl text-center" style={{ background:`var(--color-primary)15` }}>
            <p className="text-xs font-medium" style={{ color:'var(--color-primary)' }}>
              Demo: register any email &amp; password to get started instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
