// Format distance
export const formatDistance = (km) => {
  if (!km) return '';
  return `${parseFloat(km).toFixed(1)} km`;
};

// Availability percentage
export const getAvailabilityPercent = (available, total) => {
  if (!total) return 0;
  return Math.round((available / total) * 100);
};

// Color based on availability
export const getAvailabilityColor = (percent) => {
  if (percent >= 60) return '#22c55e';
  if (percent >= 30) return '#f59e0b';
  return '#ef4444';
};

// Get priority label for OT
export const getOTPriority = (available) => {
  if (available === 0) return { label: 'FULL', color: 'bg-red-100 text-red-600' };
  if (available <= 2) return { label: 'PRIORITY 1', color: 'bg-red-100 text-red-600' };
  return { label: 'AVAILABLE', color: 'bg-green-100 text-green-600' };
};

// Get priority label for Emergency Ward
export const getEWPriority = (available) => {
  if (available === 0) return { label: 'FULL', color: 'bg-red-100 text-red-600' };
  if (available <= 5) return { label: 'PRIORITY 2', color: 'bg-amber-100 text-amber-600' };
  return { label: 'AVAILABLE', color: 'bg-green-100 text-green-600' };
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// Avatar color from name
export const getAvatarColor = (name) => {
  const colors = [
    'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-violet-500',
  ];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[idx];
};

// Truncate text
export const truncate = (str, n = 50) =>
  str?.length > n ? str.slice(0, n) + '…' : str;

// Format time 24h -> 12h
export const to12h = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hour = parseInt(h);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${suffix}`;
};
