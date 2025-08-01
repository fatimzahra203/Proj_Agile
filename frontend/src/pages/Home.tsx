import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiEdit2, FiTrash2, FiPlus, FiX, FiUser } from 'react-icons/fi';

interface TeamMember {
  id: number;
  username: string | null; // Allow name to be null
}

interface Project {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  wipLimit: number;
  team: TeamMember[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/projects', {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, got ${contentType}: ${text.slice(0, 100)}`);
        }

        const data = await response.json();
        setProjects(data);
        console.log('Fetched projects:', data)
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleMenuToggle = (projectId: number) => {
    if (activeMenu === projectId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(projectId);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete project with ID ${projectId}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setProjects(projects.filter(project => project.id !== projectId));
      setActiveMenu(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEditProject = (project: Project) => {
    navigate(`/projects/${project.id}/edit`, { state: { project } });
    setActiveMenu(null);
  };
  const handleViewDashboard = (projectId: number) => {
    const selectedProject = projects.find(project => project.id === projectId);
    navigate(`/dashboard`, { state: { selectedProject } });
  };

  const handleAddProject = () => {
    navigate('/project-form');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Welcome to AgileFlow</h2>
          <p className="text-gray-600 mt-2 text-center">
            Manage your projects efficiently with our agile project management tools.
          </p>
        </div>

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
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WIP Limit
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
                      {project.description || 'No description'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {project.wipLimit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member, index) => (
  <div 
    key={member.id}
    className="h-8 rounded-full bg-blue-400 border-2 border-white inline-flex items-center justify-center px-2"
    title={member.username || 'Unknown'}
  >
    <span className="text-xs text-white font-medium truncate max-w-[100px]">
      {member.username || 'N/A'}
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