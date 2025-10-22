import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const PRODUCTS_API = 'https://functions.poehali.dev/6b8bd178-985e-49e8-aa7c-fb051299fb6a';
const ADMIN_API = 'https://functions.poehali.dev/660dee27-2f53-4f34-b3f3-363fe76be13c';
const AUTH_API = 'https://functions.poehali.dev/cabdb496-de5f-4e5f-9235-e26ba79c269e';

interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number;
  image_url: string;
  brand_name: string;
  category_name: string;
  stock_quantity: number;
  description: string;
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    old_price: '',
    stock_quantity: '',
    image_url: '',
    category_id: '',
    brand_id: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.user.role === 'admin') {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        toast({
          title: 'Успешный вход',
          description: `Добро пожаловать, ${data.user.full_name}!`
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Неверные данные или недостаточно прав',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось войти',
        variant: 'destructive'
      });
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, adminRes] = await Promise.all([
        fetch(PRODUCTS_API),
        fetch(ADMIN_API, { headers: { 'X-Auth-Token': authToken } })
      ]);
      
      const productsData = await productsRes.json();
      const adminData = await adminRes.json();
      
      setProducts(productsData.products || []);
      setCategories(adminData.categories || []);
      setBrands(adminData.brands || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        old_price: product.old_price?.toString() || '',
        stock_quantity: product.stock_quantity.toString(),
        image_url: product.image_url,
        category_id: '',
        brand_id: ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        old_price: '',
        stock_quantity: '0',
        image_url: '',
        category_id: '',
        brand_id: ''
      });
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `${ADMIN_API}/${editingProduct.id}` 
        : ADMIN_API;
      
      const body = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        old_price: formData.old_price ? parseFloat(formData.old_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        image_url: formData.image_url,
        category_id: parseInt(formData.category_id),
        brand_id: parseInt(formData.brand_id),
        slug: formData.name.toLowerCase().replace(/\s+/g, '-')
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken
        },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        toast({
          title: 'Успешно',
          description: editingProduct ? 'Товар обновлён' : 'Товар добавлен'
        });
        setFormOpen(false);
        loadData();
      } else {
        throw new Error('Failed to save product');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить товар',
        variant: 'destructive'
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Icon name="Shield" size={48} className="mx-auto mb-4 text-primary" />
              <h1 className="text-2xl font-bold mb-2">Админ-панель</h1>
              <p className="text-muted-foreground">Войдите для продолжения</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mixpc.ru"
                  required
                />
              </div>
              
              <div>
                <Label>Пароль</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Вернуться на сайт
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="Shield" size={28} className="text-primary" />
                Админ-панель MIX PC
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                <Icon name="User" size={14} className="mr-1" />
                Администратор
              </Badge>
              <Button variant="ghost" onClick={() => setIsAuthenticated(false)}>
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Управление товарами</h2>
            <p className="text-muted-foreground">Всего товаров: {products.length}</p>
          </div>
          <Button onClick={() => handleOpenForm()} size="lg">
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить товар
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">ID</TableHead>
                      <TableHead className="w-[80px]">Фото</TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>Бренд</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Остаток</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">#{product.id}</TableCell>
                        <TableCell>
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded bg-muted"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium truncate">{product.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>{product.brand_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category_name}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{product.price.toLocaleString()} ₽</p>
                            {product.old_price && (
                              <p className="text-xs text-muted-foreground line-through">
                                {product.old_price.toLocaleString()} ₽
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.stock_quantity > 0 ? (
                            <Badge className="bg-green-500">{product.stock_quantity} шт</Badge>
                          ) : (
                            <Badge variant="destructive">Нет</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenForm(product)}
                          >
                            <Icon name="Edit" size={18} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Название товара</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Описание</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Категория</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Бренд</Label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.brand_id}
                  onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                  required
                >
                  <option value="">Выберите бренд</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Цена (₽)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Старая цена (₽)</Label>
                <Input
                  type="number"
                  value={formData.old_price}
                  onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                />
              </div>

              <div>
                <Label>Остаток (шт)</Label>
                <Input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label>URL изображения</Label>
              <Input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
                Отмена
              </Button>
              <Button type="submit">
                {editingProduct ? 'Сохранить' : 'Добавить'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
