import React, { useState, useRef, useEffect } from 'react';

// Comprehensive world timezone list — 200+ cities/countries
const ALL_TIMEZONES = [
  // UTC-12 to UTC-11
  { utc:'UTC-12', cities:'Baker Island, Howland Island' },
  { utc:'UTC-11', cities:'Pago Pago, Niue, American Samoa' },
  // UTC-10
  { utc:'UTC-10', cities:'Honolulu, Hawaii, Cook Islands, Tahiti' },
  { utc:'UTC-9:30', cities:'Marquesas Islands' },
  // UTC-9
  { utc:'UTC-9', cities:'Anchorage, Juneau, Fairbanks, Alaska' },
  // UTC-8
  { utc:'UTC-8', cities:'Los Angeles, San Francisco, Seattle, Vancouver, Tijuana, Las Vegas' },
  // UTC-7
  { utc:'UTC-7', cities:'Denver, Phoenix, Calgary, Edmonton, Salt Lake City, Chihuahua' },
  // UTC-6
  { utc:'UTC-6', cities:'Chicago, Dallas, Houston, Mexico City, Winnipeg, Guatemala City, San Jose, Tegucigalpa, Managua, San Salvador' },
  // UTC-5
  { utc:'UTC-5', cities:'New York, Toronto, Miami, Washington DC, Boston, Atlanta, Detroit, Bogotá, Lima, Quito, Kingston, Havana, Panama City' },
  // UTC-4
  { utc:'UTC-4', cities:'Halifax, Santiago, Caracas, La Paz, Asunción, Georgetown, Manaus, Puerto Rico, Barbados, Trinidad' },
  { utc:'UTC-3:30', cities:'St. Johns, Newfoundland' },
  // UTC-3
  { utc:'UTC-3', cities:'São Paulo, Rio de Janeiro, Buenos Aires, Montevideo, Brasília, Cayenne, Paramaribo, Nuuk' },
  // UTC-2
  { utc:'UTC-2', cities:'South Georgia, Fernando de Noronha' },
  // UTC-1
  { utc:'UTC-1', cities:'Azores, Cape Verde, Praia' },
  // UTC+0
  { utc:'UTC+0', cities:'London, Dublin, Lisbon, Reykjavik, Accra, Abidjan, Dakar, Bamako, Conakry, Freetown, Monrovia, Nouakchott, Casablanca, Bissau' },
  // UTC+1
  { utc:'UTC+1', cities:'Lagos, Kinshasa, Luanda, Bangui, Brazzaville, Douala, Libreville, Malabo, Porto-Novo, Ndjamena, Niamey, Tunis, Algiers, Tripoli, Paris, Berlin, Rome, Madrid, Amsterdam, Brussels, Vienna, Warsaw, Prague, Budapest, Zagreb, Belgrade, Sarajevo, Skopje, Tirana, Zurich, Copenhagen, Stockholm, Oslo' },
  // UTC+2
  { utc:'UTC+2', cities:'Cairo, Johannesburg, Pretoria, Cape Town, Durban, Harare, Lusaka, Lilongwe, Nairobi wait — Kampala, Kigali, Bujumbura, Maputo, Gaborone, Maseru, Mbabane, Athens, Bucharest, Helsinki, Sofia, Riga, Tallinn, Vilnius, Kyiv, Chisinau, Minsk, Beirut, Damascus, Amman, Jerusalem, Nicosia, Windhoek' },
  // UTC+3
  { utc:'UTC+3', cities:'Nairobi, Dar es Salaam, Kampala, Addis Ababa, Mogadishu, Djibouti, Asmara, Juba, Khartoum, Riyadh, Jeddah, Mecca, Medina, Kuwait City, Baghdad, Doha, Manama, Aden, Sanaa, Moscow, Istanbul, Ankara' },
  { utc:'UTC+3:30', cities:'Tehran, Iran' },
  // UTC+4
  { utc:'UTC+4', cities:'Dubai, Abu Dhabi, Sharjah, Muscat, Baku, Tbilisi, Yerevan, Reunion, Mauritius, Seychelles, Samara' },
  { utc:'UTC+4:30', cities:'Kabul, Afghanistan' },
  // UTC+5
  { utc:'UTC+5', cities:'Karachi, Islamabad, Lahore, Tashkent, Ashgabat, Dushanbe, Yekaterinburg, Maldives' },
  { utc:'UTC+5:30', cities:'New Delhi, Mumbai, Kolkata, Chennai, Bangalore, Hyderabad, Pune, Ahmedabad, Surat, Colombo, Sri Lanka' },
  { utc:'UTC+5:45', cities:'Kathmandu, Nepal' },
  // UTC+6
  { utc:'UTC+6', cities:'Dhaka, Chittagong, Almaty, Bishkek, Omsk, Thimphu, Bhutan' },
  { utc:'UTC+6:30', cities:'Yangon, Mandalay, Myanmar, Cocos Islands' },
  // UTC+7
  { utc:'UTC+7', cities:'Bangkok, Jakarta, Hanoi, Ho Chi Minh City, Phnom Penh, Vientiane, Krasnoyarsk, Novosibirsk, Ulaanbaatar' },
  // UTC+8
  { utc:'UTC+8', cities:'Beijing, Shanghai, Guangzhou, Shenzhen, Chengdu, Singapore, Kuala Lumpur, Manila, Taipei, Hong Kong, Macau, Perth, Ulaanbaatar, Irkutsk, Brunei' },
  { utc:'UTC+8:45', cities:'Eucla, Australia' },
  // UTC+9
  { utc:'UTC+9', cities:'Tokyo, Osaka, Nagoya, Sapporo, Seoul, Busan, Pyongyang, Yakutsk, Timor-Leste, Palau' },
  { utc:'UTC+9:30', cities:'Adelaide, Darwin, Australia Central' },
  // UTC+10
  { utc:'UTC+10', cities:'Sydney, Melbourne, Brisbane, Canberra, Hobart, Vladivostok, Guam, Port Moresby, Chuuk' },
  { utc:'UTC+10:30', cities:'Lord Howe Island' },
  // UTC+11
  { utc:'UTC+11', cities:'Noumea, New Caledonia, Honiara, Solomon Islands, Vanuatu, Sakhalin, Magadan' },
  // UTC+12
  { utc:'UTC+12', cities:'Auckland, Wellington, Christchurch, Fiji, Suva, Funafuti, Nauru, Tarawa, Marshall Islands, Petropavlovsk-Kamchatsky, Wallis and Futuna' },
  { utc:'UTC+12:45', cities:'Chatham Islands, New Zealand' },
  // UTC+13
  { utc:'UTC+13', cities:'Apia, Samoa, Nuku\'alofa, Tonga, Fakaofo' },
  { utc:'UTC+14', cities:'Kiritimati, Kiribati, Line Islands' },
];

// Build a flat searchable list: each entry has utc, displayLabel, and search keywords
export const TIMEZONE_LIST = ALL_TIMEZONES.map(tz => ({
  value: tz.utc,
  label: `${tz.utc} — ${tz.cities}`,
  search: `${tz.utc} ${tz.cities}`.toLowerCase(),
}));

export default function TimezonePicker({ value, onChange }) {
  const [query, setQuery]       = useState('');
  const [open, setOpen]         = useState(false);
  const [highlighted, setHigh]  = useState(0);
  const containerRef            = useRef(null);
  const listRef                 = useRef(null);

  const selected = TIMEZONE_LIST.find(t => t.value === value) || TIMEZONE_LIST.find(t => t.value === 'UTC+3');

  const filtered = query.trim()
    ? TIMEZONE_LIST.filter(t => t.search.includes(query.toLowerCase()))
    : TIMEZONE_LIST;

  // Close on outside click
  useEffect(() => {
    const handler = e => { if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current) {
      const item = listRef.current.children[highlighted];
      if (item) item.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted]);

  const select = (tz) => {
    onChange(tz.value);
    setQuery('');
    setOpen(false);
  };

  const handleKey = (e) => {
    if (!open) { if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true); return; }
    if (e.key === 'ArrowDown')  { setHigh(h => Math.min(h + 1, filtered.length - 1)); e.preventDefault(); }
    if (e.key === 'ArrowUp')    { setHigh(h => Math.max(h - 1, 0)); e.preventDefault(); }
    if (e.key === 'Enter')      { if (filtered[highlighted]) select(filtered[highlighted]); }
    if (e.key === 'Escape')     { setOpen(false); }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger / search input */}
      <div
        onClick={() => { setOpen(o => !o); setHigh(0); }}
        className="w-full px-3 py-2 rounded-xl border text-sm cursor-pointer flex items-center justify-between gap-2"
        style={{ background:'var(--color-bg)', color:'var(--color-text)', borderColor:'rgba(128,128,128,0.25)', minHeight:40 }}>
        {open ? (
          <input
            autoFocus
            value={query}
            onChange={e => { setQuery(e.target.value); setHigh(0); }}
            onKeyDown={handleKey}
            onClick={e => e.stopPropagation()}
            placeholder="Search city or country…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color:'var(--color-text)' }}
          />
        ) : (
          <span className="flex-1 truncate text-sm" style={{ color:'var(--color-text)' }}>
            {selected ? selected.label : 'Select timezone…'}
          </span>
        )}
        <span style={{ color:'var(--color-text-light)', fontSize:10 }}>{open ? '▲' : '▼'}</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-xl shadow-xl overflow-hidden"
          style={{ background:'var(--color-card)', border:'1.5px solid rgba(128,128,128,0.2)', maxHeight:260 }}>
          {filtered.length === 0 ? (
            <div className="p-4 text-sm text-center" style={{ color:'var(--color-text-light)' }}>No results for "{query}"</div>
          ) : (
            <ul ref={listRef} className="overflow-y-auto" style={{ maxHeight:258 }}>
              {filtered.map((tz, i) => (
                <li key={tz.value}
                  onMouseDown={() => select(tz)}
                  onMouseEnter={() => setHigh(i)}
                  className="px-4 py-2.5 cursor-pointer text-sm transition"
                  style={{
                    background: i === highlighted ? 'var(--color-primary)' : tz.value === value ? `var(--color-primary)18` : 'transparent',
                    color: i === highlighted ? '#fff' : 'var(--color-text)',
                  }}>
                  <span className="font-semibold">{tz.value}</span>
                  <span className="ml-2 text-xs opacity-75">
                    {tz.label.split('—')[1]?.trim()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
