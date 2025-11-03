import { useState, useEffect } from 'react';
import { workSessionAPI } from '../services/api';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

const Summary = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [customSummary, setCustomSummary] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showCustom) {
      loadMonthlySummary();
    }
  }, [currentDate, showCustom]);

  const loadMonthlySummary = async () => {
    setLoading(true);
    try {
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      const response = await workSessionAPI.getSummary(start, end);
      setMonthlySummary(response.data);
    } catch (err) {
      console.error('Failed to load monthly summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomSummary = async () => {
    if (!customStartDate || !customEndDate) return;
    
    setLoading(true);
    try {
      const response = await workSessionAPI.getSummary(customStartDate, customEndDate);
      setCustomSummary(response.data);
    } catch (err) {
      console.error('Failed to load custom summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const exportData = () => {
    const data = showCustom ? customSummary : monthlySummary;
    if (!data) return;

    const csv = `Work Days,Total Hours,Total Salary\n${data.workDays},${data.totalHours},${data.totalSalary}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const SummaryCard = ({ title, data }) => (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {data ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Work Days:</span>
            <span className="text-2xl font-bold">{data.workDays}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Hours:</span>
            <span className="text-2xl font-bold">{parseFloat(data.totalHours || 0).toFixed(2)}h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Salary:</span>
            <span className="text-2xl font-bold text-green-600">¥{parseFloat(data.totalSalary || 0).toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setShowCustom(false)}
            className={!showCustom ? 'btn-primary' : 'btn-secondary'}
          >
            Monthly
          </button>
          <button
            onClick={() => setShowCustom(true)}
            className={showCustom ? 'btn-primary' : 'btn-secondary'}
          >
            Custom Period
          </button>
        </div>

        {!showCustom && (
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="btn-secondary">
              ← Previous Month
            </button>
            <h3 className="text-lg font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <button onClick={handleNextMonth} className="btn-secondary">
              Next Month →
            </button>
          </div>
        )}

        {showCustom && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="col-span-2">
              <button
                onClick={loadCustomSummary}
                disabled={!customStartDate || !customEndDate || loading}
                className="btn-primary w-full"
              >
                Calculate
              </button>
            </div>
          </div>
        )}
      </div>

      {showCustom ? (
        customSummary && <SummaryCard title="Custom Period Summary" data={customSummary} />
      ) : (
        <SummaryCard 
          title={`${format(currentDate, 'MMMM yyyy')} Summary`} 
          data={monthlySummary} 
        />
      )}

      {(monthlySummary || customSummary) && (
        <button onClick={exportData} className="btn-primary w-full">
          Export Report
        </button>
      )}
    </div>
  );
};

export default Summary;