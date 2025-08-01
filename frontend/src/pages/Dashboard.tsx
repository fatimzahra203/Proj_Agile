import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiCalendar, FiList, FiUsers, FiFile, FiPlus, FiCheck } from 'react-icons/fi';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface Notification {
  id: string;
  type: 'comment' | 'milestone' | 'joined' | 'deadline';
  message: string;
  project: string;
  time: string;
}

interface Project {
  id: string;
  name: string;
  sector: string;
  date: string;
  team: TeamMember[];
  tasks?: Task[];
  progress?: number;
}

// Helper function to generate chart data
const generateChartData = (view: 'weekly' | 'monthly', completionRate: number = 0.65) => {
  // For actual implementation, this would come from real data
  // Here we're simulating progress data
  
  // Define start and target values
  const startProgress = view === 'weekly' ? 10 : 5; 
  const targetProgress = completionRate * 100;
  
  // Generate data points with some randomness to simulate real progress
  const actualDataPoints = [];
  const expectedDataPoints = [];
  
  const pointCount = 6; // 6 data points (weeks or months)
  
  for (let i = 0; i < pointCount; i++) {
    const progress = startProgress + ((targetProgress - startProgress) * i) / (pointCount - 1);
    // Add some randomness to actual progress
    const randomFactor = view === 'weekly' ? Math.random() * 10 - 5 : Math.random() * 6 - 3;
    const actual = Math.max(0, Math.min(100, progress + randomFactor));
    
    // Expected is a smooth progression
    const expected = startProgress + ((100 - startProgress) * i) / (pointCount - 1);
    
    // Convert to chart coordinates (SVG Y is inverted)
    const actualY = 200 - (actual * 2);
    const expectedY = 200 - (expected * 2);
    const x = (i * 500) / (pointCount - 1);
    
    actualDataPoints.push([x, actualY]);
    expectedDataPoints.push([x, expectedY]);
  }
  
  return {
    actual: {
      points: actualDataPoints.map(p => p.join(',')).join(' '),
      circles: actualDataPoints
    },
    expected: {
      points: expectedDataPoints.map(p => p.join(',')).join(' ')
    }
  };
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Finalize Q3 roadmap', dueDate: 'today', completed: false },
    { id: '2', title: 'Review team performance', dueDate: 'tomorrow', completed: false },
    { id: '3', title: 'Prepare client presentation', dueDate: 'in 2 days', completed: false },
    { id: '4', title: 'Update resource allocation', dueDate: 'in 3 days', completed: false },
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'comment', message: 'New comment on', project: 'Website Redesign', time: '1 hour ago' },
    { id: '2', type: 'milestone', message: 'Mobile App completed', project: '', time: '3 hours ago' },
    { id: '3', type: 'joined', message: 'James Wilson joined', project: 'UX design', time: 'Yesterday' },
    { id: '4', type: 'deadline', message: 'API Integration approaching', project: '', time: 'in 2 days' },
  ]);
  const [activeView, setActiveView] = useState<'weekly' | 'monthly'>('weekly');
  
  // Generate chart data based on the active view
  const chartData = generateChartData(activeView, project?.progress ? project.progress / 100 : 0.65);
  
  useEffect(() => {
    // Check if we have project data in the location state
    if (location.state?.selectedProject) {
      setProject(location.state.selectedProject);
    }
  }, [location]);
  
  // If no project data is available, show a message or redirect
  useEffect(() => {
    if (!location.state?.selectedProject && !project) {
      // Could add a timeout before redirecting
      // setTimeout(() => {
      //   navigate('/');
      // }, 3000);
    }
  }, [location.state, project, navigate]);
  
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo2.png" alt="AgileFlow Logo" className="h-10 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">AgileFlow</h1>
              {project && (
                <p className="text-sm text-blue-600">
                  Project: <span className="font-medium">{project.name}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/kanban" state={{ projectData: project }} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded-lg shadow-sm">View Kanban</Link>
            <Link to="/" className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-3 py-1.5 text-sm rounded-lg shadow-sm">Back to Projects</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-4 pb-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Tasks Due Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tasks Due Today</h3>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-blue-600">{tasks.filter(t => t.dueDate === 'today').length}</div>
              <div className="text-sm text-gray-500">{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}% complete</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Team Members Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Team Members</h3>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-blue-600">
                {project ? project.team.length : 12}
              </div>
              <div className="flex -space-x-2">
                {(project ? project.team : [{id: '1', name: 'John D'}, {id: '2', name: 'Sarah M'}]).slice(0, 2).map((member, i) => (
                  <div 
                    key={member.id}
                    className="h-8 w-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center"
                    title={member.name}
                  >
                    <span className="text-xs text-white font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Upcoming Deadlines Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Upcoming Deadlines</h3>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-blue-600">{tasks.filter(t => t.dueDate !== 'today' && !t.completed).length}</div>
              <div>
                <div className="text-xs text-gray-500">Next:</div>
                <div className="text-sm font-medium">Website Redesign</div>
                <div className="text-xs text-gray-500">Due in 2 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Progress */}
          <div className="lg:col-span-2">
            {/* Project Progress Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Project Progress</h3>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button 
                    onClick={() => setActiveView('weekly')}
                    className={`px-3 py-1 text-sm ${activeView === 'weekly' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setActiveView('monthly')}
                    className={`px-3 py-1 text-sm ${activeView === 'monthly' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              
              {/* Project Progress Chart */}
              <div className="h-64 w-full bg-gray-50 border border-gray-200 rounded-lg p-4 relative">
                {/* Chart Legend */}
                <div className="flex items-center justify-end mb-2 text-xs">
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                    <span>Completed Tasks</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-sm mr-1"></div>
                    <span>Expected Progress</span>
                  </div>
                </div>
                
                {/* Chart Grid */}
                <div className="absolute left-12 right-4 top-12 bottom-8 grid grid-cols-6 grid-rows-5">
                  {/* Horizontal Grid Lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div 
                      key={`h-line-${i}`} 
                      className="col-span-6 border-t border-gray-200"
                    ></div>
                  ))}
                  
                  {/* Vertical Grid Lines */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={`v-line-${i}`} 
                      className="row-span-5 border-l border-gray-200"
                    ></div>
                  ))}
                </div>
                
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-600">
                  <div className="text-right pr-2">100%</div>
                  <div className="text-right pr-2">80%</div>
                  <div className="text-right pr-2">60%</div>
                  <div className="text-right pr-2">40%</div>
                  <div className="text-right pr-2">20%</div>
                  <div className="text-right pr-2">0%</div>
                </div>
                
                {/* X-Axis Labels */}
                <div className="absolute left-12 right-4 bottom-0 h-8 flex justify-between text-xs text-gray-600">
                  {activeView === 'weekly' ? (
                    <>
                      <div className="text-center">Week 1</div>
                      <div className="text-center">Week 2</div>
                      <div className="text-center">Week 3</div>
                      <div className="text-center">Week 4</div>
                      <div className="text-center">Week 5</div>
                      <div className="text-center">Week 6</div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">Jan</div>
                      <div className="text-center">Feb</div>
                      <div className="text-center">Mar</div>
                      <div className="text-center">Apr</div>
                      <div className="text-center">May</div>
                      <div className="text-center">Jun</div>
                    </>
                  )}
                </div>
                
                {/* Chart Data - Blue Line (Completed Tasks) */}
                <svg className="absolute left-12 right-4 top-12 bottom-8 z-10" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <polyline
                    points={chartData.actual.points}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Data Points */}
                  {chartData.actual.circles.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="5" fill="#3b82f6" />
                  ))}
                </svg>
                
                {/* Chart Data - Amber Line (Expected Progress) */}
                <svg className="absolute left-12 right-4 top-12 bottom-8" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <polyline
                    points={chartData.expected.points}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            
            {/* Quick Links Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link 
                  to="/calendar" 
                  className="bg-blue-500 text-white rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-blue-600 transition"
                >
                  <FiCalendar size={24} className="mb-2" />
                  <span className="text-sm font-medium">Calendar View</span>
                </Link>
                <Link 
                  to="/kanban" 
                  state={{ projectData: project }}
                  className="bg-blue-500 text-white rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-blue-600 transition"
                >
                  <FiList size={24} className="mb-2" />
                  <span className="text-sm font-medium">Kanban Board</span>
                </Link>
                <Link 
                  to="/users" 
                  className="bg-blue-500 text-white rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-blue-600 transition"
                >
                  <FiUsers size={24} className="mb-2" />
                  <span className="text-sm font-medium">User Management</span>
                </Link>
                <Link 
                  to="/reports" 
                  className="bg-blue-500 text-white rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-blue-600 transition"
                >
                  <FiFile size={24} className="mb-2" />
                  <span className="text-sm font-medium">Reports</span>
                </Link>
              </div>
            </div>
            
            {/* Team Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-medium">ER</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">Emily Rodriguez</span>
                        <span className="text-gray-600 text-sm"> completed the UI design task</span>
                      </div>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-medium">DK</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">David Kim</span>
                        <span className="text-gray-600 text-sm"> added comments to API documentation</span>
                      </div>
                      <span className="text-xs text-gray-500">4 hours ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-medium">SM</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">Sophia Martinez</span>
                        <span className="text-gray-600 text-sm"> created a new test case</span>
                      </div>
                      <span className="text-xs text-gray-500">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - My Tasks & Notifications */}
          <div className="space-y-6">
            {/* My Tasks */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">My Tasks</h3>
                <button className="bg-blue-500 text-white rounded-lg p-1.5 hover:bg-blue-600">
                  <FiPlus size={18} />
                </button>
              </div>
              
              <div className="space-y-2">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`p-3 rounded-lg border ${task.completed ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="pt-0.5">
                        <input 
                          type="checkbox" 
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
                        />
                      </div>
                      <div>
                        <p className={`font-medium ${task.completed ? 'text-blue-700' : 'text-gray-800'}`}>{task.title}</p>
                        <p className="text-xs text-gray-500">Due {task.dueDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-blue-500 text-sm font-medium hover:text-blue-700">
                  View all tasks
                </button>
              </div>
            </div>
            
            {/* Recent Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">New comment</span> on <span className="font-medium">Website Redesign</span>
                    </p>
                    <p className="text-xs text-gray-500">Website</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Mobile App completed</span>
                    </p>
                    <p className="text-xs text-gray-500">milestone</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">James Wilson joined</span> the team
                    </p>
                    <p className="text-xs text-gray-500">joined</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">API Integration</span> deadline approaching
                    </p>
                    <p className="text-xs text-gray-500">deadline</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-blue-500 text-sm font-medium hover:text-blue-700">
                  View all notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
