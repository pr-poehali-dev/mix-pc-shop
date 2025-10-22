import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  quantity: number;
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Intel Core i9-14900K 3.2 ГГц 24 ядра',
    price: 68990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/f5e9a631-bd73-4bd7-91c5-49f518cdfd60.jpg',
    brand: 'Intel',
    quantity: 1
  },
  {
    id: 3,
    name: 'NVIDIA GeForce RTX 4090 24GB GDDR6X',
    price: 189990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/4648d682-b990-455a-a1e9-98580199baed.jpg',
    brand: 'NVIDIA',
    quantity: 1
  },
  {
    id: 5,
    name: 'Corsair Dominator Platinum RGB 32GB DDR5',
    price: 18990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/9f331882-efe0-458b-971f-3fc2256e1f5a.jpg',
    brand: 'Corsair',
    quantity: 2
  }
];

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [promoCode, setPromoCode] = useState('');
  const navigate = useNavigate();

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 500;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Icon name="ShoppingCart" size={32} className="text-primary" />
            Корзина
          </h1>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg bg-muted"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">{item.brand}</p>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold">
                              {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.price.toLocaleString('ru-RU')} ₽ за шт
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Итого</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт):
                      </span>
                      <span className="font-medium">{subtotal.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Доставка:</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-500">Бесплатно</span>
                        ) : (
                          `${shipping} ₽`
                        )}
                      </span>
                    </div>

                    {shipping > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Бесплатная доставка от 50 000 ₽
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2 block">Промокод</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Введите промокод"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline">
                        Применить
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-lg font-semibold">К оплате:</span>
                    <span className="text-3xl font-bold text-primary">
                      {total.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <Button className="w-full mb-3" size="lg">
                    <Icon name="CreditCard" size={20} className="mr-2" />
                    Оформить заказ
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                    <Icon name="ArrowLeft" size={18} className="mr-2" />
                    Продолжить покупки
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Icon name="ShoppingCart" size={80} className="mx-auto text-muted-foreground mb-6" />
            <h2 className="text-3xl font-bold mb-4">Корзина пуста</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Добавьте товары в корзину, чтобы оформить заказ
            </p>
            <Button size="lg" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Перейти к покупкам
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
