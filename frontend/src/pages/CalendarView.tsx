import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const fetchTasks = async (projectId?: number): Promise<Task[]> => {
  const response = await api.get('/tasks', {
    params: projectId ? { projectId } : undefined,
  });
  return response.data;
};

// Récupérer les tâches non assignées
export const fetchUnassignedTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks/unassigned');
  return response.data;
};

// Récupérer les tâches par assigné
export const fetchTasksByAssignee = async (userId: number): Promise<Task[]> => {
  const response = await api.get(`/tasks/assignee/${userId}`);
  return response.data;
};

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  assignee?: {
    id: number;
    name: string;
  } | null;
  project?: {
    id: number;
    name: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color: string;
  textColor: string;
  status: string;
}

const CalendarView: React.FC = () => {
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get('projectId') ? Number(queryParams.get('projectId')) : undefined;
  const userId = queryParams.get('userId') ? Number(queryParams.get('userId')) : undefined;

  // Calendar logic (unchanged)
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  let day = new Date(startDate);
  while (day <= endDate) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const getTaskColor = (status: string): { bgColor: string; textColor: string } => {
    switch (status.toLowerCase()) {
      case 'todo':
        return { bgColor: 'bg-gray-200', textColor: 'text-gray-800' };
      case 'ready':
        return { bgColor: 'bg-amber-200', textColor: 'text-amber-800' };
      case 'ongoing':
        return { bgColor: 'bg-blue-200', textColor: 'text-blue-800' };
      case 'onhold':
        return { bgColor: 'bg-red-200', textColor: 'text-red-800' };
      case 'done':
        return { bgColor: 'bg-green-200', textColor: 'text-green-800' };
      default:
        return { bgColor: 'bg-gray-200', textColor: 'text-gray-800' };
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = formatDate(date);
    return events.filter((event) => event.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };
useEffect(() => {
  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let fetchedTasks: Task[] = [];

      if (projectId) {
        // Always fetch only tasks for the current project
        fetchedTasks = await fetchTasks(projectId);
      } else if (userId) {
        // If no projectId, fallback to user
        fetchedTasks = await fetchTasksByAssignee(userId);
      } else {
        // If neither, show nothing
        fetchedTasks = [];
      }

      console.log('Fetched Tasks:', fetchedTasks);
      console.log('Tasks with dueDate:', fetchedTasks.filter(task => task.dueDate));
      setTasks(fetchedTasks);

      const calendarEvents: CalendarEvent[] = fetchedTasks
        .filter((task) => task.dueDate)
        .map((task) => {
          const { bgColor, textColor } = getTaskColor(task.status);
          return {
            id: task.id.toString(),
            title: task.title,
            date: task.dueDate!.split('T')[0], // Normalize to YYYY-MM-DD
            color: bgColor.replace('bg-', ''),
            textColor: textColor.replace('text-', ''),
            status: task.status,
          };
        });

      console.log('Calendar Events:', calendarEvents);
      setEvents(calendarEvents);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch tasks. Please try again later.';
      console.error('Error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  loadTasks();
  console.log('Current URL:', window.location.href);
  console.log('projectId:', projectId, 'userId:', userId);
}, [projectId, userId, currentDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo2.png" alt="AgileFlow Logo" className="h-10 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">AgileFlow</h1>
              <p className="text-sm text-blue-600">Calendar View</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-3 py-1.5 text-sm rounded-lg shadow-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-8">
        {/* Calendar Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {monthName} {year}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Today
              </button>
              <button
                onClick={previousMonth}
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-gray-200 mr-1"></div>
              <span className="text-xs">To Do</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-amber-200 mr-1"></div>
              <span className="text-xs">Ready</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-blue-200 mr-1"></div>
              <span className="text-xs">In Progress</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-red-200 mr-1"></div>
              <span className="text-xs">On Hold</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-green-200 mr-1"></div>
              <span className="text-xs">Done</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-blue-500">
                  <svg
                    className="animate-spin h-10 w-10"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </div>
            ) : error ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-red-500">{error}</div>
              </div>
            ) : (
              <>
                {/* Days of Week */}
                <div className="grid grid-cols-7 bg-gray-50 border-b">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <div key={idx} className="p-2 text-center font-medium text-gray-600 text-sm">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="grid grid-cols-7 border-b last:border-b-0">
                    {week.map((date, dateIdx) => {
                      const isToday = formatDate(date) === formatDate(new Date());
                      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                      const dateEvents = getEventsForDate(date);

                      return (
                        <div
                          key={dateIdx}
                          className={`min-h-[100px] border-r last:border-r-0 p-1 ${
                            isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                          } ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                        >
                          <div
                            className={`text-right mb-1 ${
                              isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dateEvents.map((event) => {
                              const { bgColor, textColor } = getTaskColor(event.status);
                              return (
                                <div
                                  key={event.id}
                                  className={`${bgColor} ${textColor} text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity hover:shadow`}
                                  title={`${event.title} (${event.status})`}
                                >
                                  {event.title}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Task List for Reference */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">All Tasks</h3>
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="text-blue-500">
                <svg
                  className="animate-spin h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : tasks.length === 0 ? (
            <div className="text-gray-500 py-4 text-center">No tasks found</div>
          ) : (
            <div className="divide-y">
              {tasks.map((task) => {
                const { bgColor, textColor } = getTaskColor(task.status);
                return (
                  <div
                    key={task.id}
                    className="py-3 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">
                        Due:{' '}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : 'No due date'}
                      </div>
                      {task.assignee && (
                        <div className="text-xs text-gray-400">
                          Assignee: {task.assignee.name}
                        </div>
                      )}
                      {task.project && (
                        <div className="text-xs text-gray-400">
                          Project: {task.project.name}
                        </div>
                      )}
                    </div>
                    <div
                      className={`${bgColor} ${textColor} text-xs px-2 py-1 rounded`}
                    >
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CalendarView;