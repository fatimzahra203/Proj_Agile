import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiEdit2, FiTrash2, FiPlus, FiX, FiUser } from 'react-icons/fi';

interface TeamMember {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  sector: string;
  date: string;
  team: TeamMember[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Redesign',
      sector: 'Web Development',
      date: '2025-08-15',
      team: [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Smith' }]
    },
    {
      id: '2',
      name: 'Mobile App Launch',
      sector: 'Mobile Development',
      date: '2025-09-01',
      team: [{ id: '3', name: 'Alex Johnson' }, { id: '4', name: 'Sam Wilson' }]
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      sector: 'Marketing',
      date: '2025-08-20',
      team: [{ id: '5', name: 'Emma Brown' }]
    }
  ]);
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // This would be replaced with actual API calls
  useEffect(() => {
    // fetch projects from API
    // setProjects(data)
  }, []);

  const handleMenuToggle = (projectId: string) => {
    if (activeMenu === projectId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(projectId);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    // API call would go here
    setProjects(projects.filter(project => project.id !== projectId));
    setActiveMenu(null);
  };

  const handleEditProject = (project: Project) => {
    // Navigate to edit page or open edit modal
    console.log("Edit project", project);
    setActiveMenu(null);
  };

  const handleViewDashboard = (projectId: string) => {
    // Find the selected project by ID
    const selectedProject = projects.find(project => project.id === projectId);
    // Navigate to dashboard with project data as state
    navigate(`/dashboard`, { state: { selectedProject } });
  };

  const handleAddProject = () => {
    // Navigate to the project form page
    navigate('/project-form');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/logo2.png" alt="AgileFlow Logo" className="h-8 w-8 mr-2" />
              <h1 className="text-lg font-bold">AgileFlow</h1>
            </div>
            <div className="bg-blue-500 rounded-full h-6 w-6 flex items-center justify-center">
              <span className="font-medium text-xs">JD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Welcome to AgileFlow</h2>
          <p className="text-gray-600 mt-2 text-center">
            Manage your projects efficiently with our agile project management tools.
          </p>
        </div>

        {/* Projects list */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700">Your Projects</h3>
            <button 
              onClick={handleAddProject}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FiPlus /> Add Project
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 cursor-pointer" onClick={() => handleViewDashboard(project.id)}>
                        {project.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {project.sector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(project.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member, index) => (
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
                        {project.team.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600 font-medium">
                              +{project.team.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button 
                        onClick={() => handleMenuToggle(project.id)}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <FiMoreVertical size={20} />
                      </button>
                      
                      {activeMenu === project.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleEditProject(project)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FiEdit2 className="mr-2" /> Edit Project
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              <FiTrash2 className="mr-2" /> Delete Project
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {projects.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No projects yet. Create your first project to get started!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;