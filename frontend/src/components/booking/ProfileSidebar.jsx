import { motion } from 'framer-motion';

const INFO_ITEMS = [
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#7c3aed',
    title: '30 Min Meeting',
    sub: 'Enough time to discuss everything',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.876V15a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
    color: '#06b6d4',
    title: 'Web Conferencing',
    sub: 'Secure link sent after booking',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#10b981',
    title: 'Completely Free',
    sub: 'No fees, no strings attached',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: '#f59e0b',
    title: 'India Standard Time',
    sub: 'UTC +5:30 · Worldwide welcome',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#10b981',
    title: 'Instant Confirmation',
    sub: 'Calendar invite sent immediately',
  },
];

const HOURS = [
  { day: 'Mon – Fri', time: '10:00 AM – 7:00 PM', ok: true },
  { day: 'Saturday', time: '10:00 AM – 4:00 PM', ok: true },
  { day: 'Sunday', time: 'Not Available', ok: false },
];

const AGENDA = [
  'Your project vision & goals',
  'Tech stack recommendation',
  'Timeline & milestones',
  'Budget & pricing range',
  'Freelance or full-time fit',
  'Immediate next action steps',
];

export default function ProfileSidebar() {
  return (
    <aside
      style={{
        background: '#12121a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        minWidth: 0,
      }}
      className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col overflow-y-auto"
    >
      {/* Avatar + Identity */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div
              style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', padding: 2 }}
              className="w-14 h-14 rounded-full"
            >
              <img
                src="/avatar.png"
                alt="Prince Gajera"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('flex','items-center','justify-center');
                  e.target.parentElement.innerHTML = '<span style="color:#fff;font-weight:800;font-size:20px">PG</span>';
                }}
              />
            </div>
            <span
              style={{ background: '#10b981', border: '2px solid #0a0a0f' }}
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full shadow-[0_0_8px_#10b981]"
            />
          </div>
          <div>
            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 15 }}>Prince Gajera</div>
            <div style={{ color: '#7c3aed', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Frontend Developer
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span style={{ color: '#10b981', fontSize: 10, fontFamily: 'monospace' }}>Available for new projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info items */}
      <div className="p-6 flex flex-col gap-4 border-b border-white/5">
        {INFO_ITEMS.map(({ icon, color, title, sub }) => (
          <div key={title} className="flex items-start gap-3">
            <div
              style={{ background: `${color}18`, color, minWidth: 32, minHeight: 32 }}
              className="rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              {icon}
            </div>
            <div>
              <div style={{ color: '#f8fafc', fontSize: 12, fontWeight: 600 }}>{title}</div>
              <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Working Hours */}
      <div className="p-6 border-b border-white/5">
        <div style={{ color: '#64748b', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          🕐 Working Hours
        </div>
        <div className="flex flex-col gap-2">
          {HOURS.map(({ day, time, ok }) => (
            <div key={day} className="flex items-center justify-between">
              <span style={{ color: '#64748b', fontSize: 11, fontFamily: 'monospace' }}>{day}</span>
              <span style={{ color: ok ? '#10b981' : '#ef4444', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}>
                {time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* What we'll cover */}
      <div className="p-6">
        <div style={{ color: '#64748b', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          📋 What We'll Cover
        </div>
        <ul className="flex flex-col gap-2">
          {AGENDA.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span
                style={{ background: 'linear-gradient(to right,#7c3aed,#06b6d4)', minWidth: 6, minHeight: 6 }}
                className="rounded-full flex-shrink-0"
              />
              <span style={{ color: '#94a3b8', fontSize: 11 }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
