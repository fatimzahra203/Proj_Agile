import React from 'react';
// TODO: Import react-beautiful-dnd and fetch tasks from backend

const KanbanBoard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      {/* TODO: Implement columns and drag-and-drop using react-beautiful-dnd */}
      <div className="flex gap-4">
        <div className="bg-gray-100 rounded p-4 w-1/3">TODO</div>
        <div className="bg-gray-100 rounded p-4 w-1/3">In Progress</div>
        <div className="bg-gray-100 rounded p-4 w-1/3">Done</div>
      </div>
    </div>
  );
};

export default KanbanBoard;
