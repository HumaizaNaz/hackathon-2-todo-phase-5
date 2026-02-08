import React, { useState } from 'react';
import { TaskBase, ReminderSettings } from '../../../backend/src/models/task'; // Adjust path as needed

interface TaskDetailsFormProps {
  onDetailsChange: (details: Partial<TaskBase>) => void;
  initialDetails?: Partial<TaskBase>;
}

const TaskDetailsForm: React.FC<TaskDetailsFormProps> = ({ onDetailsChange, initialDetails }) => {
  const [dueDate, setDueDate] = useState(initialDetails?.dueDate ? new Date(initialDetails.dueDate).toISOString().split('T')[0] : '');
  const [reminderEnabled, setReminderEnabled] = useState(initialDetails?.reminderSettings?.enabled || false);
  const [reminderTime, setReminderTime] = useState(initialDetails?.reminderSettings?.reminderTime || '1h');
  const [priority, setPriority] = useState(initialDetails?.priority || 'Medium');
  const [tagsInput, setTagsInput] = useState(initialDetails?.tags?.join(', ') || '');


  React.useEffect(() => {
    const details: Partial<TaskBase> = {
      dueDate: dueDate ? new Date(dueDate) : undefined,
      reminderSettings: {
        enabled: reminderEnabled,
        reminderTime: reminderEnabled ? reminderTime : undefined,
        notificationMethod: 'in-app', // Default for now
      },
      priority: priority,
      tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    };
    onDetailsChange(details);
  }, [dueDate, reminderEnabled, reminderTime, priority, tagsInput]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mb-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-2">Task Details</h3>
      
      <div className="mb-3">
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="e.g., work, urgent, home"
        />
      </div>

      <h3 className="text-lg font-medium mb-2 mt-4">Due Date & Reminders</h3>
      
      <div className="mb-3">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <input
          type="checkbox"
          id="reminderEnabled"
          checked={reminderEnabled}
          onChange={(e) => setReminderEnabled(e.target.checked)}
          className="form-checkbox"
        />
        <label htmlFor="reminderEnabled" className="text-sm font-medium text-gray-700">Enable Reminder</label>
      </div>

      {reminderEnabled && (
        <div className="mb-3">
          <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700">Remind Me</label>
          <select
            id="reminderTime"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="15m">15 minutes before</option>
            <option value="30m">30 minutes before</option>
            <option value="1h">1 hour before</option>
            <option value="1d">1 day before</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default TaskDetailsForm;