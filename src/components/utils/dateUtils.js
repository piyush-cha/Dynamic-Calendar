export const getEventColor = (eventType) => {
  switch (eventType) {
    case 'personal':
      return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'work':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'family':
      return 'bg-pink-100 border-pink-300 text-pink-800';
    case 'meeting':
      return 'bg-green-100 border-green-300 text-green-800';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

