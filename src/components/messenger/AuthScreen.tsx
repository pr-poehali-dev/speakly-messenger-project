import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onAuth: (phone: string) => void;
}

const AuthScreen = ({ onAuth }: AuthScreenProps) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('code');
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 4) {
      onAuth(phone);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Icon name="MessageCircle" size={40} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Speakly</h1>
          <p className="text-muted-foreground">Быстрый и безопасный мессенджер</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Номер телефона</label>
              <Input
                type="tel"
                placeholder="+7 999 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-lg h-12"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base" disabled={phone.length < 10}>
              Продолжить
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <Icon name="ArrowLeft" size={16} className="mr-1" />
              Изменить номер
            </button>
            <div>
              <label className="block text-sm font-medium mb-2">Код подтверждения</label>
              <p className="text-sm text-muted-foreground mb-3">
                Мы отправили SMS на номер {phone}
              </p>
              <Input
                type="text"
                placeholder="1234"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="text-lg h-12 text-center tracking-widest"
                autoFocus
                maxLength={4}
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base" disabled={code.length !== 4}>
              Войти
              <Icon name="LogIn" size={20} className="ml-2" />
            </Button>
          </form>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
