import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ChatListProps {
  onSelectChat: (chat: any) => void;
  selectedChat: any | null;
}

const MOCK_CHATS = [
  {
    id: 1,
    type: 'personal',
    name: 'Анна Смирнова',
    avatar: '👩',
    lastMessage: 'Привет! Как дела?',
    time: '14:32',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    type: 'personal',
    name: 'Сергей Иванов',
    avatar: '👨',
    lastMessage: 'Созвонимся завтра?',
    time: '13:15',
    unread: 0,
    online: false,
  },
  {
    id: 3,
    type: 'group',
    name: 'Команда проекта',
    avatar: '👥',
    lastMessage: 'Марина: Отчёт готов',
    time: '12:05',
    unread: 5,
    members: 12,
  },
  {
    id: 4,
    type: 'channel',
    name: 'Новости технологий',
    avatar: '📡',
    lastMessage: 'Новая версия React выпущена',
    time: 'Вчера',
    unread: 0,
    subscribers: 1542,
  },
  {
    id: 5,
    type: 'personal',
    name: 'Сохранённые',
    avatar: '🔖',
    lastMessage: 'Важные заметки',
    time: '11:20',
    unread: 0,
  },
];

const ChatList = ({ onSelectChat, selectedChat }: ChatListProps) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createType, setCreateType] = useState<'group' | 'channel'>('group');

  const filteredChats = MOCK_CHATS.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && chat.type === activeTab;
  });

  return (
    <div className="w-96 border-r border-border flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Чаты</h2>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Icon name="Plus" size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать {createType === 'group' ? 'группу' : 'канал'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={createType === 'group' ? 'default' : 'outline'}
                    onClick={() => setCreateType('group')}
                  >
                    Группа
                  </Button>
                  <Button
                    variant={createType === 'channel' ? 'default' : 'outline'}
                    onClick={() => setCreateType('channel')}
                  >
                    Канал
                  </Button>
                </div>
                <Input placeholder={createType === 'group' ? 'Название группы' : 'Название канала'} />
                <Input placeholder="Описание" />
                <Button className="w-full">Создать</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          {[
            { value: 'all', label: 'Все' },
            { value: 'personal', label: 'Личные' },
            { value: 'group', label: 'Группы' },
            { value: 'channel', label: 'Каналы' },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.value
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors ${
                selectedChat?.id === chat.id ? 'bg-muted' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                  {chat.avatar}
                </div>
                {chat.type === 'personal' && chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium truncate">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground ml-2">{chat.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>

              {chat.unread > 0 && (
                <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatList;
