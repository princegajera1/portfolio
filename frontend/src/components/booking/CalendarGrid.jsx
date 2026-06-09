import { useState } from 'react';
import { motion } from 'framer-motion';
import { addMonths, subMonths } from 'date-fns';
import { getCalendarDays, formatMonthYear, isDateDisabled, isToday, isSameDay, isSameMonth } from '../../utils/dateHelpers';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarGrid({ selectedDate, onSelectDate }) {
  const [viewMonth, setViewMonth] = useState(new Date());
  const days = getCalendarDays(viewMonth);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setViewMonth((m) => subMonths(m, 1))}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8',
            borderRadius: 8,
            padding: '6px 10px',
            cursor: 'pointer',
            transition: 'all .2s',
          }}
          onMouseEnter={(e) => { e.target.style.color = '#f8fafc'; e.target.style.background = 'rgba(124,58,237,0.15)'; }}
          onMouseLeave={(e) => { e.target.style.color = '#94a3b8'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
        >
          ‹
        </button>
        <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: 15 }}>
          {formatMonthYear(viewMonth)}
        </span>
        <button
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8',
            borderRadius: 8,
            padding: '6px 10px',
            cursor: 'pointer',
            transition: 'all .2s',
          }}
          onMouseEnter={(e) => { e.target.style.color = '#f8fafc'; e.target.style.background = 'rgba(124,58,237,0.15)'; }}
          onMouseLeave={(e) => { e.target.style.color = '#94a3b8'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEK_DAYS.map((d) => (
          <div key={d} style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textAlign: 'center', fontFamily: 'monospace', letterSpacing: '0.06em', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const disabled = isDateDisabled(day);
          const isCurrentMonth = isSameMonth(day, viewMonth);
          const todayFlag = isToday(day);
          const selected = selectedDate && isSameDay(day, selectedDate);
          const isSunday = day.getDay() === 0;

          let bg = 'transparent';
          let color = '#64748b';
          let border = 'transparent';
          let cursor = 'default';
          let opacity = 1;

          if (!isCurrentMonth || isSunday) {
            opacity = 0.25;
          } else if (disabled) {
            opacity = 0.35;
          } else if (selected) {
            bg = '#7c3aed';
            color = '#ffffff';
            border = '#7c3aed';
            cursor = 'pointer';
          } else if (todayFlag) {
            border = '#7c3aed';
            color = '#a78bfa';
            cursor = 'pointer';
          } else {
            color = '#cbd5e1';
            cursor = 'pointer';
          }

          return (
            <motion.button
              key={i}
              whileHover={!disabled && isCurrentMonth && !isSunday ? { scale: 1.1 } : {}}
              whileTap={!disabled && isCurrentMonth && !isSunday ? { scale: 0.95 } : {}}
              onClick={() => !disabled && isCurrentMonth && !isSunday && onSelectDate(day)}
              style={{
                background: bg,
                color,
                border: `1px solid ${border}`,
                borderRadius: 8,
                padding: '8px 4px',
                fontSize: 13,
                fontWeight: selected || todayFlag ? 700 : 500,
                cursor,
                opacity,
                transition: 'all .15s',
                textAlign: 'center',
                outline: 'none',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!disabled && isCurrentMonth && !isSunday && !selected) {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.15)';
                  e.currentTarget.style.color = '#a78bfa';
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled && isCurrentMonth && !isSunday && !selected) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#cbd5e1';
                }
              }}
            >
              {day.getDate()}
              {todayFlag && !selected && (
                <span style={{
                  position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%', background: '#7c3aed', display: 'block'
                }} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
