import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addHours } from 'date-fns';
import { ChevronLeft, ChevronRight, Share2, Plus, Menu, X } from 'lucide-react';
import MiniCalendar from './MiniCalendar';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import './styles/Calendar.css';
import { saveAs } from 'file-saver';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [savedTasks, setSavedTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState('week');
  const [newEventDate, setNewEventDate] = useState(new Date());
  const [newEventTime, setNewEventTime] = useState('09:00');
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('calendar-events')) || [];
    setEvents(savedEvents);
    
    const tasks = JSON.parse(localStorage.getItem('saved-tasks')) || [];
    setSavedTasks(tasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const handlePrevious = () => {
    switch (view) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const getHeaderText = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return `${format(weekStart, "MMMM d")} - ${format(weekEnd, "d, yyyy")}`;
      case 'day':
        return format(currentDate, 'MMMM d, yyyy');
      default:
        return '';
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    saveAs(blob, 'calendar_events.json');
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Date', 'Start Time', 'End Time', 'Type'];
    const csvData = events.map(event => [
      event.title,
      event.date,
      event.startTime,
      event.endTime,
      event.type
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'calendar_events.csv');
  };

  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
    e.dataTransfer.setData('text/plain', event.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, date, hour) => {
    e.preventDefault();
    if (!draggedEvent) return;

    const updatedEvents = events.map(event => {
      if (event.id === draggedEvent.id) {
        return {
          ...event,
          date: format(date, 'yyyy-MM-dd'),
          startTime: `${hour.toString().padStart(2, '0')}:00`,
          endTime: `${(hour + 1).toString().padStart(2, '0')}:00`
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    setDraggedEvent(null);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
    setNewEventDate(parseISO(event.date));
    setNewEventTime(event.startTime);
  };

  const handleAddEvent = (date, hour) => {
    setSelectedEvent(null);
    setShowEventModal(true);
    setNewEventDate(date);
    setNewEventTime(`${hour.toString().padStart(2, '0')}:00`);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-20 w-full md:w-64 bg-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:relative md:translate-x-0 border-r`}>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-4">
          <h1 className="text-xl font-semibold mb-6">Calendar</h1>
          <MiniCalendar currentDate={currentDate} onDateClick={setCurrentDate} />
          
          <div className="mt-8">
            <h2 className="text-sm font-medium mb-4">Saved Tasks</h2>
            <div className="space-y-2">
              {savedTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-600">{task.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button className="w-full mt-8 bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden pt-16 md:pt-0">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 md:relative bg-white border-b px-4 py-3 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                {getHeaderText()}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={handlePrevious}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  className="appearance-none bg-white border rounded-lg px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="month">Month</option>
                  <option value="week">Week</option>
                  <option value="day">Day</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        exportToJSON();
                        setShowExportMenu(false);
                      }}
                    >
                      Export as JSON
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        exportToCSV();
                        setShowExportMenu(false);
                      }}
                    >
                      Export as CSV
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Calendar View */}
        <div className="flex-1 overflow-auto">
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onSelectDate={(date) => {
                setCurrentDate(date);
                setView('day');
              }}
            />
          )}
          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onSelectEvent={handleSelectEvent}
              onAddEvent={handleAddEvent}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          )}
          {view === 'day' && (
            <DayView
              currentDate={currentDate}
              events={events}
              onSelectEvent={handleSelectEvent}
              onAddEvent={(hour) => handleAddEvent(currentDate, hour)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          )}
        </div>

        {/* Floating Action Button */}
        <div className="fixed right-6 bottom-6 group">
          <button
            onClick={() => {
              setSelectedEvent(null);
              setShowEventModal(true);
              setNewEventDate(currentDate);
              setNewEventTime('09:00');
            }}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
          <span className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Add Event
          </span>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedEvent ? 'Edit Event' : 'New Event'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const eventData = Object.fromEntries(formData);
              
              if (selectedEvent) {
                setEvents(events.map(e => 
                  e.id === selectedEvent.id ? { ...e, ...eventData } : e
                ));
              } else {
                setEvents([...events, {
                  ...eventData,
                  id: Date.now().toString(),
                  date: format(newEventDate, 'yyyy-MM-dd'),
                  startTime: newEventTime,
                  endTime: format(addHours(parseISO(`${format(newEventDate, 'yyyy-MM-dd')}T${newEventTime}`), 1), 'HH:mm')
                }]);
              }
              
              setShowEventModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="title"
                    placeholder="Event title"
                    defaultValue={selectedEvent ? selectedEvent.title : ''}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="date"
                      name="date"
                      defaultValue={selectedEvent ? selectedEvent.date : format(newEventDate, 'yyyy-MM-dd')}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <select
                      name="type"
                      defaultValue={selectedEvent ? selectedEvent.type : 'default'}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="default">Default</option>
                      <option value="meeting">Meeting</option>
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="time"
                      name="startTime"
                      defaultValue={selectedEvent ? selectedEvent.startTime : newEventTime}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="time"
                      name="endTime"
                      defaultValue={selectedEvent ? selectedEvent.endTime : format(addHours(parseISO(`${format(newEventDate, 'yyyy-MM-dd')}T${newEventTime}`), 1), 'HH:mm')}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={() => {
                      setEvents(events.filter(e => e.id !== selectedEvent.id));
                      setShowEventModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

