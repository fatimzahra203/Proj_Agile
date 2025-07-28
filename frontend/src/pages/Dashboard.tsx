import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {/* TODO: Add project/task/user summary widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4">Projects</div>
        <div className="bg-white rounded shadow p-4">Tasks</div>
        <div className="bg-white rounded shadow p-4">Users</div>
      </div>
    </div>
  );
};

export default Dashboard;
