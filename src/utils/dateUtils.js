import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  return format(date, formatStr);
};

export const getCalendarDays = (year, month) => {
  const firstDay = startOfMonth(new Date(year, month - 1));
  const lastDay = endOfMonth(new Date(year, month - 1));
  
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  
  const firstDayOfWeek = getDay(firstDay);
  const paddingDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  const calendarDays = [
    ...Array(paddingDays).fill(null),
    ...days,
  ];
  
  return calendarDays;
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

export const parseTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  return { hours: parseInt(hours), minutes: parseInt(minutes) };
};

export const calculateHours = (startTime, endTime) => {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  
  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;
  
  return (endMinutes - startMinutes) / 60;
};
