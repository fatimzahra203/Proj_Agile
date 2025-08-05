import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/CalendarView';
import Login from './pages/Login'; 
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import KanbanBoard from './pages/KanbanBoard';
import Projectform from './pages/ProjectForm';
import TeamManagement from './pages/TeamManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';           
function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/team" element={<TeamManagement />} />
      <Route path="/projects/new" element={<Projectform mode="create" />} />
      <Route path="/projects/:id/edit" element={<Projectform mode="edit" />} />
          <Route path="/team" element={<TeamManagement />} />
           

        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
