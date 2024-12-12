import React from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import { getEventColor } from './utils/dateUtils';

const DayCell = ({ day, currentMonth, events, onSelectDate, onDragStart, onDragOver, onDrop, onEditEvent }) => {
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isCurrentDay = isToday(day);

  const handleDragStart = (e, eventId) => {
    e.dataTransfer.setData('text/plain', eventId);
    onDragStart(eventId);
  };

  return (
    <div
      className={`p-2 border ${isCurrentMonth ? 'bg-white' : 'bg-gray-100'} ${
        isCurrentDay ? 'border-primary' : ''
      } min-h-[100px]`}
      onClick={() => onSelectDate(day)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(day);
      }}
      onDrop={(e) => {
        e.preventDefault();
        const eventId = e.dataTransfer.getData('text');
        onDrop(eventId, day);
      }}
    >
      <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
        {format(day, 'd')}
      </div>
      <div className="mt-1 space-y-1">
        {events.map((event) => (
          <div
            key={event.id}
            className={`text-xs p-1 ${getEventColor(event.eventType)} text-white rounded cursor-move`}
            draggable
            onDragStart={(e) => handleDragStart(e, event.id)}
            onClick={(e) => {
              e.stopPropagation();
              onEditEvent(event);
            }}
          >
            <div className="font-semibold">{event.title}</div>
            <div>{event.startTime} - {event.endTime}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayCell;

