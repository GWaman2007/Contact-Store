import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { user, token, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  // Show clean spinner while verifying stored token
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-neutral font-bold">Loading session...</p>
      </div>
    );
  }

  // If not authenticated, render Login or Register
  if (!token || !user) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  // Authenticated state: render Dashboard
  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
