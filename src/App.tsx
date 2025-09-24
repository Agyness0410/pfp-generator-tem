import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import AvatarGenerator from './components/AvatarGenerator';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AvatarGenerator /> : <LoginForm />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
