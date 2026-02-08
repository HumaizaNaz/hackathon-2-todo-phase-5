import React, { useState } from 'react';
import { RecurrencePatternCreate } from '../../../backend/src/models/task'; // Adjust path as needed

interface RecurringTaskFormProps {
  onRecurrenceChange: (recurrence: RecurrencePatternCreate | null) => void;
  initialRecurrence?: RecurrencePatternCreate | null;
}

const RecurringTaskForm: React.FC<RecurringTaskFormProps> = ({ onRecurrenceChange, initialRecurrence }) => {
  const [isRecurring, setIsRecurring] = useState(!!initialRecurrence);
  const [frequency, setFrequency] = useState(initialRecurrence?.frequency || 'daily');
  const [interval, setInterval] = useState(initialRecurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(initialRecurrence?.daysOfWeek || []);
  const [startDate, setStartDate] = useState(initialRecurrence?.startDate ? new Date(initialRecurrence.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);

  const handleToggleRecurring = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRecurring(e.target.checked);
    if (!e.target.checked) {
      onRecurrenceChange(null);
    } else {
      updateRecurrencePattern();
    }
  };

  const updateRecurrencePattern = () => {
    if (isRecurring) {
      const pattern: RecurrencePatternCreate = {
        frequency,
        interval,
        startDate: new Date(startDate),
        daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
        // Add other frequency-specific fields as needed
      };
      onRecurrenceChange(pattern);
    }
  };

  React.useEffect(() => {
    updateRecurrencePattern();
  }, [isRecurring, frequency, interval, daysOfWeek, startDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDayToggle = (dayIndex: number) => {
    setDaysOfWeek(prev => 
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex].sort()
    );
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="mb-4 p-4 border rounded-md">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={handleToggleRecurring}
          className="form-checkbox"
        />
        <span>Make this a recurring task</span>
      </label>

      {isRecurring && (
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              {/* <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option> */}
            </select>
          </div>

          <div>
            <label htmlFor="interval" className="block text-sm font-medium text-gray-700">Repeat every</label>
            <input
              type="number"
              id="interval"
              value={interval}
              onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          {frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Repeat on</label>
              <div className="flex flex-wrap gap-2">
                {days.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(index)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      daysOfWeek.includes(index)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          {/* Add fields for endDate, numberOfOccurrences, monthly/yearly specifics as needed */}
        </div>
      )}
    </div>
  );
};

export default RecurringTaskForm;