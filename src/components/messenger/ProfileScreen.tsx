import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ProfileScreenProps {
  userData: {
    name: string;
    phone: string;
    avatar: string;
    balance: number;
    status: string;
  };
  onUpdateProfile: (data: any) => void;
  onLogout: () => void;
}

const ProfileScreen = ({ userData, onUpdateProfile, onLogout }: ProfileScreenProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData.name);
  const [status, setStatus] = useState(userData.status);
  const [newAvatar, setNewAvatar] = useState(userData.avatar);

  const AVATAR_OPTIONS = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🎨', '👩‍🎨', '🦸', '🦹', '🧙'];

  const handleSave = () => {
    onUpdateProfile({ name, status, avatar: newAvatar });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Профиль</h1>
          <Button
            variant={isEditing ? 'default' : 'outline'}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <Icon name={isEditing ? 'Check' : 'Edit'} size={18} className="mr-2" />
            {isEditing ? 'Сохранить' : 'Редактировать'}
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-5xl">
                {isEditing ? newAvatar : userData.avatar}
              </div>
              {isEditing && (
                <div className="grid grid-cols-6 gap-2 max-w-xs">
                  {AVATAR_OPTIONS.map(av => (
                    <button
                      key={av}
                      onClick={() => setNewAvatar(av)}
                      className={`text-2xl p-2 rounded hover:bg-muted transition-colors ${
                        newAvatar === av ? 'bg-primary/20' : ''
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Имя</label>
                {isEditing ? (
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                ) : (
                  <p className="text-lg font-medium">{userData.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Телефон</label>
                <p className="text-lg">{userData.phone}</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Статус</label>
                {isEditing ? (
                  <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Ваш статус" />
                ) : (
                  <p className="text-lg">{userData.status}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Баланс енотиков</h3>
              <p className="text-3xl font-bold text-primary">🦝 {userData.balance}</p>
            </div>
            <Button>
              <Icon name="Plus" size={18} className="mr-2" />
              Пополнить
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Используйте енотики для покупки подарков в магазине
          </p>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">Фотостатус</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-primary/50 to-purple-500/50 flex items-center justify-center border-2 border-primary"
              >
                <Icon name="Plus" size={24} />
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Добавьте фото, которое увидят ваши контакты
          </p>
        </Card>

        <div className="space-y-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-muted-foreground">
                <Icon name="UserPlus" size={18} className="mr-2" />
                Сменить аккаунт
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Сменить аккаунт</AlertDialogTitle>
                <AlertDialogDescription>
                  Для смены аккаунта введите новый номер телефона
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input placeholder="+7 999 123-45-67" />
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction>Продолжить</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-destructive">
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти из аккаунта
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Выход из аккаунта</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены, что хотите выйти из аккаунта?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={onLogout} className="bg-destructive">
                  Выйти
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
