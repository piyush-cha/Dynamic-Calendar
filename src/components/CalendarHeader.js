import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth }) => {
  return (
    <header className="flex justify-between items-center mb-4">
      {/* Display current month and year */}
      <h2 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
      
      {/* Navigation buttons */}
      <div className="flex space-x-2">
        <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronLeft size={24} />
        </button>
        <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronRight size={24} />
        </button>
      </div>
    </header>
  );
};

export default CalendarHeader;