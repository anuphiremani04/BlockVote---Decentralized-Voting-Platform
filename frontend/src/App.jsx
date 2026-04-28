import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vote from './pages/Vote';
import Results from './pages/Results';
import Profile from './pages/Profile';
import AdminLayout from './components/AdminLayout';
import { AdminDashboard, AdminElections, AdminCandidates, AdminUsers, AdminVotes, AdminResults, AdminBlockchain, AdminSettings } from './pages/AdminPages';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/results" element={<Results />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin Specific Layout and Routes */}
      <Route element={<ProtectedRoute requireAdmin={true} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="elections" element={<AdminElections />} />
          <Route path="candidates" element={<AdminCandidates />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="votes" element={<AdminVotes />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="blockchain" element={<AdminBlockchain />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
