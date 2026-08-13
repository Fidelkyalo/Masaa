import React, { useState } from 'react';
import { Plus, Trash2, User, Mail, Phone, Search, Users } from 'lucide-react';

const CATEGORIES = ['Client','Colleague','Friend','Family','Student','Church','Other'];

export default function ContactsPage({ contacts, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [category, setCategory] = useState('Colleague');

  const inp = "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2";
  const is  = { background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.3)' };

  const add = () => {
    if (!name.trim()) return;
    onAdd({ id: Date.now().toString(), name, email, phone, category });
    setName(''); setEmail(''); setPhone(''); setCategory('Colleague'); setShowForm(false);
  };

  const allCats = ['All', ...CATEGORIES];
  const visible = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || (c.email||'').toLowerCase().includes(search.toLowerCase());
    const matchCat    = filter === 'All' || c.category === filter;
    return matchSearch && matchCat;
  });

  const initials = (n) => n.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const colors   = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316'];
  const color    = (id) => colors[id.charCodeAt(0) % colors.length];

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color:'var(--color-text)' }}>Contacts</h2>
          <p className="text-sm mt-0.5" style={{ color:'var(--color-text-light)' }}>{contacts.length} contacts</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-80 transition"
          style={{ background:'var(--color-primary)' }}>
          <Plus size={16}/> Add Contact
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-2xl shadow p-6 space-y-4" style={{ background:'var(--color-card)' }}>
          <h3 className="font-bold" style={{ color:'var(--color-text)' }}>New Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className={inp} style={is} placeholder="Full Name *" value={name} onChange={e=>setName(e.target.value)} />
            <input className={inp} style={is} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className={inp} style={is} placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
            <select className={inp} style={is} value={category} onChange={e=>setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition"
              style={{ background:'rgba(128,128,128,0.15)', color:'var(--color-text)' }}>Cancel</button>
            <button onClick={add} className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-80 transition"
              style={{ background:'var(--color-primary)' }}>Save Contact</button>
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3" style={{ color:'var(--color-text-light)' }} />
          <input className={`${inp} pl-9`} style={is} placeholder="Search contacts…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 flex-wrap">
          {allCats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              style={{ background: filter===c ? 'var(--color-primary)' : 'rgba(128,128,128,0.12)',
                       color:      filter===c ? '#fff' : 'var(--color-text-light)' }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(c => (
            <div key={c.id} className="rounded-2xl shadow p-5 flex items-start gap-4 group" style={{ background:'var(--color-card)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: color(c.id) }}>{initials(c.name)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate" style={{ color:'var(--color-text)' }}>{c.name}</p>
                <p className="text-xs mb-1" style={{ color:'var(--color-primary)' }}>{c.category}</p>
                {c.email && <p className="text-xs truncate flex items-center gap-1" style={{ color:'var(--color-text-light)' }}><Mail size={11}/>{c.email}</p>}
                {c.phone && <p className="text-xs truncate flex items-center gap-1 mt-0.5" style={{ color:'var(--color-text-light)' }}><Phone size={11}/>{c.phone}</p>}
              </div>
              <button onClick={() => onDelete(c.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition flex-shrink-0">
                <Trash2 size={14}/>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl" style={{ background:'var(--color-card)' }}>
          <Users size={48} className="mx-auto mb-3 opacity-20" style={{ color:'var(--color-text)' }} />
          <p className="font-medium" style={{ color:'var(--color-text-light)' }}>No contacts found.</p>
        </div>
      )}
    </div>
  );
}
