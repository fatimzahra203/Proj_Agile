import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import CalendarView from './pages/CalendarView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/kanban" element={<KanbanBoard />} />
      <Route path="/calendar" element={<CalendarView />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
