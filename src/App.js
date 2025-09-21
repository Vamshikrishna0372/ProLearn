import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import './App.css';
import AdminPanel from './components/AdminPanel';
import CoursePage from './components/CoursePage';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected/User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CoursePage />} /> {/* dynamic course page */}

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
