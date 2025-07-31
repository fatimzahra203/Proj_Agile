
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <header className="w-full max-w-7xl flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img src='\logo2.png' alt="AgilePM Logo" className="h-20 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">AgilePM Platform</h1>
        </div>
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Get Started</button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded">Log in</button>
        </div>
      </header>

      <main className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to Your Agile Project Management Solution</h2>
        <p className="text-gray-600 mb-6">Discover how AgilePM can transform your team's productivity with powerful tools designed specifically for Agile methodologies.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Link to="/calendar" className="bg-gray-50 p-4 rounded-lg text-center shadow hover:bg-gray-100 transition">
            <div className="flex justify-center mb-2">
              <span className="text-blue-500 text-3xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Smart Calendar</h3>
            <p className="text-gray-600">Plan sprints, schedule meetings, and track deadlines with our intuitive calendar that integrates with your entire workflow.</p>
            <img src="/calendar.png" alt="Calendar" className="mt-4 w-full h-48 object-cover rounded" />
          </Link>
          <Link to="/kanban" className="bg-gray-50 p-4 rounded-lg text-center shadow hover:bg-gray-100 transition">
            <div className="flex justify-center mb-2">
              <span className="text-blue-500 text-3xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Kanban Board</h3>
            <p className="text-gray-600">Visualize your workflow with customizable Kanban boards that help your team stay focused and track progress in real time.</p>
            <img src="/kanban.png" alt="Kanban Board" className="mt-4 w-full h-48 object-cover rounded" />
          </Link>
          <Link to="/analytics" className="bg-gray-50 p-4 rounded-lg text-center shadow hover:bg-gray-100 transition">
            <div className="flex justify-center mb-2">
              <span className="text-blue-500 text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Project Analytics</h3>
            <p className="text-gray-600">Make data-driven decisions with comprehensive analytics that measure team velocity, sprint burndown, and project health.</p>
            <img src="/analytics.png" alt="Analytics" className="mt-4 w-full h-48 object-cover rounded" />
          </Link>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Teams Love AgilePM</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <span className="text-blue-500 text-2xl mr-2">⏳</span>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Streamlined Agile Processes</h4>
                <p className="text-gray-600">Built-in support for Scrum, Kanban, and hybrid methodologies to match your team's preferred workflow.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 text-2xl mr-2">📈</span>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Increased Productivity</h4>
                <p className="text-gray-600">Teams report up to 40% improvement in delivery times after implementing AgilePM.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 text-2xl mr-2">💬</span>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Enhanced Collaboration</h4>
                <p className="text-gray-600">Real-time updates, comments, and notifications keep everyone aligned and informed.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 text-2xl mr-2">🔗</span>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Seamless Integrations</h4>
                <p className="text-gray-600">Connect with your favorite tools like GitHub, Slack, and Google Workspace.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;