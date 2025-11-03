import { useState, useEffect } from 'react';
import { getCalendarDays, formatDate, isToday, isFutureDate } from '../utils/dateUtils';
import { workSessionAPI } from '../services/api';
import WorkSessionModal from './WorkSessionModal';
import { calculateHours } from '../utils/dateUtils';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workSessions, setWorkSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    loadWorkSessions();
  }, [year, month]);

  const loadWorkSessions = async () => {
    setLoading(true);
    try {
      const response = await workSessionAPI.getByMonth(year, month);
      setWorkSessions(response.data);
    } catch (err) {
      console.error('Failed to load work sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    if (!date || isFutureDate(date)) return;
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const getSessionsForDate = (date) => {
    if (!date) return [];
    const dateStr = formatDate(date);
    return workSessions.filter(s => s.workDate === dateStr);
  };

  const calculateDaySalary = (sessions) => {
    return sessions.reduce((total, session) => {
      const hours = calculateHours(session.startTime, session.endTime);
      // We'll need to fetch salary type details separately or include in the session
      return total;
    }, 0);
  };

  const calendarDays = getCalendarDays(year, month);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrevMonth} className="btn-secondary">
          ← Previous
        </button>
        <h2 className="text-2xl font-bold">
          {formatDate(currentDate, 'MMMM yyyy')}
        </h2>
        <button onClick={handleNextMonth} className="btn-secondary">
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {calendarDays.map((date, index) => {
          const sessions = date ? getSessionsForDate(date) : [];
          const totalHours = sessions.reduce((sum, s) => 
            sum + calculateHours(s.startTime, s.endTime), 0
          );
          const isFuture = date && isFutureDate(date);
          const isCurrentDay = date && isToday(date);

          return (
            <div
              key={index}
              onClick={() => !isFuture && handleDateClick(date)}
              className={`
                min-h-[80px] p-2 border rounded-lg
                ${date ? 'bg-white' : 'bg-gray-50'}
                ${!isFuture && date ? 'cursor-pointer hover:bg-blue-50' : ''}
                ${isFuture ? 'opacity-50 cursor-not-allowed' : ''}
                ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
                ${sessions.length > 0 ? 'bg-green-50' : ''}
              `}
            >
              {date && (
                <>
                  <div className="text-right text-sm font-semibold">
                    {date.getDate()}
                  </div>
                  {sessions.length > 0 && (
                    <div className="mt-1 text-xs text-gray-600">
                      <div>{sessions.length} session{sessions.length > 1 ? 's' : ''}</div>
                      <div className="font-semibold">{totalHours.toFixed(1)}h</div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <WorkSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
        existingSessions={selectedDate ? getSessionsForDate(selectedDate) : []}
        onSuccess={loadWorkSessions}
      />
    </div>
  );
};

export default Calendar;
