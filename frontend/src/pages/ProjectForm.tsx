import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface FormData {
  name: string;
  description: string;
  startDate: string;
  wipLimit: number;
  team: number[];
}

interface TaskData {
  id?: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
  assigneeId: number | null;
}

const ProjectForm = ({ mode = 'create' }: { mode?: 'create' | 'edit' }) => {
  const [formStep, setFormStep] = useState<'project' | 'tasks'>('project');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    startDate: '',
    wipLimit: 5,
    team: [],
  });
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [newTask, setNewTask] = useState<TaskData>({
    title: '',
    description: '',
    status: 'todo',
    dueDate: '',
    assigneeId: null
  });
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null);
  // Store fetched project data separately for edit mode
  const [fetchedProject, setFetchedProject] = useState<any>(null);
  
  interface Member {
    id: number;
    username?: string;
    email?: string;
  }
  
  const [members, setMembers] = useState<Member[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchProject = async (id: string) => {
      try {
        const res = await fetch(`http://localhost:3001/api/projects/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFetchedProject(data);
        } else {
          console.error('Failed to fetch project:', data);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    if (mode === 'edit' && params.id) {
      setProjectId(params.id);
      fetchProject(params.id);
    }
  }, [mode, params.id]);

  // When both members and fetchedProject are loaded, set formData
  useEffect(() => {
    if (mode === 'edit' && fetchedProject && members.length > 0) {
      setFormData({
        name: fetchedProject.name || '',
        description: fetchedProject.description || '',
        startDate: fetchedProject.startDate ? fetchedProject.startDate.slice(0, 10) : '',
        wipLimit: fetchedProject.wipLimit || 1,
        team: Array.isArray(fetchedProject.team) ? fetchedProject.team.map((member: any) => member.id) : [],
      });
      setCreatedProjectId(parseInt(params.id || '', 10));
    }
  }, [mode, fetchedProject, members, params.id]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users?role=member');
        const data = await response.json();
        if (response.ok) {
          setMembers(data);
        }
      } catch (err) {
        console.error('Error fetching members:', err);
      }
    };
    fetchMembers();
  }, []);

  // Fetch project tasks if we're in edit mode
  useEffect(() => {
    const fetchTasks = async () => {
      if (!createdProjectId) return;
      try {
        const response = await fetch(`http://localhost:3001/api/tasks?projectId=${createdProjectId}`);
        if (response.ok) {
          const data = await response.json();
          const formattedTasks = data.map((task: any) => ({
            id: task.id,
            title: task.title,
            description: task.description || '',
            status: task.status,
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
            assigneeId: task.assignee ? task.assignee.id : null
          }));
          setTasks(formattedTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    if (formStep === 'tasks' && mode === 'edit') {
      fetchTasks();
    }
  }, [formStep, createdProjectId, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'wipLimit') {
      const parsedValue = parseInt(value, 10);
      setFormData({ ...formData, [name]: isNaN(parsedValue) ? 1 : parsedValue });
    } else if (name === 'team') {
      const parsedValue = parseInt(value, 10);
      if (!formData.team.includes(parsedValue)) {
        setFormData({ ...formData, team: [...formData.team, parsedValue] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: name === 'assigneeId' && value ? parseInt(value, 10) : value
    });
  };

  const handleRemoveMember = (id: number) => {
    setFormData({ ...formData, team: formData.team.filter((mid) => mid !== id) });
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate project details
    if (!formData.name || !formData.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.team.length === 0) {
      toast.error('Please add at least one team member');
      return;
    }
    
    setIsLoading(true);

    // If we're in create mode, create the project first before moving to tasks
    if (mode === 'create') {
      try {
        const response = await fetch('http://localhost:3001/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!response.ok) {
          toast.error(`Error: ${data.message || 'Failed to create project'}`);
          setIsLoading(false);
          return;
        }
        setCreatedProjectId(data.id);
        toast.success('Project details saved! Now add tasks.');
        setFormStep('tasks');
      } catch (err) {
        console.error('Error creating project:', err);
        toast.error('Failed to create project. Please try again.');
      }
    } else {
      // If we're in edit mode, update the project in the backend before moving to tasks
      try {
        const response = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!response.ok) {
          toast.error(`Error: ${data.message || 'Failed to update project'}`);
          setIsLoading(false);
          return;
        }
        setCreatedProjectId(data.id || projectId);
        toast.success('Project details updated! Now edit tasks.');
        setFormStep('tasks');
      } catch (err) {
        console.error('Error updating project:', err);
        toast.error('Failed to update project. Please try again.');
      }
    }
    setIsLoading(false);
  };

  const addTask = () => {
    if (!newTask.title) {
      toast.warning('Task title is required');
      return;
    }

    setTasks([...tasks, newTask]);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      dueDate: '',
      assigneeId: null
    });
  };

  const removeTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleSaveTasks = async () => {
    if (!createdProjectId) {
      toast.error('Project ID is missing. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Fetch existing tasks from backend
      const response = await fetch(`http://localhost:3001/api/tasks?projectId=${createdProjectId}`);
      const existingTasks = response.ok ? await response.json() : [];
      const existingTaskIds = existingTasks.map((t: any) => t.id);

      // Prepare tasks with id (existing) and without id (new)
      const newTasks = tasks.filter((t: any) => !t.id);
      const updatedTasks = tasks.filter((t: any) => t.id);
      const removedTaskIds = existingTaskIds.filter((id: number) => !tasks.some((t: any) => t.id === id));

      // Create new tasks
      const createPromises = newTasks.map(task =>
        fetch('http://localhost:3001/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...task,
            projectId: createdProjectId
          }),
        })
      );

      // Update existing tasks
      const updatePromises = updatedTasks.map(task => {
        // Ensure all required fields are present
        const payload = {
          title: task.title,
          description: task.description || '',
          status: task.status,
          dueDate: task.dueDate || null,
          projectId: createdProjectId,
          assigneeId: typeof task.assigneeId === 'number' ? task.assigneeId : null
        };
        return fetch(`http://localhost:3001/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      });

      // Delete removed tasks
      const deletePromises = removedTaskIds.map(id =>
        fetch(`http://localhost:3001/api/tasks/${id}`, {
          method: 'DELETE'
        })
      );

      // Run all requests
      const results = await Promise.all([...createPromises, ...updatePromises, ...deletePromises]);
      const failedTasks = results.filter(r => !r.ok).length;

      if (failedTasks > 0) {
        toast.warning(`${failedTasks} tasks failed to save. Please try again.`);
      } else {
        toast.success(`Project ${mode === 'edit' ? 'updated' : 'created'} successfully with ${tasks.length} tasks!`);
        navigate('/home');
      }
    } catch (error) {
      console.error('Error saving tasks:', error);
      toast.error('Failed to save tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (formStep === 'tasks') {
      setFormStep('project');
    } else {
      navigate('/home');
    }
  };

  if (formStep === 'tasks') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Add Tasks for {formData.name}
          </h2>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 border-2 border-blue-500">
              ✓
            </div>
            <div className="h-1 w-16 bg-blue-500"></div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
              2
            </div>
          </div>
          
          {/* New Task Form */}
          <div className="bg-gray-50 rounded-lg border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">New Task</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleTaskChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleTaskChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                <select
                  id="status"
                  name="status"
                  value={newTask.status}
                  onChange={handleTaskChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label htmlFor="assigneeId" className="block text-sm font-medium mb-1">Assign To</label>
                <select
                  id="assigneeId"
                  name="assigneeId"
                  value={newTask.assigneeId || ''}
                  onChange={handleTaskChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Unassigned</option>
                  {formData.team.map(id => {
                    const member = members.find(m => m.id === id);
                    return (
                      <option key={id} value={id}>
                        {member?.username || member?.email || `Member ${id}`}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleTaskChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[80px] focus:ring-2 focus:ring-blue-400"
                placeholder="Enter task description"
              ></textarea>
            </div>
            
            <button 
              type="button"
              onClick={addTask}
              disabled={!newTask.title}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium disabled:opacity-50"
            >
              Add Task
            </button>
          </div>
          
          {/* Task List */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Tasks ({tasks.length})</h3>
            </div>
            
            {tasks.length === 0 ? (
              <div className="bg-gray-50 border rounded-lg p-8 text-center">
                <p className="text-gray-500">No tasks added yet</p>
                <p className="text-sm text-gray-400 mt-1">Add tasks using the form above</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {tasks.map((task, index) => {
                    const assignee = members.find(m => m.id === task.assigneeId);
                    return (
                      <li key={index} className="p-4 hover:bg-gray-50 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`h-2 w-2 rounded-full ${
                              task.status === 'done' ? 'bg-green-500' :
                              task.status === 'in_progress' ? 'bg-blue-500' :
                              'bg-gray-500'
                            }`}></span>
                            <h4 className="font-medium">{task.title}</h4>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-gray-600 ml-4">{task.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 mt-2 ml-4 text-xs text-gray-500">
                            <span>Status: {task.status.replace('_', ' ')}</span>
                            {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                            {assignee && (
                              <span className="flex items-center gap-1">
                                <span>Assigned to:</span>
                                <span className="font-medium">{assignee.username || assignee.email}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          type="button" 
                          onClick={() => removeTask(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={goBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-semibold text-gray-800 transition-colors"
            >
              Back
            </button>
            <button 
              type="button"
              onClick={handleSaveTasks}
              disabled={isLoading}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors ${isLoading ? 'opacity-75' : ''}`}
            >
              {isLoading ? 'Saving...' : 'Save Project & Tasks'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          {mode === 'edit' ? 'Edit Project' : 'Create New Kanban Project'}
        </h2>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
            1
          </div>
          <div className="h-1 w-16 bg-gray-300"></div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600">
            2
          </div>
        </div>
        
        <form onSubmit={handleNextStep} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NAME */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="name" className="block text-sm font-semibold mb-1">Project Name*</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* DESCRIPTION */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-semibold mb-1">Description</label>
            <input id="description" name="description" value={formData.description} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* START DATE */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold mb-1">Start Date*</label>
            <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* WIP LIMIT */}
          <div>
            <label htmlFor="wipLimit" className="block text-sm font-semibold mb-1">WIP Limit</label>
            <input type="number" id="wipLimit" name="wipLimit" min={1} value={formData.wipLimit} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* TEAM SELECTION */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="team" className="block text-sm font-semibold mb-1">Add Team Member*</label>
            <div className="flex gap-2">
              <select
                id="team"
                name="team"
                value={''}
                onChange={e => {
                  const selectedId = parseInt(e.target.value, 10);
                  if (!isNaN(selectedId) && !formData.team.includes(selectedId)) {
                    setFormData({ ...formData, team: [...formData.team, selectedId] });
                  }
                }}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a member</option>
                {members.filter((m: any) => !formData.team.includes(m.id)).map((m: any) => (
                  <option key={m.id} value={m.id}>{m.username || m.email}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CURRENT MEMBERS DISPLAY */}
          {formData.team.length > 0 && (
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm font-semibold mb-2">Current Team:</p>
              <ul className="flex flex-wrap gap-2">
                {formData.team.map((id) => {
                  const member = members.find((m: any) => m.id === id);
                  return (
                    <li key={id} className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center">
                      {member?.username || member?.email}
                      <button type="button" className="ml-2 text-red-500" onClick={() => handleRemoveMember(id)}>×</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* BUTTONS */}
          <div className="col-span-1 md:col-span-2 flex gap-4">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Next: Add Tasks'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/home')} 
              className="flex-1 bg-gray-300 hover:bg-gray-400 py-3 rounded-lg font-semibold text-gray-800"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
