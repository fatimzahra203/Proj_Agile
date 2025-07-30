import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import CalendarView from './pages/CalendarView';
import Login from './pages/Login'; 
import SignUp from './pages/SignUp';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/kanban" element={<KanbanBoard />} />
      <Route path="/calendar" element={<CalendarView />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/" />} />
      
    </Routes>
  );
}

export default App;
