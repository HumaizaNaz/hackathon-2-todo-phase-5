import React, { useState } from 'react';

interface TaskListControlsProps {
  onSearchChange: (searchTerm: string) => void;
  onFilterChange: (filters: { status?: string; priority?: string; tag?: string }) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  initialSearch?: string;
  initialFilters?: { status?: string; priority?: string; tag?: string };
  initialSortBy?: string;
  initialSortOrder?: 'asc' | 'desc';
}

const TaskListControls: React.FC<TaskListControlsProps> = ({
  onSearchChange,
  onFilterChange,
  onSortChange,
  initialSearch = '',
  initialFilters = {},
  initialSortBy = 'createdAt',
  initialSortOrder = 'asc',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialFilters.status || '');
  const [priorityFilter, setPriorityFilter] = useState(initialFilters.priority || '');
  const [tagFilter, setTagFilter] = useState(initialFilters.tag || '');
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

  React.useEffect(() => {
    onSearchChange(searchTerm);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    onFilterChange({ status: statusFilter, priority: priorityFilter, tag: tagFilter });
  }, [statusFilter, priorityFilter, tagFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    onSortChange(sortBy, sortOrder);
  }, [sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handlePriorityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value);
  };

  const handleTagFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagFilter(e.target.value);
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
  };

  return (
    <div className="mb-6 p-4 border rounded-md shadow-sm bg-gray-50">
      <h2 className="text-xl font-semibold mb-3">Task Controls</h2>

      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Tasks</label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search by title or description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700">Filter by Priority</label>
          <select
            id="priorityFilter"
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <label htmlFor="tagFilter" className="block text-sm font-medium text-gray-700">Filter by Tag</label>
          <input
            type="text"
            id="tagFilter"
            value={tagFilter}
            onChange={handleTagFilterChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., work"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortByChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="createdAt">Creation Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">Sort Order</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskListControls;
