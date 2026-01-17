import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ShopScreenProps {
  balance: number;
  onUpdateBalance: (balance: number) => void;
}

const GIFT_CATEGORIES = [
  {
    id: 'popular',
    name: 'Популярные',
    items: [
      { id: 1, emoji: '🎁', name: 'Подарок', price: 50, description: 'Универсальный подарок' },
      { id: 2, emoji: '🌹', name: 'Роза', price: 30, description: 'Красная роза' },
      { id: 3, emoji: '💎', name: 'Бриллиант', price: 500, description: 'Драгоценный камень' },
      { id: 4, emoji: '🎂', name: 'Торт', price: 100, description: 'Праздничный торт' },
    ],
  },
  {
    id: 'love',
    name: 'Любовь',
    items: [
      { id: 5, emoji: '❤️', name: 'Сердце', price: 20, description: 'Символ любви' },
      { id: 6, emoji: '💕', name: 'Два сердца', price: 40, description: 'Двойная любовь' },
      { id: 7, emoji: '💐', name: 'Букет', price: 80, description: 'Букет цветов' },
      { id: 8, emoji: '💍', name: 'Кольцо', price: 300, description: 'Обручальное кольцо' },
    ],
  },
  {
    id: 'premium',
    name: 'Премиум',
    items: [
      { id: 9, emoji: '👑', name: 'Корона', price: 1000, description: 'Королевская корона' },
      { id: 10, emoji: '🏆', name: 'Кубок', price: 800, description: 'Золотой кубок' },
      { id: 11, emoji: '🎪', name: 'Цирк', price: 1500, description: 'Целый цирк' },
      { id: 12, emoji: '🚀', name: 'Ракета', price: 2000, description: 'Полёт в космос' },
    ],
  },
];

const ENOTIK_PACKS = [
  { id: 1, amount: 100, price: 99, bonus: 0 },
  { id: 2, amount: 500, price: 449, bonus: 50 },
  { id: 3, amount: 1000, price: 799, bonus: 200 },
  { id: 4, amount: 5000, price: 3499, bonus: 1500 },
];

const ShopScreen = ({ balance, onUpdateBalance }: ShopScreenProps) => {
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [myGifts, setMyGifts] = useState<any[]>([
    { id: 1, emoji: '🎁', name: 'Подарок', count: 2 },
    { id: 2, emoji: '🌹', name: 'Роза', count: 5 },
  ]);

  const handleBuyGift = (gift: any) => {
    if (balance >= gift.price) {
      onUpdateBalance(balance - gift.price);
      setMyGifts([...myGifts, { ...gift, count: 1 }]);
      toast.success(`Вы купили "${gift.name}" за 🦝 ${gift.price}`);
      setSelectedGift(null);
    } else {
      toast.error('Недостаточно енотиков!');
    }
  };

  const handleBuyEnotiks = (pack: any) => {
    toast.success(`Куплено ${pack.amount + pack.bonus} енотиков за ${pack.price} ₽`);
    onUpdateBalance(balance + pack.amount + pack.bonus);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Магазин подарков</h1>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Ваш баланс</p>
              <p className="text-2xl font-bold text-primary">🦝 {balance}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="gifts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="gifts">
              <Icon name="Gift" size={16} className="mr-2" />
              Подарки
            </TabsTrigger>
            <TabsTrigger value="my-gifts">
              <Icon name="Package" size={16} className="mr-2" />
              Мои подарки ({myGifts.length})
            </TabsTrigger>
            <TabsTrigger value="buy-enotiks">
              <Icon name="Coins" size={16} className="mr-2" />
              Купить енотики
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gifts" className="space-y-6">
            {GIFT_CATEGORIES.map(category => (
              <div key={category.id}>
                <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {category.items.map(gift => (
                    <Card
                      key={gift.id}
                      className="p-4 hover:border-primary transition-all cursor-pointer hover-scale"
                      onClick={() => setSelectedGift(gift)}
                    >
                      <div className="text-center">
                        <div className="text-6xl mb-3">{gift.emoji}</div>
                        <h4 className="font-semibold mb-1">{gift.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{gift.description}</p>
                        <div className="flex items-center justify-center gap-1 text-primary font-bold">
                          <span>🦝</span>
                          <span>{gift.price}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="my-gifts">
            <ScrollArea className="h-[600px]">
              {myGifts.length === 0 ? (
                <div className="text-center py-16">
                  <Icon name="Package" size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">У вас пока нет подарков</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {myGifts.map((gift, index) => (
                    <Card key={index} className="p-4">
                      <div className="text-center">
                        <div className="text-6xl mb-3 relative">
                          {gift.emoji}
                          {gift.count > 1 && (
                            <span className="absolute top-0 right-0 w-6 h-6 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center">
                              {gift.count}
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold mb-3">{gift.name}</h4>
                        <div className="space-y-2">
                          <Button size="sm" variant="outline" className="w-full">
                            <Icon name="Send" size={14} className="mr-1" />
                            Отправить
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <Icon name="DollarSign" size={14} className="mr-1" />
                            Продать
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="buy-enotiks" className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <h3 className="text-xl font-semibold mb-2">Что такое енотики?</h3>
              <p className="text-muted-foreground">
                Енотики 🦝 — это внутренняя валюта Speakly. Покупайте подарки и отправляйте их друзьям!
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {ENOTIK_PACKS.map(pack => (
                <Card key={pack.id} className="p-6 hover:border-primary transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold">🦝 {pack.amount}</p>
                      {pack.bonus > 0 && (
                        <p className="text-sm text-green-500 font-medium">+{pack.bonus} бонус</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{pack.price} ₽</p>
                      {pack.bonus > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {((pack.bonus / pack.amount) * 100).toFixed(0)}% выгода
                        </p>
                      )}
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => handleBuyEnotiks(pack)}>
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    Купить
                  </Button>
                </Card>
              ))}
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Способы оплаты</h3>
              <div className="flex flex-wrap gap-3">
                {['💳 Карта', '📱 SBP', '🏦 PayPal', '₿ Crypto'].map(method => (
                  <Button key={method} variant="outline" size="sm">
                    {method}
                  </Button>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={selectedGift !== null} onOpenChange={(open) => !open && setSelectedGift(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Купить подарок</DialogTitle>
            </DialogHeader>
            {selectedGift && (
              <div className="text-center py-4">
                <div className="text-8xl mb-4">{selectedGift.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{selectedGift.name}</h3>
                <p className="text-muted-foreground mb-6">{selectedGift.description}</p>
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary mb-6">
                  <span>🦝</span>
                  <span>{selectedGift.price}</span>
                </div>
                <div className="space-y-2">
                  <Button className="w-full" size="lg" onClick={() => handleBuyGift(selectedGift)}>
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    Купить
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Баланс после покупки: 🦝 {balance - selectedGift.price}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ShopScreen;
