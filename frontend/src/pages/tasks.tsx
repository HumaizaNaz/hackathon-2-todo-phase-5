import React, { useEffect, useState } from 'react';
import { TaskRead, TaskCreate, ReminderSettings } from '../../../backend/src/models/task'; // Adjust path as needed
import { fetchTasks, createTask } from '../services/task_api';
import RecurringTaskForm from '../components/RecurringTaskForm';
import TaskDetailsForm from '../components/TaskDetailsForm'; // Import the new component
import TaskListControls from '../components/TaskListControls'; // Import TaskListControls

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskRead[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isRecurringTask, setIsRecurringTask] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<TaskCreate['recurrencePattern'] | null>(null);
  const [taskDetails, setTaskDetails] = useState<Partial<TaskCreate>>({}); // State for TaskDetailsForm
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for TaskListControls
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ status?: string; priority?: string; tag?: string }>({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetchTasks({ // Pass params to fetchTasks
          search: searchTerm,
          status: filters.status,
          priority: filters.priority,
          tag: filters.tag,
          sortBy: sortBy,
          sortOrder: sortOrder,
        });
        setTasks(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, [searchTerm, filters, sortBy, sortOrder]); // Re-fetch when these change

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newTaskTitle.trim()) {
      setError('Task title cannot be empty.');
      return;
    }

    try {
      const taskData: TaskCreate = {
        title: newTaskTitle,
        description: newTaskDescription,
        ...taskDetails, // Spread taskDetails here
        recurrencePattern: isRecurringTask ? recurrencePattern : undefined,
        // Default values for status, priority, tags are now handled by TaskDetailsForm if needed, or by backend
      };
      
      const response = await createTask(taskData);
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsRecurringTask(false);
      setRecurrencePattern(null);
      setTaskDetails({}); // Reset task details form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  if (loading) return <div className="p-4">Loading tasks...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      <form onSubmit={handleCreateTask} className="mb-8 p-4 border rounded-md shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Create New Task</h2>
        <div className="mb-4">
          <label htmlFor="newTaskTitle" className="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            type="text"
            id="newTaskTitle"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newTaskDescription" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="newTaskDescription"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <TaskDetailsForm onDetailsChange={setTaskDetails} initialDetails={taskDetails} /> {/* New component */}

        <RecurringTaskForm 
          onRecurrenceChange={(pattern) => {
            setRecurrencePattern(pattern);
            setIsRecurringTask(!!pattern);
          }} 
        />

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Task
        </button>
      </form>

      <TaskListControls // New TaskListControls component
        onSearchChange={setSearchTerm}
        onFilterChange={setFilters}
        onSortChange={(sb, so) => { setSortBy(sb); setSortOrder(so); }}
        initialSearch={searchTerm}
        initialFilters={filters}
        initialSortBy={sortBy}
        initialSortOrder={sortOrder}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            {task.description && <p className="text-gray-600 text-sm mt-1">{task.description}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.status}
              </span>
              {task.priority && (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  task.priority === 'High' ? 'bg-red-100 text-red-800' :
                  task.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.priority}
                </span>
              )}
              {task.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                  {tag}
                </span>
              ))}
            </div>
            {task.dueDate && (
              <p className="text-sm text-gray-500 mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            )}
            {task.recurrencePatternId && (
              <p className="text-xs text-indigo-500 mt-1">Recurring Task</p>
            )}
            {task.parentTaskId && (
              <p className="text-xs text-indigo-500 mt-1">Instance of {task.parentTaskId.substring(0, 8)}...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;

