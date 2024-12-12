import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

const MonthView = ({ currentDate, events, onSelectDate }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'bg-green-100 text-green-800';
      case 'personal':
        return 'bg-orange-100 text-orange-800';
      case 'work':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white">
      <div className="grid grid-cols-7 border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2 px-3 text-center text-sm font-semibold text-gray-900">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 h-[calc(100vh-12rem)]">
        {calendarDays.map((day) => (
          <div
            key={day.toString()}
            className={`min-h-[120px] p-2 border-b border-r relative ${
              !isSameMonth(day, currentDate) ? 'bg-gray-50' : ''
            }`}
            onClick={() => onSelectDate(day)}
          >
            <div className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${
              isSameDay(day, new Date()) 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-900'
            }`}>
              {format(day, 'd')}
            </div>
            <div className="mt-1 space-y-1">
              {events
                .filter(event => isSameDay(new Date(event.date), day))
                .slice(0, 3)
                .map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded-md truncate ${getEventColor(event.type)}`}
                  >
                    {event.title}
                  </div>
                ))}
              {events.filter(event => isSameDay(new Date(event.date), day)).length > 3 && (
                <div className="text-xs text-gray-500">
                  {events.filter(event => isSameDay(new Date(event.date), day)).length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;

