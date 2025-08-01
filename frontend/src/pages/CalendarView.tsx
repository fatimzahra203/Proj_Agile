import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// This component will simulate FullCalendar until the packages are installed
// Once @fullcalendar/react and other packages are installed, you should replace this with the actual FullCalendar implementation

interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  assignee?: {
    id: string;
    name: string;
  };
}

interface CalendarEvent {
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

  // Get first day of month
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // Get last day of month
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  // Get first day of calendar (might be in previous month)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  // Get array of weeks
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

  // Month name and year
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // Get color for task based on status
  const getTaskColor = (status: string): { bgColor: string, textColor: string } => {
    switch (status.toLowerCase()) {
      case 'todo':
      case 'tasks':
        return { bgColor: 'bg-gray-200', textColor: 'text-gray-800' };
      case 'ready':
        return { bgColor: 'bg-amber-200', textColor: 'text-amber-800' };
      case 'ongoing':
      case 'in progress':
        return { bgColor: 'bg-blue-200', textColor: 'text-blue-800' };
      case 'onhold':
        return { bgColor: 'bg-red-200', textColor: 'text-red-800' };
      case 'done':
      case 'completed':
        return { bgColor: 'bg-green-200', textColor: 'text-green-800' };
      default:
        return { bgColor: 'bg-gray-200', textColor: 'text-gray-800' };
    }
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Check if a date has events
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Populate calendar with mock data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Mock tasks data - purely front-end, no database connection
    // Create mock tasks with dates from current month and nearby dates
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Generate some dates in current month
    const getRandomDate = (year: number, month: number) => {
      const day = Math.floor(Math.random() * 28) + 1; // Avoiding potential month overflow issues
      return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    };
    
    // Create tasks for current month and nearby dates
    const mockTasks: Task[] = [
      { id: '1', title: 'Design login page', status: 'todo', dueDate: getRandomDate(currentYear, currentMonth), assignee: { id: '1', name: 'John Doe' } },
      { id: '2', title: 'Implement authentication', status: 'ready', dueDate: getRandomDate(currentYear, currentMonth), assignee: { id: '2', name: 'Jane Smith' } },
      { id: '3', title: 'Create dashboard layout', status: 'ongoing', dueDate: getRandomDate(currentYear, currentMonth), assignee: { id: '3', name: 'Mike Johnson' } },
      { id: '4', title: 'Fix responsive issues', status: 'onhold', dueDate: getRandomDate(currentYear, currentMonth), assignee: { id: '4', name: 'Sarah Williams' } },
      { id: '5', title: 'Unit testing', status: 'done', dueDate: getRandomDate(currentYear, currentMonth), assignee: { id: '5', name: 'Chris Martin' } },
      { id: '6', title: 'API integration', status: 'todo', dueDate: getRandomDate(currentYear, currentMonth), assignee: { id: '6', name: 'Emily Brown' } },
      { id: '7', title: 'Documentation', status: 'ready', dueDate: getRandomDate(currentYear, currentMonth - 1), assignee: { id: '7', name: 'Alex Wilson' } },
      { id: '8', title: 'Deployment setup', status: 'ongoing', dueDate: getRandomDate(currentYear, currentMonth), assignee: { id: '8', name: 'David Miller' } },
      { id: '9', title: 'Performance optimization', status: 'todo', dueDate: getRandomDate(currentYear, currentMonth), assignee: { id: '9', name: 'Linda Garcia' } },
      { id: '10', title: 'Create user profiles', status: 'ongoing', dueDate: getRandomDate(currentYear, currentMonth), assignee: { id: '3', name: 'Mike Johnson' } },
      { id: '11', title: 'Review pull requests', status: 'ready', dueDate: getRandomDate(currentYear, currentMonth), assignee: { id: '1', name: 'John Doe' } },
      { id: '12', title: 'Set up CI/CD', status: 'done', dueDate: getRandomDate(currentYear, currentMonth - 1), assignee: { id: '8', name: 'David Miller' } },
      { id: '13', title: 'Client presentation', status: 'onhold', dueDate: getRandomDate(currentYear, currentMonth), assignee: { id: '2', name: 'Jane Smith' } },
      { id: '14', title: 'Update README', status: 'todo', dueDate: getRandomDate(currentYear, currentMonth + 1), assignee: { id: '7', name: 'Alex Wilson' } },
      { id: '15', title: 'Release v1.0', status: 'ready', dueDate: getRandomDate(currentYear, currentMonth + 1), assignee: { id: '3', name: 'Mike Johnson' } },
    ];
        
    setTasks(mockTasks);
    
    // Convert tasks to calendar events
    const calendarEvents: CalendarEvent[] = mockTasks.map(task => {
      const { bgColor, textColor } = getTaskColor(task.status);
      return {
        id: task.id,
        title: task.title,
        date: task.dueDate,
        color: bgColor.replace('bg-', ''),
        textColor: textColor.replace('text-', ''),
        status: task.status
      };
    });
    
    setEvents(calendarEvents);
    setIsLoading(false);
  }, []);

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
            <Link to="/" className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-3 py-1.5 text-sm rounded-lg shadow-sm">
              Back to Projects
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-8">
        {/* Calendar Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{monthName} {year}</h2>
            
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
                  <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                      <div className={`text-right mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dateEvents.map(event => {
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
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : tasks.length === 0 ? (
            <div className="text-gray-500 py-4 text-center">No tasks found</div>
          ) : (
            <div className="divide-y">
              {tasks.map(task => {
                const { bgColor, textColor } = getTaskColor(task.status);
                return (
                  <div key={task.id} className="py-3 flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                      {task.assignee && <div className="text-xs text-gray-400">Assignee: {task.assignee.name}</div>}
                    </div>
                    <div className={`${bgColor} ${textColor} text-xs px-2 py-1 rounded`}>
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
