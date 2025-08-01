import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/CalendarView';
import Login from './pages/Login'; 
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import KanbanBoard from './pages/KanbanBoard';
import Projectform from './pages/ProjectForm';
function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/project-form" element={<Projectform />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
