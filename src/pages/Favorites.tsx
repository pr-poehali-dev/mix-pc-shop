import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const mockFavorites = [
  {
    id: 1,
    name: 'Intel Core i9-14900K 3.2 ГГц 24 ядра',
    price: 68990,
    oldPrice: 79990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/f5e9a631-bd73-4bd7-91c5-49f518cdfd60.jpg',
    brand: 'Intel',
    category: 'cpu',
    rating: 5,
    reviews: 342,
    inStock: true
  },
  {
    id: 3,
    name: 'NVIDIA GeForce RTX 4090 24GB GDDR6X',
    price: 189990,
    oldPrice: 219990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/4648d682-b990-455a-a1e9-98580199baed.jpg',
    brand: 'NVIDIA',
    category: 'gpu',
    rating: 5,
    reviews: 567,
    inStock: true
  },
  {
    id: 5,
    name: 'Corsair Dominator Platinum RGB 32GB DDR5',
    price: 18990,
    oldPrice: 21990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/9f331882-efe0-458b-971f-3fc2256e1f5a.jpg',
    brand: 'Corsair',
    category: 'ram',
    rating: 5,
    reviews: 876,
    inStock: true
  },
  {
    id: 7,
    name: 'Samsung 990 PRO 2TB NVMe M.2 SSD',
    price: 15990,
    oldPrice: 18990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/f5e9a631-bd73-4bd7-91c5-49f518cdfd60.jpg',
    brand: 'Samsung',
    category: 'storage',
    rating: 5,
    reviews: 1203,
    inStock: true
  },
  {
    id: 4,
    name: 'AMD Radeon RX 7900 XTX 24GB GDDR6',
    price: 119990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/4648d682-b990-455a-a1e9-98580199baed.jpg',
    brand: 'AMD',
    category: 'gpu',
    rating: 4,
    reviews: 423,
    inStock: true
  }
];

export default function Favorites() {
  const [favorites] = useState(mockFavorites);
  const navigate = useNavigate();

  const totalValue = favorites.reduce((sum, item) => sum + item.price, 0);
  const totalDiscount = favorites.reduce((sum, item) => {
    if (item.oldPrice) {
      return sum + (item.oldPrice - item.price);
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Icon name="Heart" size={32} className="text-red-500" />
            Избранное
          </h1>
        </div>

        {favorites.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Сводка</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Товаров:</span>
                      <span className="font-medium">{favorites.length} шт</span>
                    </div>
                    
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Скидка:</span>
                        <span className="font-medium text-green-500">
                          -{totalDiscount.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    )}
                    
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Общая стоимость:</span>
                        <span className="text-2xl font-bold text-primary">
                          {totalValue.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mb-3" size="lg">
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    Добавить все в корзину
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Icon name="Share2" size={18} className="mr-2" />
                    Поделиться списком
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Icon name="Heart" size={80} className="mx-auto text-muted-foreground mb-6" />
            <h2 className="text-3xl font-bold mb-4">Избранное пусто</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Добавляйте понравившиеся товары, чтобы не потерять их
            </p>
            <Button size="lg" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Вернуться к покупкам
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
