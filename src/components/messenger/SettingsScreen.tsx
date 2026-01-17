import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Slider } from '@/components/ui/slider';

interface SettingsScreenProps {
  userData: any;
  onUpdateProfile: (data: any) => void;
  onLogout: () => void;
}

const SettingsScreen = ({ userData }: SettingsScreenProps) => {
  const [ghostMode, setGhostMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeen, setLastSeen] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [activeSection, setActiveSection] = useState('privacy');

  const sections = [
    { id: 'privacy', label: 'Приватность', icon: 'Shield' },
    { id: 'wallet', label: 'Кошелёк', icon: 'Wallet' },
    { id: 'music', label: 'Музыка', icon: 'Music' },
    { id: 'appearance', label: 'Темы', icon: 'Palette' },
    { id: 'support', label: 'Поддержка', icon: 'HelpCircle' },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Настройки</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sections.map(section => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? 'default' : 'outline'}
              onClick={() => setActiveSection(section.id)}
              className="flex-shrink-0"
            >
              <Icon name={section.icon as any} size={16} className="mr-2" />
              {section.label}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-4">
            {activeSection === 'privacy' && (
              <>
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Icon name="EyeOff" size={20} className="mr-2 text-primary" />
                    Режим призрака
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Скрыть статус "в сети"</p>
                        <p className="text-sm text-muted-foreground">Никто не увидит, когда вы онлайн</p>
                      </div>
                      <Switch checked={ghostMode} onCheckedChange={setGhostMode} />
                    </div>
                    {ghostMode && (
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        ⚠️ В режиме призрака вы также не увидите статус других пользователей
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Конфиденциальность</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Последнее посещение</p>
                        <p className="text-sm text-muted-foreground">Показывать время последнего захода</p>
                      </div>
                      <Switch checked={lastSeen} onCheckedChange={setLastSeen} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Отметки о прочтении</p>
                        <p className="text-sm text-muted-foreground">Отправлять статус прочтения сообщений</p>
                      </div>
                      <Switch checked={readReceipts} onCheckedChange={setReadReceipts} />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Чёрный список</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Заблокированные пользователи не смогут писать вам и видеть ваш статус
                  </p>
                  <Button variant="outline" className="w-full">
                    <Icon name="Ban" size={18} className="mr-2" />
                    Управление чёрным списком (0)
                  </Button>
                </Card>
              </>
            )}

            {activeSection === 'wallet' && (
              <>
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Баланс кошелька</h3>
                  <div className="text-center py-8">
                    <p className="text-5xl font-bold mb-2">💰 0 ₽</p>
                    <p className="text-muted-foreground mb-6">Пополните кошелёк для быстрых платежей</p>
                    <Button size="lg" className="w-full max-w-xs">
                      <Icon name="Plus" size={20} className="mr-2" />
                      Пополнить кошелёк
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">История транзакций</h3>
                  <div className="space-y-3">
                    {[
                      { id: 1, type: 'gift', amount: -50, date: '15.01.2026', desc: 'Подарок для Анны' },
                      { id: 2, type: 'purchase', amount: -200, date: '14.01.2026', desc: 'Покупка енотиков' },
                      { id: 3, type: 'received', amount: +100, date: '13.01.2026', desc: 'Продажа подарка' },
                    ].map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{transaction.desc}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                        <span className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : ''}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} ₽
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {activeSection === 'music' && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Icon name="Music" size={20} className="mr-2 text-primary" />
                  Встроенный музыкальный плеер
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Слушайте любимую музыку прямо в мессенджере
                </p>

                <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl p-6 mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name="Music" size={32} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Название трека</p>
                      <p className="text-sm text-muted-foreground">Исполнитель</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Slider value={[30]} max={100} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1:24</span>
                      <span>3:45</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Button variant="ghost" size="sm">
                      <Icon name="SkipBack" size={20} />
                    </Button>
                    <Button size="sm" className="w-12 h-12 rounded-full">
                      <Icon name="Play" size={24} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="SkipForward" size={20} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Громкость</span>
                    <span className="text-sm text-muted-foreground">{volume[0]}%</span>
                  </div>
                  <Slider value={volume} onValueChange={setVolume} max={100} className="w-full" />
                </div>
              </Card>
            )}

            {activeSection === 'appearance' && (
              <>
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Темы оформления</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Тёмная', active: true, bg: 'bg-slate-900' },
                      { name: 'Светлая', active: false, bg: 'bg-white' },
                      { name: 'Синяя', active: false, bg: 'bg-blue-900' },
                      { name: 'Зелёная', active: false, bg: 'bg-green-900' },
                    ].map(theme => (
                      <button
                        key={theme.name}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          theme.active ? 'border-primary' : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className={`w-full h-24 rounded-lg ${theme.bg} mb-2`} />
                        <p className="font-medium">{theme.name}</p>
                        {theme.active && <p className="text-xs text-primary">Активная</p>}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Язык интерфейса</h3>
                  <div className="space-y-2">
                    {['Русский', 'English', 'Español', 'Deutsch'].map(lang => (
                      <button
                        key={lang}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          lang === 'Русский' ? 'bg-primary/10 border border-primary' : 'hover:bg-muted'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {activeSection === 'support' && (
              <>
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Icon name="MessageCircle" size={20} className="mr-2 text-primary" />
                    Служба поддержки
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Свяжитесь с нами, если у вас возникли вопросы или проблемы
                  </p>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Mail" size={18} className="mr-2" />
                      support@speakly.app
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="MessageSquare" size={18} className="mr-2" />
                      Открыть чат поддержки
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="BookOpen" size={18} className="mr-2" />
                      База знаний
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Уведомления</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push-уведомления</p>
                        <p className="text-sm text-muted-foreground">Получать уведомления о новых сообщениях</p>
                      </div>
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Звуки уведомлений</p>
                        <p className="text-sm text-muted-foreground">Воспроизводить звук при новых сообщениях</p>
                      </div>
                      <Switch checked={sounds} onCheckedChange={setSounds} />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">О приложении</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Версия: 1.0.0</p>
                    <p>© 2026 Speakly. Все права защищены.</p>
                  </div>
                </Card>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SettingsScreen;
