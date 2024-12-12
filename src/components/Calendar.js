import React, { useState, useEffect } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Share2, Plus, Menu, X } from 'lucide-react';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage';
import MiniCalendar from './MiniCalendar';
import './styles/Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [savedTasks, setSavedTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState('week');
  const [draggedEvent, setDraggedEvent] = useState(null);

  useEffect(() => {
    const savedEvents = loadFromLocalStorage('calendar-events');
    if (savedEvents) setEvents(savedEvents);
    
    const tasks = loadFromLocalStorage('saved-tasks');
    if (tasks) setSavedTasks(tasks);
  }, []);

  useEffect(() => {
    saveToLocalStorage('calendar-events', events);
  }, [events]);

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

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
                {format(weekStart, "MMMM d")} - {format(weekEnd, "d, yyyy")}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={handlePrevWeek}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextWeek}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select 
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="bg-white border rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-full md:min-w-[768px]">
            {/* Days Header */}
            <div className="grid grid-cols-8 bg-white border-b">
              <div className="p-4 border-r"></div>
              {weekDays.map((day) => (
                <div
                  key={day.toString()}
                  className="p-4 text-center border-r last:border-r-0"
                >
                  <div className="text-sm text-gray-500">{format(day, 'EEE')}</div>
                  <div className={`text-xl font-semibold mt-1 ${
                    isSameDay(day, new Date()) ? 'text-blue-600' : ''
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-8">
              {/* Time Column */}
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

              {/* Day Columns */}
              {weekDays.map((day) => (
                <div key={day.toString()} className="border-r last:border-r-0">
                  {timeSlots.map((hour) => (
                    <div
                      key={`${day}-${hour}`}
                      className="h-20 border-b relative"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day, hour)}
                    >
                      {events
                        .filter((event) => 
                          isSameDay(parseISO(event.date), day) &&
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
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEventModal(true);
                            }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, event)}
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
              ))}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => {
            setSelectedEvent(null);
            setShowEventModal(true);
          }}
          className="fixed right-6 bottom-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
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
                setEvents([...events, { ...eventData, id: Date.now().toString() }]);
              }
              
              setShowEventModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="title"
                    placeholder="Event title"
                    defaultValue={selectedEvent?.title}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="date"
                      name="date"
                      defaultValue={selectedEvent?.date || format(currentDate, 'yyyy-MM-dd')}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <select
                      name="type"
                      defaultValue={selectedEvent?.type || 'default'}
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
                      defaultValue={selectedEvent?.startTime || '09:00'}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="time"
                      name="endTime"
                      defaultValue={selectedEvent?.endTime || '10:00'}
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

