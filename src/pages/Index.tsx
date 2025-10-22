import { useState } from 'react';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const products = [
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
    id: 2,
    name: 'AMD Ryzen 9 7950X 4.5 ГГц 16 ядер',
    price: 64990,
    oldPrice: 72990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/f5e9a631-bd73-4bd7-91c5-49f518cdfd60.jpg',
    brand: 'AMD',
    category: 'cpu',
    rating: 5,
    reviews: 298,
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
    id: 4,
    name: 'AMD Radeon RX 7900 XTX 24GB GDDR6',
    price: 119990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/4648d682-b990-455a-a1e9-98580199baed.jpg',
    brand: 'AMD',
    category: 'gpu',
    rating: 4,
    reviews: 423,
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
    id: 6,
    name: 'G.Skill Trident Z5 RGB 32GB DDR5 6000MHz',
    price: 16990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/9f331882-efe0-458b-971f-3fc2256e1f5a.jpg',
    brand: 'G.Skill',
    category: 'ram',
    rating: 5,
    reviews: 654,
    inStock: false
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
    id: 8,
    name: 'WD Black SN850X 2TB NVMe Gen4 SSD',
    price: 13990,
    image: 'https://cdn.poehali.dev/projects/c988f37f-7db3-49d0-ba42-357827524508/files/f5e9a631-bd73-4bd7-91c5-49f518cdfd60.jpg',
    brand: 'Western Digital',
    category: 'storage',
    rating: 4,
    reviews: 892,
    inStock: true
  }
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setPriceRange([0, 200000]);
    setSelectedBrands([]);
    setInStockOnly(false);
  };

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    .filter(p => !inStockOnly || p.inStock);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory}
      />

      <section className="relative bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              Собери свой идеальный
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                игровой компьютер
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              Лучшие цены на комплектующие от ведущих производителей. 
              Гарантия качества и быстрая доставка.
            </p>
            <Button size="lg" className="gap-2 animate-scale-in" onClick={() => window.location.href = '/catalog'}>
              <Icon name="Zap" size={20} />
              Перейти в каталог
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          <aside className="w-80 flex-shrink-0">
            <FilterSidebar
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              inStockOnly={inStockOnly}
              onInStockToggle={setInStockOnly}
              onResetFilters={handleResetFilters}
            />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {selectedCategory === 'all' ? 'Популярные товары' : 'Товары в категории'}
              </h2>
              <span className="text-muted-foreground">
                Найдено товаров: {filteredProducts.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <Icon name="Package" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Товары не найдены</h3>
                <p className="text-muted-foreground">Попробуйте изменить фильтры или выбрать другую категорию</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                MIX PC
              </div>
              <p className="text-sm text-muted-foreground">
                Ваш надежный магазин компьютерных комплектующих
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Каталог</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Процессоры</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Видеокарты</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Память</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Накопители</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Информация</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О компании</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Гарантия</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Связь</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="icon">
                  <Icon name="Mail" size={18} />
                </Button>
                <Button variant="outline" size="icon">
                  <Icon name="Phone" size={18} />
                </Button>
                <Button variant="outline" size="icon">
                  <Icon name="MessageCircle" size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 MIX PC. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}