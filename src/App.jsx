import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import './App.css';

// مكون الحماية للصفحات
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// صفحة العقارات
const PropertiesPage = () => (
  <Layout currentPage="properties">
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">إدارة العقارات</h1>
      <p>هذه صفحة إدارة العقارات - قيد التطوير</p>
    </div>
  </Layout>
);

// صفحة المشاريع
const ProjectsPage = () => (
  <Layout currentPage="projects">
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">إدارة المشاريع</h1>
      <p>هذه صفحة إدارة المشاريع - قيد التطوير</p>
    </div>
  </Layout>
);

// صفحة المباني
const BuildingsPage = () => (
  <Layout currentPage="buildings">
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">إدارة المباني</h1>
      <p>هذه صفحة إدارة المباني - قيد التطوير</p>
    </div>
  </Layout>
);

// صفحة الوحدات
const UnitsPage = () => (
  <Layout currentPage="units">
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">إدارة الوحدات</h1>
      <p>هذه صفحة إدارة الوحدات - قيد التطوير</p>
    </div>
  </Layout>
);

// صفحة العقود
const ContractsPage = () => (
  <Layout currentPage="contracts">
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">إدارة العقود</h1>
      <p>هذه صفحة إدارة العقود - قيد التطوير</p>
    </div>
  </Layout>
);

// مكون التطبيق الرئيسي
const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout currentPage="dashboard">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout currentPage="dashboard">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/properties" 
          element={
            <ProtectedRoute>
              <PropertiesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/buildings" 
          element={
            <ProtectedRoute>
              <BuildingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/units" 
          element={
            <ProtectedRoute>
              <UnitsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contracts" 
          element={
            <ProtectedRoute>
              <ContractsPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;

