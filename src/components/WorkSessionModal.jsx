import { useState, useEffect } from 'react';
import { workSessionAPI, salaryTypeAPI } from '../services/api';
import { formatDate } from '../utils/dateUtils';

const WorkSessionModal = ({ isOpen, onClose, date, onSuccess, existingSessions = [] }) => {
  const [sessions, setSessions] = useState([
    { startTime: '09:00', endTime: '17:00', salaryTypeId: null }
  ]);
  const [salaryTypes, setSalaryTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSalaryTypes();
      if (existingSessions.length > 0) {
        setSessions(existingSessions.map(s => ({
          id: s.id,
          startTime: s.startTime,
          endTime: s.endTime,
          salaryTypeId: s.salaryTypeId
        })));
      } else {
        setSessions([{ startTime: '09:00', endTime: '17:00', salaryTypeId: null }]);
      }
    }
  }, [isOpen, existingSessions]);

  const loadSalaryTypes = async () => {
    try {
      const response = await salaryTypeAPI.getAll();
      setSalaryTypes(response.data);
      if (response.data.length > 0 && sessions[0].salaryTypeId === null) {
        setSessions([{ ...sessions[0], salaryTypeId: response.data[0].id }]);
      }
    } catch (err) {
      setError('Failed to load salary types');
    }
  };

  const addSession = () => {
    setSessions([
      ...sessions,
      { startTime: '09:00', endTime: '17:00', salaryTypeId: salaryTypes[0]?.id || null }
    ]);
  };

  const removeSession = (index) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  const updateSession = (index, field, value) => {
    const newSessions = [...sessions];
    newSessions[index][field] = value;
    setSessions(newSessions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Delete removed sessions
      const existingIds = existingSessions.map(s => s.id);
      const currentIds = sessions.filter(s => s.id).map(s => s.id);
      const toDelete = existingIds.filter(id => !currentIds.includes(id));
      
      for (const id of toDelete) {
        await workSessionAPI.delete(id);
      }

      // Create or update sessions
      for (const session of sessions) {
        const data = {
          workDate: formatDate(date),
          startTime: session.startTime,
          endTime: session.endTime,
          salaryTypeId: parseInt(session.salaryTypeId)
        };

        if (session.id) {
          await workSessionAPI.update(session.id, data);
        } else {
          await workSessionAPI.create(data);
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save work sessions');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          Work Sessions - {formatDate(date, 'MMM dd, yyyy')}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            {sessions.map((session, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">Period {index + 1}</h3>
                  {sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSession(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={session.startTime}
                      onChange={(e) => updateSession(index, 'startTime', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={session.endTime}
                      onChange={(e) => updateSession(index, 'endTime', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Type
                  </label>
                  <select
                    value={session.salaryTypeId || ''}
                    onChange={(e) => updateSession(index, 'salaryTypeId', e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select salary type</option>
                    {salaryTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - ¥{type.hourlyRate}/h
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSession}
            className="btn-secondary w-full mb-4"
          >
            + Add Another Period
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkSessionModal;
