import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number;
  image_url: string;
  brand_name: string;
  category_name: string;
  rating: number;
  reviews_count: number;
  stock_quantity: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Brand {
  id: number;
  name: string;
  slug: string;
}

const PRODUCTS_API = 'https://functions.poehali.dev/6b8bd178-985e-49e8-aa7c-fb051299fb6a';
const ADMIN_API = 'https://functions.poehali.dev/660dee27-2f53-4f34-b3f3-363fe76be13c';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadCategoriesAndBrands();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategories, selectedBrands, priceRange, searchQuery, sortBy]);

  const loadCategoriesAndBrands = async () => {
    try {
      const response = await fetch(ADMIN_API, {
        headers: {
          'X-Auth-Token': 'temp-token'
        }
      });
      const data = await response.json();
      setCategories(data.categories || []);
      setBrands(data.brands || []);
    } catch (error) {
      console.error('Failed to load categories and brands:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategories.length > 0) {
        params.append('category', selectedCategories[0]);
      }
      if (selectedBrands.length > 0) {
        params.append('brand', selectedBrands[0]);
      }
      params.append('minPrice', priceRange[0].toString());
      params.append('maxPrice', priceRange[1].toString());
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`${PRODUCTS_API}?${params.toString()}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [slug]
    );
  };

  const toggleBrand = (slug: string) => {
    setSelectedBrands(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [slug]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 200000]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Фильтры</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Сбросить
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Категории</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {categories.map(cat => (
                        <div key={cat.id} className="flex items-center">
                          <Checkbox
                            id={`cat-${cat.slug}`}
                            checked={selectedCategories.includes(cat.slug)}
                            onCheckedChange={() => toggleCategory(cat.slug)}
                          />
                          <label
                            htmlFor={`cat-${cat.slug}`}
                            className="ml-2 text-sm cursor-pointer"
                          >
                            {cat.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Бренды</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {brands.map(brand => (
                        <div key={brand.id} className="flex items-center">
                          <Checkbox
                            id={`brand-${brand.slug}`}
                            checked={selectedBrands.includes(brand.slug)}
                            onCheckedChange={() => toggleBrand(brand.slug)}
                          />
                          <label
                            htmlFor={`brand-${brand.slug}`}
                            className="ml-2 text-sm cursor-pointer"
                          >
                            {brand.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">
                      Цена: {priceRange[0].toLocaleString()} ₽ - {priceRange[1].toLocaleString()} ₽
                    </Label>
                    <Slider
                      min={0}
                      max={200000}
                      step={1000}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Каталог товаров</h1>
                <p className="text-muted-foreground">
                  Найдено товаров: {products.length}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Label>Сортировка:</Label>
                <select
                  className="border rounded-md px-3 py-2"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Новинки</option>
                  <option value="price-asc">Цена: по возрастанию</option>
                  <option value="price-desc">Цена: по убыванию</option>
                  <option value="rating">Рейтинг</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-muted-foreground">Загрузка товаров...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Package" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Товары не найдены</p>
                <Button onClick={clearFilters} className="mt-4">
                  Сбросить фильтры
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        {product.old_price && (
                          <Badge className="absolute top-2 right-2 bg-red-500">
                            -{Math.round((1 - product.price / product.old_price) * 100)}%
                          </Badge>
                        )}
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="Heart" size={20} />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                          <span className="mx-1">·</span>
                          <span>{product.reviews_count} отзывов</span>
                        </div>

                        <h3 className="font-semibold line-clamp-2 min-h-[3rem]">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{product.brand_name}</Badge>
                          <Badge variant="outline">{product.category_name}</Badge>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">
                            {product.price.toLocaleString()} ₽
                          </span>
                          {product.old_price && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.old_price.toLocaleString()} ₽
                            </span>
                          )}
                        </div>

                        {product.stock_quantity > 0 ? (
                          <Button className="w-full">
                            <Icon name="ShoppingCart" size={18} className="mr-2" />
                            В корзину
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full" disabled>
                            Нет в наличии
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
