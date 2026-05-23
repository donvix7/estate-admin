/**
 * Standardizes date formatting across the platform.
 * Converts various date formats (ISO, YYYY-MM-DD, etc.) into a consistent "MMM DD, YYYY" string.
 * @param {string|Date} dateInput 
 * @returns {string} Standardized date string
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '—';
  
  const date = new Date(dateInput);
  
  if (isNaN(date.getTime())) {
    // If it's already a formatted string like "Oct 12, 2019", return it
    return dateInput;
  }
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
};

/**
 * Converts a date string into a "time ago" format.
 * @param {string|Date} dateInput 
 * @returns {string} Human-readable relative time string
 */
export const timeAgo = (dateInput) => {
  if (!dateInput) return '—';
  
  const date = new Date(dateInput);
  const now = new Date();
  
  if (isNaN(date.getTime())) return '—';
  
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
  
  return 'Just now';
};
