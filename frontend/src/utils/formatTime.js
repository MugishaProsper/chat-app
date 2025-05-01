export const formatTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const diffInMinutes = Math.floor(diff / 1000 / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // If less than 24 hours ago, show time in HH:mm format
  if (diffInDays < 1) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  // If within the last week, show day name
  if (diffInDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Otherwise show date in DD/MM/YY format
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
}; 