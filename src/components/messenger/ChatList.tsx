import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
              <Tabs value={createType} onValueChange={(v) => setCreateType(v as 'group' | 'channel')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="group">Группа</TabsTrigger>
                  <TabsTrigger value="channel">Канал</TabsTrigger>
                </TabsList>
                <TabsContent value="group" className="space-y-4 mt-4">
                  <Input placeholder="Название группы" />
                  <Input placeholder="Описание (необязательно)" />
                  <Button className="w-full">Создать группу</Button>
                </TabsContent>
                <TabsContent value="channel" className="space-y-4 mt-4">
                  <Input placeholder="Название канала" />
                  <Input placeholder="Описание" />
                  <Button className="w-full">Создать канал</Button>
                </TabsContent>
              </Tabs>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
        <TabsList className="w-full rounded-none border-b border-border h-auto p-0">
          <TabsTrigger value="all" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Все
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Личные
          </TabsTrigger>
          <TabsTrigger value="group" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Группы
          </TabsTrigger>
          <TabsTrigger value="channel" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Каналы
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 m-0">
          <ScrollArea className="h-full">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatList;
