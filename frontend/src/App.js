import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Employees from './pages/Employees';
import Performance from './pages/Performance';
import Sidebar from './components/Sidebar';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          } />
          <Route path="/leads" element={
            <PrivateRoute>
              <Layout><Leads /></Layout>
            </PrivateRoute>
          } />
          <Route path="/employees" element={
            <PrivateRoute>
              <Layout><Employees /></Layout>
            </PrivateRoute>
          } />
          <Route path="/performance" element={
            <PrivateRoute>
              <Layout><Performance /></Layout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
