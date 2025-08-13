import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FiUsers, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiCheck, 
  FiUserPlus 
} from 'react-icons/fi';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  assignedTasks: Task[];
}

interface Project {
  id: string;
  name: string;
  sector: string;
  date: string;
  team: TeamMember[];
}

const API_BASE_URL = 'http://localhost:3001/api';

const TeamManagement: React.FC = () => {
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'member',
    email: '',
    password: '',
  });
  const [selectedTaskId, setSelectedTaskId] = useState('');

  // Set project from location on mount
  useEffect(() => {
    if (location.state?.projectData) {
      setProject(location.state.projectData);
    }
  }, [location]);

  // Fetch team members and tasks only after project is set
  useEffect(() => {
    if (!project) return;

    const fetchTeamMembers = async () => {
      setIsLoading(true);
      try {
        if (Array.isArray(project.team)) {
          const members: TeamMember[] = project.team.map((user: any) => ({
            id: user.id?.toString(),
            name: user.username || user.name || user.email || `User ${user.id}`,
            role: user.role,
            email: user.email,
            assignedTasks: (user.tasks || [])
              .filter((task: any) => {
                // Only include tasks for the current project
                return (
                  (task.project?.id?.toString() === project.id?.toString()) ||
                  (task.projectId?.toString() === project.id?.toString())
                );
              })
              .map((task: any) => ({
                id: task.id.toString(),
                title: task.title,
                status: task.status,
                dueDate: task.dueDate,
              })),
          }));
          setTeamMembers(members);
        } else {
          setTeamMembers([]);
        }
      } catch (error: any) {
        console.error('Error fetching team members:', error);
        const backendMsg = error.response?.data?.message;
        const axiosMsg = error.message;
        toast.error(backendMsg || axiosMsg || 'Failed to fetch team members');
        setTeamMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAvailableTasks = async () => {
      setIsLoading(true);
      try {
        // Fetch all unassigned tasks, then filter by projectId client-side
        const response = await axios.get(`${API_BASE_URL}/tasks/unassigned`);
        if (!Array.isArray(response.data)) {
          throw new Error('Unexpected response format: data is not an array');
        }
        const tasks: Task[] = response.data
          .filter((task: any) => {
            // Only include tasks for the current project
            return (
              (task.project?.id?.toString() === project.id?.toString()) ||
              (task.projectId?.toString() === project.id?.toString())
            );
          })
          .map((task: any) => ({
            id: task.id.toString(),
            title: task.title,
            status: task.status,
            dueDate: task.dueDate,
          }));
        setAvailableTasks(tasks);
      } catch (error: any) {
        console.error('Error fetching tasks:', error);
        const backendMsg = error.response?.data?.message;
        const axiosMsg = error.message;
        toast.error(backendMsg || axiosMsg || 'Failed to fetch tasks');
        setAvailableTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
    fetchAvailableTasks();
  }, [project]);

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email || !newMember.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        username: newMember.name,
        email: newMember.email,
        password: newMember.password,
        role: newMember.role,
      });
      const newTeamMember: TeamMember = {
        id: response.data.id.toString(),
        name: response.data.username,
        role: response.data.role,
        email: response.data.email,
        assignedTasks: [],
      };
      setTeamMembers([...teamMembers, newTeamMember]);
      setNewMember({ name: '', role: 'member', email: '', password: '' });
      setIsAddingMember(false);
      toast.success('Team member added successfully');
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast.error(error.response?.data?.message || 'Failed to add team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMember = async () => {
    if (!selectedMember || !newMember.name || !newMember.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    try {
      await axios.patch(`${API_BASE_URL}/users/${selectedMember.id}`, {
        username: newMember.name,
        email: newMember.email,
        role: newMember.role,
      });
      const updatedMembers = teamMembers.map(member =>
        member.id === selectedMember.id
          ? { ...member, name: newMember.name, role: newMember.role, email: newMember.email }
          : member
      );
      setTeamMembers(updatedMembers);
      setSelectedMember({ ...selectedMember, name: newMember.name, role: newMember.role, email: newMember.email });
      setNewMember({ name: '', role: 'member', email: '', password: '' });
      setIsEditingMember(false);
      toast.success('Team member updated successfully');
    } catch (error: any) {
      console.error('Error editing member:', error);
      toast.error(error.response?.data?.message || 'Failed to update team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/users/${memberId}`);
      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
      if (selectedMember?.id === memberId) {
        setSelectedMember(null);
      }
      toast.success('Team member removed successfully');
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast.error(error.response?.data?.message || 'Failed to remove team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTask = async () => {
    if (!selectedMember || !selectedTaskId) {
      toast.error('Please select a task to assign');
      return;
    }
    setIsLoading(true);
    try {
      const taskToAssign = availableTasks.find(task => task.id === selectedTaskId);
      if (taskToAssign) {
        await axios.post(`${API_BASE_URL}/tasks/${selectedTaskId}/assign`, {
          userId: Number(selectedMember.id),
        });
        const updatedMembers = teamMembers.map(member =>
          member.id === selectedMember.id
            ? { ...member, assignedTasks: [...member.assignedTasks, taskToAssign] }
            : member
        );
        setTeamMembers(updatedMembers);
        setSelectedMember({
          ...selectedMember,
          assignedTasks: [...selectedMember.assignedTasks, taskToAssign],
        });
        setAvailableTasks(availableTasks.filter(task => task.id !== selectedTaskId));
        setSelectedTaskId('');
        setIsAssigningTask(false);
        toast.success('Task assigned successfully');
      }
    } catch (error: any) {
      console.error('Error assigning task:', error);
      toast.error(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassignTask = async (memberId: string, taskId: string) => {
    setIsLoading(true);
    try {
      const taskToUnassign = teamMembers
        .find(member => member.id === memberId)
        ?.assignedTasks.find(task => task.id === taskId);
      if (taskToUnassign) {
        await axios.post(`${API_BASE_URL}/tasks/${taskId}/unassign`);
        const updatedMembers = teamMembers.map(member =>
          member.id === memberId
            ? { ...member, assignedTasks: member.assignedTasks.filter(task => task.id !== taskId) }
            : member
        );
        setTeamMembers(updatedMembers);
        if (selectedMember && selectedMember.id === memberId) {
          setSelectedMember({
            ...selectedMember,
            assignedTasks: selectedMember.assignedTasks.filter(task => task.id !== taskId),
          });
        }
        setAvailableTasks([...availableTasks, taskToUnassign]);
        toast.success('Task unassigned successfully');
      }
    } catch (error: any) {
      console.error('Error unassigning task:', error);
      toast.error(error.response?.data?.message || 'Failed to unassign task');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setNewMember({
      name: member.name,
      role: member.role,
      email: member.email,
      password: '',
    });
    setIsEditingMember(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getTaskStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'todo':
        return 'bg-gray-200 text-gray-800';
      case 'in_progress':
        return 'bg-blue-200 text-blue-800';
      case 'done':
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
            <Link to="/home" className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-3 py-1.5 text-sm rounded-lg shadow-sm">
              Back to Projects
            </Link>
             <Link to="/dashboard" className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-3 py-1.5 text-sm rounded-lg shadow-sm">
              Back to Dashboard
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
                  setNewMember({ name: '', role: 'member', email: '', password: '' });
                }}
                className="bg-blue-500 text-white rounded-lg p-1.5 hover:bg-blue-600"
                title="Add Team Member"
                disabled={isLoading}
              >
                <FiPlus size={18} />
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading team members...</div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No team members found. Add new members to get started.</div>
            ) : (
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
                          disabled={isLoading}
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
                          disabled={isLoading}
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
              </div>
            )}
          </div>

          {/* Member Details & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {selectedMember ? (
              <>
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
                      onClick={() => {
                        if (availableTasks.length === 0) {
                          toast.info('There are no tasks available to assign.');
                          return;
                        }
                        setIsAssigningTask(true);
                      }}
                      className="bg-blue-500 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-blue-600"
                      disabled={isLoading}
                    >
                      Assign Task
                    </button>
                  </div>
                </div>

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
                              <p className="text-sm text-gray-500">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2 items-start">
                              <span className={`text-xs px-2 py-1 rounded ${getTaskStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                              <button
                                onClick={() => handleUnassignTask(selectedMember.id, task.id)}
                                className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                title="Unassign Task"
                                disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  disabled={isLoading}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="Email Address"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-lg"
                  value={newMember.password}
                  onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                  placeholder="Password"
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setIsAddingMember(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Member'}
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
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  disabled={isLoading}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="Email Address"
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setIsEditingMember(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditMember}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
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
            {availableTasks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">There are no tasks available to assign.</p>
                <button
                  onClick={() => setIsAssigningTask(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={isLoading}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Task</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    disabled={isLoading}
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
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignTask}
                    disabled={!selectedTaskId || isLoading}
                    className={`px-4 py-2 rounded-lg ${
                      selectedTaskId && !isLoading
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? 'Assigning...' : 'Assign Task'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;