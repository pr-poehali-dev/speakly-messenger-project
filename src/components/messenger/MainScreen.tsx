import { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import ShopScreen from './ShopScreen';
import Icon from '@/components/ui/icon';

interface MainScreenProps {
  userData: {
    name: string;
    phone: string;
    avatar: string;
    balance: number;
    status: string;
  };
  onLogout: () => void;
  onUpdateProfile: (data: any) => void;
}

const MainScreen = ({ userData, onLogout, onUpdateProfile }: MainScreenProps) => {
  const [activeView, setActiveView] = useState<'chats' | 'profile' | 'settings' | 'shop'>('chats');
  const [selectedChat, setSelectedChat] = useState<any | null>(null);

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-20 bg-sidebar border-r border-border flex flex-col items-center py-6 space-y-6">
        <button
          onClick={() => setActiveView('chats')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeView === 'chats' ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent'
          }`}
        >
          <Icon name="MessageCircle" size={24} />
        </button>

        <button
          onClick={() => setActiveView('shop')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeView === 'shop' ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent'
          }`}
        >
          <Icon name="Gift" size={24} />
        </button>

        <button
          onClick={() => setActiveView('settings')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeView === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent'
          }`}
        >
          <Icon name="Settings" size={24} />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => setActiveView('profile')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
            activeView === 'profile' ? 'bg-primary' : 'hover:bg-sidebar-accent'
          }`}
        >
          {userData.avatar}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {activeView === 'chats' && (
          <>
            <ChatList onSelectChat={setSelectedChat} selectedChat={selectedChat} />
            {selectedChat ? (
              <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} userData={userData} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Icon name="MessageSquare" size={64} className="mx-auto mb-4 opacity-20" />
                  <p>Выберите чат для начала общения</p>
                </div>
              </div>
            )}
          </>
        )}

        {activeView === 'profile' && (
          <ProfileScreen userData={userData} onUpdateProfile={onUpdateProfile} onLogout={onLogout} />
        )}

        {activeView === 'settings' && (
          <SettingsScreen userData={userData} onUpdateProfile={onUpdateProfile} onLogout={onLogout} />
        )}

        {activeView === 'shop' && (
          <ShopScreen balance={userData.balance} onUpdateBalance={(balance) => onUpdateProfile({ balance })} />
        )}
      </div>
    </div>
  );
};

export default MainScreen;
