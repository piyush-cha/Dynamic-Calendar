import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const MiniCalendar = ({ currentDate, onDateClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="mini-calendar">
      <div className="text-sm font-medium mb-2">{format(currentDate, 'MMMM yyyy')}</div>
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-xs text-center text-gray-500">{day}</div>
        ))}
        {monthDays.map(day => (
          <button
            key={day.toString()}
            onClick={() => onDateClick(day)}
            className={`text-xs p-1 rounded-full ${
              isSameMonth(day, currentDate)
                ? isSameDay(day, new Date())
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100'
                : 'text-gray-300'
            }`}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
