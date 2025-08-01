import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface FormData {
  name: string;
  description: string;
  startDate: string;
  wipLimit: number;
  team: number[];
}

const ProjectForm = ({ mode = 'create' }: { mode?: 'create' | 'edit' }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    startDate: '',
    wipLimit: 5,
    team: [],
  });
  // Store fetched project data separately for edit mode
  const [fetchedProject, setFetchedProject] = useState<any>(null);
  interface Member {
    id: number;
    username?: string;
    email?: string;
  }
  
  const [members, setMembers] = useState<Member[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const navigate = useNavigate();
  const params = useParams();

  // If in edit mode, get project ID from URL
  // Wait for members to load before setting formData for edit mode
  // Fetch project data for edit mode, but don't set formData until members are loaded
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
    }
  }, [mode, fetchedProject, members]);

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

  const handleRemoveMember = (id: number) => {
    setFormData({ ...formData, team: formData.team.filter((mid) => mid !== id) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url =
      mode === 'edit'
        ? `http://localhost:3001/api/projects/${projectId}`
        : 'http://localhost:3001/api/projects';
    const method = mode === 'edit' ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(`Error: ${data.message || 'Unknown error'}`);
      } else {
        alert(mode === 'edit' ? 'Project updated!' : 'Project created!');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Submission failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-10">
        <h2 className="text-4xl font-bold text-center text-black-700 mb-10">
          {mode === 'edit' ? 'Edit Project' : 'Create New Kanban Project'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NAME */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="name" className="block text-sm font-semibold mb-1">Project Name</label>
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
            <label htmlFor="startDate" className="block text-sm font-semibold mb-1">Start Date</label>
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
            <label htmlFor="team" className="block text-sm font-semibold mb-1">Add Team Member</label>
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
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold">
              {mode === 'edit' ? 'Update Project' : 'Create Project'}
            </button>
            <button type="button" onClick={() => navigate('/home')} className="flex-1 bg-gray-300 py-3 rounded-lg font-semibold text-gray-800">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
