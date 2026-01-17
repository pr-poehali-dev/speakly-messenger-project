import { useState } from 'react';
import AuthScreen from '@/components/messenger/AuthScreen';
import MainScreen from '@/components/messenger/MainScreen';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Иван Петров',
    phone: '+7 999 123-45-67',
    avatar: '👤',
    balance: 1250,
    status: '🚀 В сети',
  });

  const handleAuth = (phone: string) => {
    setUserData({ ...userData, phone });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleUpdateProfile = (data: Partial<typeof userData>) => {
    setUserData({ ...userData, ...data });
  };

  if (!isAuthenticated) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <MainScreen 
      userData={userData} 
      onLogout={handleLogout}
      onUpdateProfile={handleUpdateProfile}
    />
  );
};

export default Index;
