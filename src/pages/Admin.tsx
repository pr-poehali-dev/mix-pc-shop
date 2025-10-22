import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import ProductFormDialog from '@/components/ProductFormDialog';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  brand: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

const initialProducts: Product[] = [
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
  }
];

const categoryNames: Record<string, string> = {
  cpu: 'Процессоры',
  gpu: 'Видеокарты',
  ram: 'Память',
  storage: 'Накопители',
  motherboard: 'Мат. платы',
  cooling: 'Охлаждение'
};

export default function Admin() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const navigate = useNavigate();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormDialogOpen(true);
  };

  const handleSaveProduct = (productData: Product) => {
    if (editingProduct) {
      setProducts(products.map(p =>
        p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
      ));
    } else {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts([...products, { ...productData, id: newId }]);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    setDeletingProductId(null);
  };

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
                Админ-панель
              </h1>
            </div>
            <Badge variant="outline" className="text-sm">
              <Icon name="User" size={14} className="mr-1" />
              Администратор
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск товаров..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={handleAddProduct} size="lg">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить товар
              </Button>
            </div>

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
                    <TableHead>Рейтинг</TableHead>
                    <TableHead>Наличие</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">#{product.id}</TableCell>
                      <TableCell>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded bg-muted"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.reviews} отзывов</p>
                        </div>
                      </TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{categoryNames[product.category]}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{product.price.toLocaleString('ru-RU')} ₽</p>
                          {product.oldPrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              {product.oldPrice.toLocaleString('ru-RU')} ₽
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
                          <span className="text-sm">{product.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.inStock ? (
                          <Badge className="bg-green-500">В наличии</Badge>
                        ) : (
                          <Badge variant="destructive">Нет в наличии</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Icon name="Pencil" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletingProductId(product.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">Товары не найдены</p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Всего товаров: <span className="font-semibold">{products.length}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Показано: <span className="font-semibold">{filteredProducts.length}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <ProductFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <AlertDialog open={deletingProductId !== null} onOpenChange={(open) => !open && setDeletingProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Товар будет удален из каталога.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingProductId && handleDeleteProduct(deletingProductId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
