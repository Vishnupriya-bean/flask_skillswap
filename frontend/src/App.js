import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SkillsList from './pages/SkillsList';
import CreateSkill from './pages/CreateSkill';
import MyRequests from './pages/MyRequests';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/skills" element={<SkillsList />} />
                <Route path="/create-skill" element={<CreateSkill />} />
                <Route path="/my-requests" element={<MyRequests />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;
