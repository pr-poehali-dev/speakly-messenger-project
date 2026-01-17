import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  replyTo?: number;
  reactions?: { emoji: string; count: number }[];
  type?: 'text' | 'voice' | 'image' | 'video' | 'sticker';
  media?: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: 'Привет! Как дела?', sender: 'other', time: '14:30' },
  { id: 2, text: 'Отлично, спасибо! А у тебя?', sender: 'me', time: '14:31' },
  { id: 3, text: 'Тоже всё хорошо 😊', sender: 'other', time: '14:32', reactions: [{ emoji: '❤️', count: 1 }] },
];

const EMOJI_LIST = ['😊', '👍', '❤️', '🔥', '😂', '😍', '🎉', '👏'];
const STICKER_LIST = ['🐱', '🐶', '🦊', '🐼', '🐨', '🦁', '🐯', '🐸'];

const ChatWindow = ({ chat, onBack, userData }: any) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text?: string, type: Message['type'] = 'text', media?: string) => {
    if ((!text && !media) || (!inputValue.trim() && !text && !media)) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: text || inputValue,
      sender: 'me',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyingTo?.id,
      type,
      media,
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setReplyingTo(null);
  };

  const addReaction = (messageId: number, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existing = reactions.find(r => r.emoji === emoji);
        if (existing) {
          existing.count++;
        } else {
          reactions.push({ emoji, count: 1 });
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
    setSelectedMessage(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        sendMessage('📷 Фото', 'image', URL.createObjectURL(file));
      } else if (file.type.startsWith('video/')) {
        sendMessage('🎥 Видео', 'video', URL.createObjectURL(file));
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowChatMenu(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b border-border px-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
            {chat.avatar}
          </div>
          <div>
            <h3 className="font-semibold">{chat.name}</h3>
            <p className="text-xs text-muted-foreground">
              {chat.online ? '🟢 В сети' : 'Был(а) недавно'}
            </p>
          </div>
        </div>

        <DropdownMenu open={showChatMenu} onOpenChange={setShowChatMenu}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={clearChat}>
              <Icon name="Trash2" size={16} className="mr-2" />
              Очистить чат
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="Ban" size={16} className="mr-2" />
              Заблокировать
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="Edit" size={16} className="mr-2" />
              Переименовать
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[70%] group ${
                  message.sender === 'me' ? 'items-end' : 'items-start'
                } flex flex-col gap-1`}
              >
                {message.replyTo && (
                  <div className="text-xs px-3 py-1 bg-muted/50 rounded-lg border-l-2 border-primary">
                    Ответ на сообщение #{message.replyTo}
                  </div>
                )}

                <div className="relative">
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.sender === 'me'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedMessage(message);
                    }}
                  >
                    {message.type === 'voice' && (
                      <div className="flex items-center gap-2">
                        <Icon name="Mic" size={16} />
                        <div className="h-1 w-32 bg-muted rounded-full" />
                        <span className="text-xs">0:15</span>
                      </div>
                    )}
                    {message.type === 'sticker' && (
                      <div className="text-6xl">{message.text}</div>
                    )}
                    {(!message.type || message.type === 'text') && message.text}
                    {(message.type === 'image' || message.type === 'video') && (
                      <div className="flex items-center gap-2">
                        <Icon name={message.type === 'image' ? 'Image' : 'Video'} size={16} />
                        <span>{message.text}</span>
                      </div>
                    )}
                  </div>

                  {message.reactions && message.reactions.length > 0 && (
                    <div className="absolute -bottom-2 right-2 flex gap-1 bg-card border border-border rounded-full px-2 py-0.5">
                      {message.reactions.map((reaction, idx) => (
                        <span key={idx} className="text-xs">
                          {reaction.emoji} {reaction.count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-xs text-muted-foreground px-2">{message.time}</span>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Reply Bar */}
      {replyingTo && (
        <div className="px-4 py-2 bg-muted/50 border-t border-border flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Ответ на:</p>
            <p className="text-sm truncate">{replyingTo.text}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
            <Icon name="X" size={16} />
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          <DropdownMenu open={showStickerPicker} onOpenChange={setShowStickerPicker}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Icon name="Smile" size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="grid grid-cols-4 gap-2 p-2">
                {STICKER_LIST.map(sticker => (
                  <button
                    key={sticker}
                    onClick={() => {
                      sendMessage(sticker, 'sticker');
                      setShowStickerPicker(false);
                    }}
                    className="text-3xl hover:scale-110 transition-transform"
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0"
          >
            <Icon name="Paperclip" size={20} />
          </Button>

          <Input
            placeholder="Введите сообщение..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className="flex-1"
          />

          <DropdownMenu open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                😊
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="grid grid-cols-4 gap-2 p-2">
                {EMOJI_LIST.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setInputValue(inputValue + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => sendMessage()} className="flex-shrink-0">
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>

      {/* Message Context Menu */}
      <Dialog open={selectedMessage !== null} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Действия с сообщением</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setReplyingTo(selectedMessage);
                setSelectedMessage(null);
              }}
            >
              <Icon name="Reply" size={16} className="mr-2" />
              Ответить
            </Button>
            <div className="border-t border-border pt-2">
              <p className="text-sm text-muted-foreground mb-2">Реакции:</p>
              <div className="grid grid-cols-4 gap-2">
                {EMOJI_LIST.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => selectedMessage && addReaction(selectedMessage.id, emoji)}
                    className="text-2xl hover:scale-110 transition-transform p-2 hover:bg-muted rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatWindow;
