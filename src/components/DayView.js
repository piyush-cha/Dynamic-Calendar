import React from 'react';
import { format, parseISO } from 'date-fns';

const DayView = ({ currentDate, events, onSelectEvent, onAddEvent, onDragStart, onDragOver, onDrop }) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const getTimeCardColor = (hour) => {
    const colors = [
      'from-rose-100 to-rose-200',
      'from-orange-100 to-orange-200',
      'from-amber-100 to-amber-200',
      'from-yellow-100 to-yellow-200',
      'from-lime-100 to-lime-200',
      'from-green-100 to-green-200',
      'from-emerald-100 to-emerald-200',
      'from-teal-100 to-teal-200',
      'from-cyan-100 to-cyan-200',
      'from-sky-100 to-sky-200',
      'from-blue-100 to-blue-200',
      'from-indigo-100 to-indigo-200'
    ];
    return colors[hour % colors.length];
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'personal':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'work':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="min-w-full md:min-w-[768px]">
      <div className="grid grid-cols-2 bg-white border-b">
        <div className="p-4 border-r"></div>
        <div className="p-4 text-center">
          <div className="text-sm text-gray-500">{format(currentDate, 'EEEE')}</div>
          <div className="text-xl font-semibold mt-1">{format(currentDate, 'MMMM d, yyyy')}</div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="border-r">
          {timeSlots.map((hour) => (
            <div key={hour} className="h-20 border-b relative">
              <div className="absolute inset-0 p-2">
                <div className={`h-full w-full rounded-xl bg-gradient-to-br ${getTimeCardColor(hour)} flex items-center justify-center font-medium`}>
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="h-20 border-b relative group"
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, currentDate, hour)}
              onClick={() => onAddEvent(hour)}
            >
              <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-25 transition-opacity" />
              <div className="absolute top-0 left-0 m-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to add event
              </div>
              {events
                .filter((event) => 
                  format(parseISO(event.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd') &&
                  parseInt(event.startTime) === hour
                )
                .map((event) => (
                  <div
                    key={event.id}
                    className={`absolute inset-x-0 mx-1 p-2 rounded-lg border cursor-pointer transition-colors ${getEventColor(event.type)}`}
                    style={{
                      top: '4px',
                      height: 'calc(100% - 8px)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(event);
                    }}
                    draggable
                    onDragStart={(e) => onDragStart(e, event)}
                  >
                    <div className="font-medium text-sm truncate">{event.title}</div>
                    <div className="text-xs opacity-75">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;

