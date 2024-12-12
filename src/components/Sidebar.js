import React from 'react';

const Sidebar = ({ onFilterChange, activeFilters }) => {
  const filters = ['personal', 'work', 'family'];

  return (
    <aside className="w-64 bg-white p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Calendar</h2>
      <ul className="space-y-2">
        {filters.map((filter) => (
          <li key={filter}>
            <button
              className={`w-full text-left px-2 py-1 rounded ${
                activeFilters.includes(filter) ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
              onClick={() => onFilterChange(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

