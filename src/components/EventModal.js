import React, { useState } from 'react';
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';

const EventModal = ({ isOpen, onClose, onSave, selectedDate, eventToEdit }) => {
  const [title, setTitle] = useState(eventToEdit ? eventToEdit.title : '');
  const [description, setDescription] = useState(eventToEdit ? eventToEdit.description : '');
  const [eventType, setEventType] = useState(eventToEdit ? eventToEdit.eventType : 'personal');
  const [startTime, setStartTime] = useState(eventToEdit ? eventToEdit.startTime : '09:00');
  const [endTime, setEndTime] = useState(eventToEdit ? eventToEdit.endTime : '10:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: eventToEdit ? eventToEdit.id : Date.now(),
      title,
      description,
      date: selectedDate,
      eventType,
      startTime,
      endTime
    });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">
            {eventToEdit ? 'Edit Event' : 'Add Event'} for {format(selectedDate, 'MMMM d, yyyy')}
          </Dialog.Title>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <select
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="family">Family</option>
              </select>
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-dark"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EventModal;

