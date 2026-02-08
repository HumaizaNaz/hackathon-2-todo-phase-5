import axios from 'axios';
import { TaskRead, TaskCreate } from '../../../backend/src/models/task'; // Adjust path as needed

// Assuming your backend is running on process.env.NEXT_PUBLIC_BACKEND_URL or similar
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface APIResponse<T> {
  data: T;
  message?: string;
}

export const createTask = async (taskData: TaskCreate): Promise<APIResponse<TaskRead>> => {
  try {
    const response = await axios.post<TaskRead>(`${API_BASE_URL}/tasks`, taskData);
    return { data: response.data, message: "Task created successfully!" };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Failed to create task');
    }
    throw new Error('An unexpected error occurred while creating the task');
  }
};

// Placeholder for other task API interactions (e.g., fetch tasks, update tasks)
interface FetchTasksParams {
  search?: string;
  status?: string;
  priority?: string;
  tag?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
}

export const fetchTasks = async (params?: FetchTasksParams): Promise<APIResponse<TaskRead[]>> => {
  try {
    const response = await axios.get<TaskRead[]>(`${API_BASE_URL}/tasks`, { params });
    return { data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Failed to fetch tasks');
    }
    throw new Error('An unexpected error occurred while fetching tasks');
  }
};
