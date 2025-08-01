import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the form data type
interface FormData {
  name: string;
  description: string;
  startDate: string;
  wipLimit: number;
  team: number[]; // Explicitly type team as an array of numbers (user IDs)
}

const ProjectForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    startDate: '',
    wipLimit: 5,
    team: [], // Initialized as number[]
  });
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users?role=member', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Fetched members:', data); // Debug the response
          setMembers(data); // Assuming data is an array of { id, username, email, role } objects
        } else {
          console.error('Failed to fetch members:', data);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'wipLimit') {
      const parsedValue = parseInt(value, 10);
      setFormData({ ...formData, [name]: isNaN(parsedValue) || parsedValue < 1 ? 1 : parsedValue });
    } else if (name === 'team') {
      // Parse value as number since it's a user ID
      const parsedValue = parseInt(value, 10);
      setFormData({
        ...formData,
        [name]: isNaN(parsedValue) ? [] : [parsedValue], // Ensure team is an array of numbers
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending:', JSON.stringify(formData));
    try {
      const response = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Server Error:', data);
        alert(`Failed to create project: ${data.message || 'Unknown error'}`);
      } else {
        alert('Project created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-10">
        <h2 className="text-4xl font-bold text-center text-black-700 mb-10">Create New Kanban Project</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="wipLimit" className="block text-sm font-semibold text-gray-700 mb-1">WIP Limit</label>
            <input
              type="number"
              id="wipLimit"
              name="wipLimit"
              value={formData.wipLimit}
              onChange={handleChange}
              min="1"
              step="1"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="team" className="block text-sm font-semibold text-gray-700 mb-1">Team Members</label>
            <select
              id="team"
              name="team"
              value={formData.team[0] || ''} // Single selection
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select a member</option>
              {members.map((member: any) => (
                <option key={member.id} value={member.id}>
                  {member.username || member.email} {/* Display username or email */}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
            Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;