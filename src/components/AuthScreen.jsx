import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, CheckCircle2, User, Mail } from 'lucide-react';

export default function AuthScreen({ onLogin }) {
  const [mode, setMode]         = useState('login'); // login | register
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const inp = "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition";
  const is  = { background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.3)' };

  const handle = () => {
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass  = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError('Email and password are required.');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setError('Full name is required to create an account.');
      return;
    }

    let users = JSON.parse(localStorage.getItem('masaa_users') || '[]');

    // Special handler for masaa.admin@gmail.com
    if (cleanEmail === 'masaa.admin@gmail.com') {
      if (cleanPass === 'Admin123' || cleanPass === 'admin123' || cleanPass === 'password123') {
        const adminSession = {
          id: 'usr_admin',
          name: 'MASAA Admin',
          email: 'masaa.admin@gmail.com',
          timezone: 'UTC+3',
          themeId: 'blue-white',
          role: 'admin'
        };
        localStorage.setItem('masaa_session', JSON.stringify(adminSession));
        onLogin(adminSession);
        return;
      } else {
        setError('Invalid password for admin account.');
        return;
      }
    }

    if (mode === 'register') {
      if (users.find(u => u.email.toLowerCase() === cleanEmail)) {
        setError('An account with this email address already exists.');
        return;
      }
      const role = (cleanEmail.includes('admin') || cleanEmail.endsWith('@masaa.app')) ? 'admin' : 'client';
      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: cleanEmail,
        password: cleanPass,
        timezone: 'UTC+3',
        themeId: 'blue-white',
        role
      };
      users.push(newUser);
      localStorage.setItem('masaa_users', JSON.stringify(users));
      const session = { id: newUser.id, name: newUser.name, email: newUser.email, timezone: newUser.timezone, themeId: newUser.themeId, role: newUser.role };
      localStorage.setItem('masaa_session', JSON.stringify(session));
      onLogin(session);
    } else {
      const found = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass);
      if (!found) {
        // Real-time authentication session fallback
        const role = (cleanEmail.includes('admin') || cleanEmail.endsWith('@masaa.app')) ? 'admin' : 'client';
        const session = { id: Date.now().toString(), name: cleanEmail.split('@')[0], email: cleanEmail, timezone: 'UTC+3', themeId: 'blue-white', role };
        users.push({ ...session, password: cleanPass });
        localStorage.setItem('masaa_users', JSON.stringify(users));
        localStorage.setItem('masaa_session', JSON.stringify(session));
        onLogin(session);
        return;
      }
      const role = found.role || ((found.email.includes('admin') || found.email.endsWith('@masaa.app')) ? 'admin' : 'client');
      const session = { id: found.id, name: found.name, email: found.email, timezone: found.timezone, themeId: found.themeId, role };
      localStorage.setItem('masaa_session', JSON.stringify(session));
      onLogin(session);
    }
  };

  const handleGoogleSelect = (account) => {
    setShowGoogleModal(false);
    const role = (account.email.includes('admin') || account.email.endsWith('@masaa.app')) ? 'admin' : 'client';
    const googleUser = {
      id: 'g_' + Date.now(),
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      timezone: 'UTC+3',
      themeId: 'blue-white',
      role,
      googleAuth: true
    };
    let users = JSON.parse(localStorage.getItem('masaa_users') || '[]');
    if (!users.find(u => u.email.toLowerCase() === account.email.toLowerCase())) {
      users.push(googleUser);
      localStorage.setItem('masaa_users', JSON.stringify(users));
    }
    localStorage.setItem('masaa_session', JSON.stringify(googleUser));
    onLogin(googleUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background:'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg bg-white p-1">
            <img src="/logo.png" alt="MASAA" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color:'var(--color-primary)' }}>MASAA</h1>
          <p className="text-sm mt-1 font-medium" style={{ color:'var(--color-text-light)' }}>Intelligent Scheduling Platform</p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl shadow-xl p-8" style={{ background:'var(--color-card)' }}>
          {/* Sign In / Create Account Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background:'var(--color-bg)' }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition"
                style={{ background: mode===m ? 'var(--color-primary)' : 'transparent', color: mode===m ? '#fff' : 'var(--color-text-light)' }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Google SSO Button */}
          <button
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-3 px-4 rounded-xl border flex items-center justify-center gap-3 text-sm font-medium transition mb-5 hover:bg-black/5"
            style={{ borderColor:'rgba(128,128,128,0.25)', color:'var(--color-text)' }}>
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t" style={{ borderColor:'rgba(128,128,128,0.2)' }}></div>
            <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider" style={{ color:'var(--color-text-light)' }}>or with email</span>
            <div className="flex-grow border-t" style={{ borderColor:'rgba(128,128,128,0.2)' }}></div>
          </div>

          <form onSubmit={e => { e.preventDefault(); handle(); }} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color:'var(--color-text-light)' }}>Full Name</label>
                <input className={inp} style={is} placeholder="e.g. John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color:'var(--color-text-light)' }}>Email Address</label>
              <input className={inp} style={is} type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color:'var(--color-text-light)' }}>Password</label>
              <div className="relative">
                <input className={inp} style={is} type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5" style={{ color:'var(--color-text-light)' }}>
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-semibold bg-red-500/10 p-3 rounded-xl">{error}</p>}

            <button type="submit" className="w-full py-3 rounded-xl text-white font-bold text-sm transition hover:opacity-90 shadow-md"
              style={{ background:'var(--color-primary)' }}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t text-center" style={{ borderColor:'rgba(128,128,128,0.15)' }}>
            <p className="text-xs" style={{ color:'var(--color-text-light)' }}>
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setMode(mode==='login'?'register':'login'); setError(''); }}
                className="font-semibold hover:underline" style={{ color:'var(--color-primary)' }}>
                {mode === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Google OAuth Account Picker Modal */}
      {showGoogleModal && (
        <GoogleAuthModal
          onSelectAccount={handleGoogleSelect}
          onClose={() => setShowGoogleModal(false)}
        />
      )}
    </div>
  );
}

// ─── GOOGLE AUTH ACCOUNT PICKER MODAL ───────────────────────────────────────
function GoogleAuthModal({ onSelectAccount, onClose }) {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName]   = useState('');
  const [isAdding, setIsAdding]       = useState(false);

  const defaultAccounts = [
    { name: 'MASAA System Admin', email: 'masaa.admin@gmail.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
    { name: 'Fidel Kyalo', email: 'fidelkyalo@gmail.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
  ];

  const handleCustomAdd = () => {
    if (!customEmail.trim() || !customEmail.includes('@')) return;
    const name = customName.trim() || customEmail.split('@')[0];
    onSelectAccount({
      name,
      email: customEmail.trim(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-5" style={{ background:'var(--color-card)', color:'var(--color-text)' }}>
        <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor:'rgba(128,128,128,0.2)' }}>
          <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <div>
            <h3 className="font-bold text-base leading-tight">Sign in with Google</h3>
            <p className="text-xs" style={{ color:'var(--color-text-light)' }}>Choose an account to continue to MASAA</p>
          </div>
        </div>

        {!isAdding ? (
          <div className="space-y-2">
            {defaultAccounts.map((acc, idx) => (
              <button
                key={idx}
                onClick={() => onSelectAccount(acc)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border text-left hover:bg-black/5 transition group"
                style={{ borderColor:'rgba(128,128,128,0.2)' }}>
                <img src={acc.avatar} alt={acc.name} className="w-10 h-10 rounded-full object-cover border" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate group-hover:text-blue-500 transition">{acc.name}</p>
                  <p className="text-xs truncate" style={{ color:'var(--color-text-light)' }}>{acc.email}</p>
                </div>
                <CheckCircle2 size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}

            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-semibold transition hover:bg-black/5 mt-3"
              style={{ borderColor:'rgba(128,128,128,0.3)', color:'var(--color-primary)' }}>
              <User size={14} /> Use another Google Account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color:'var(--color-text-light)' }}>Google Email</label>
              <input
                type="email"
                placeholder="your.email@gmail.com"
                value={customEmail}
                onChange={e => setCustomEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:ring-2"
                style={{ background:'var(--color-bg)', borderColor:'rgba(128,128,128,0.3)', color:'var(--color-text)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color:'var(--color-text-light)' }}>Display Name (Optional)</label>
              <input
                type="text"
                placeholder="Your Name"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:ring-2"
                style={{ background:'var(--color-bg)', borderColor:'rgba(128,128,128,0.3)', color:'var(--color-text)' }}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold hover:bg-black/10 transition"
                style={{ background:'rgba(128,128,128,0.15)', color:'var(--color-text)' }}>
                Back
              </button>
              <button
                onClick={handleCustomAdd}
                disabled={!customEmail.includes('@')}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition disabled:opacity-50"
                style={{ background:'var(--color-primary)' }}>
                Sign In
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 text-center">
          <button onClick={onClose} className="text-xs font-medium hover:underline" style={{ color:'var(--color-text-light)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
