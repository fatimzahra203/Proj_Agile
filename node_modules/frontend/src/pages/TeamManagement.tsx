import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiUsers, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiCheck, 
  FiUserPlus 
} from 'react-icons/fi';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  assignedTasks: Task[];
}

interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: string;
}

interface Project {
  id: string;
  name: string;
  sector: string;
  date: string;
  team: TeamMember[];
}

const TeamManagement: React.FC = () => {
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  
  // Form states for adding/editing
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: ''
  });
  const [selectedTaskId, setSelectedTaskId] = useState('');

  useEffect(() => {
    // Check if we have project data in the location state
    if (location.state?.projectData) {
      setProject(location.state.projectData);
    }

    // Mock data for team members
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'John Doe',
        role: 'Project Manager',
        email: 'john.doe@example.com',
        assignedTasks: [
          { id: '101', title: 'Create project timeline', status: 'ongoing', dueDate: '2025-08-10' },
          { id: '102', title: 'Review specifications', status: 'done', dueDate: '2025-07-28' }
        ]
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'UX Designer',
        email: 'jane.smith@example.com',
        assignedTasks: [
          { id: '103', title: 'Design login page', status: 'ongoing', dueDate: '2025-08-05' },
          { id: '104', title: 'Create wireframes', status: 'todo', dueDate: '2025-08-15' }
        ]
      },
      {
        id: '3',
        name: 'Mike Johnson',
        role: 'Frontend Developer',
        email: 'mike.johnson@example.com',
        assignedTasks: [
          { id: '105', title: 'Implement UI components', status: 'todo', dueDate: '2025-08-20' }
        ]
      },
      {
        id: '4',
        name: 'Sarah Williams',
        role: 'Backend Developer',
        email: 'sarah.williams@example.com',
        assignedTasks: [
          { id: '106', title: 'Setup database schema', status: 'done', dueDate: '2025-07-25' },
          { id: '107', title: 'Create API endpoints', status: 'ongoing', dueDate: '2025-08-08' }
        ]
      }
    ];

    setTeamMembers(mockTeamMembers);
    
    // Mock data for available tasks
    const mockAvailableTasks: Task[] = [
      { id: '201', title: 'Documentation update', status: 'todo', dueDate: '2025-08-25' },
      { id: '202', title: 'Performance testing', status: 'todo', dueDate: '2025-08-30' },
      { id: '203', title: 'Code review', status: 'todo', dueDate: '2025-08-15' },
      { id: '204', title: 'Bug fixing', status: 'todo', dueDate: '2025-08-12' }
    ];

    setAvailableTasks(mockAvailableTasks);
  }, [location]);

  const handleAddMember = () => {
    if (newMember.name && newMember.role && newMember.email) {
      const newTeamMember: TeamMember = {
        id: `member-${Date.now()}`,
        name: newMember.name,
        role: newMember.role,
        email: newMember.email,
        assignedTasks: []
      };

      setTeamMembers([...teamMembers, newTeamMember]);
      setNewMember({ name: '', role: '', email: '' });
      setIsAddingMember(false);
    }
  };

  const handleEditMember = () => {
    if (selectedMember && newMember.name && newMember.role && newMember.email) {
      const updatedMembers = teamMembers.map(member => 
        member.id === selectedMember.id ? 
        { 
          ...member, 
          name: newMember.name, 
          role: newMember.role, 
          email: newMember.email 
        } : member
      );

      setTeamMembers(updatedMembers);
      setNewMember({ name: '', role: '', email: '' });
      setIsEditingMember(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    if (selectedMember?.id === memberId) {
      setSelectedMember(null);
    }
  };

  const handleAssignTask = () => {
    if (selectedMember && selectedTaskId) {
      const taskToAssign = availableTasks.find(task => task.id === selectedTaskId);
      
      if (taskToAssign) {
        // Add task to selected member
        const updatedMembers = teamMembers.map(member => 
          member.id === selectedMember.id ? 
          { 
            ...member, 
            assignedTasks: [...member.assignedTasks, taskToAssign] 
          } : member
        );

        setTeamMembers(updatedMembers);
        
        // Update selected member if they are currently selected
        if (selectedMember) {
          const updatedSelectedMember = updatedMembers.find(member => member.id === selectedMember.id);
          if (updatedSelectedMember) {
            setSelectedMember(updatedSelectedMember);
          }
        }
        
        // Remove task from available tasks
        setAvailableTasks(availableTasks.filter(task => task.id !== selectedTaskId));
        setSelectedTaskId('');
        setIsAssigningTask(false);
      }
    }
  };

  const handleUnassignTask = (memberId: string, taskId: string) => {
    // Remove task from member
    const memberToUpdate = teamMembers.find(member => member.id === memberId);
    
    if (memberToUpdate) {
      const taskToUnassign = memberToUpdate.assignedTasks.find(task => task.id === taskId);
      
      if (taskToUnassign) {
        // Update team members
        const updatedMembers = teamMembers.map(member => 
          member.id === memberId ? 
          { 
            ...member, 
            assignedTasks: member.assignedTasks.filter(task => task.id !== taskId) 
          } : member
        );

        setTeamMembers(updatedMembers);
        
        // Update selected member if they are currently selected
        if (selectedMember && selectedMember.id === memberId) {
          const updatedSelectedMember = updatedMembers.find(member => member.id === memberId);
          if (updatedSelectedMember) {
            setSelectedMember(updatedSelectedMember);
          }
        }
        
        // Add task back to available tasks
        setAvailableTasks([...availableTasks, taskToUnassign]);
      }
    }
  };

  const startEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setNewMember({
      name: member.name,
      role: member.role,
      email: member.email
    });
    setIsEditingMember(true);
  };

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Get task status color
  const getTaskStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'todo':
        return 'bg-gray-200 text-gray-800';
      case 'ongoing':
      case 'in progress':
        return 'bg-blue-200 text-blue-800';
      case 'done':
      case 'completed':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo2.png" alt="AgileFlow Logo" className="h-10 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">AgileFlow</h1>
              <p className="text-sm text-blue-600">Team Management</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Members List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
              <button 
                onClick={() => {
                  setIsAddingMember(true);
                  setNewMember({ name: '', role: '', email: '' });
                }}
                className="bg-blue-500 text-white rounded-lg p-1.5 hover:bg-blue-600"
                title="Add Team Member"
              >
                <FiPlus size={18} />
              </button>
            </div>

            {/* Team Members List */}
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div 
                  key={member.id} 
                  className={`p-4 rounded-lg border ${
                    selectedMember?.id === member.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  } cursor-pointer transition`}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-white font-medium">
                          {getInitials(member.name)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditMember(member);
                        }}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                        title="Edit Member"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMember(member.id);
                        }}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                        title="Remove Member"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">{member.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {member.assignedTasks.length} tasks
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {teamMembers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No team members found. Add new members to get started.
                </div>
              )}
            </div>
          </div>

          {/* Member Details & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {selectedMember ? (
              <>
                {/* Member Details */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl text-white font-medium">
                          {getInitials(selectedMember.name)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {selectedMember.name}
                        </h2>
                        <p className="text-gray-600">{selectedMember.role}</p>
                        <p className="text-gray-500 text-sm">{selectedMember.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAssigningTask(true)}
                      className="bg-blue-500 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-blue-600"
                      disabled={availableTasks.length === 0}
                    >
                      Assign Task
                    </button>
                  </div>
                </div>

                {/* Assigned Tasks */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Assigned Tasks</h3>
                  
                  {selectedMember.assignedTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No tasks assigned to this team member yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedMember.assignedTasks.map(task => (
                        <div key={task.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2 items-start">
                              <span className={`text-xs px-2 py-1 rounded ${getTaskStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                              <button
                                onClick={() => handleUnassignTask(selectedMember.id, task.id)}
                                className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                title="Unassign Task"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center py-16">
                  <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Team Member Selected</h3>
                  <p className="text-gray-500">
                    Select a team member from the list to view details and manage assigned tasks.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Member Modal */}
      {isAddingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Team Member</h3>
              <button 
                onClick={() => setIsAddingMember(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  placeholder="Job Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="Email Address"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setIsAddingMember(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {isEditingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Team Member</h3>
              <button 
                onClick={() => setIsEditingMember(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  placeholder="Job Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="Email Address"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setIsEditingMember(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditMember}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {isAssigningTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Assign Task to {selectedMember?.name}</h3>
              <button 
                onClick={() => setIsAssigningTask(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            {availableTasks.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Task</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                  >
                    <option value="">Select a task</option>
                    {availableTasks.map(task => (
                      <option key={task.id} value={task.id}>
                        {task.title} (Due: {new Date(task.dueDate).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setIsAssigningTask(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignTask}
                    disabled={!selectedTaskId}
                    className={`px-4 py-2 rounded-lg ${
                      selectedTaskId 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Assign Task
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No tasks available for assignment</p>
                <button
                  onClick={() => setIsAssigningTask(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
