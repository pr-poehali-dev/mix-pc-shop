import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface Product {
  id?: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  brand: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description?: string;
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSave: (product: Product) => void;
}

export default function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSave
}: ProductFormDialogProps) {
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: 0,
    oldPrice: undefined,
    image: '',
    brand: '',
    category: 'cpu',
    rating: 5,
    reviews: 0,
    inStock: true,
    description: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        price: 0,
        oldPrice: undefined,
        image: '',
        brand: '',
        category: 'cpu',
        rating: 5,
        reviews: 0,
        inStock: true,
        description: ''
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {product ? 'Редактировать товар' : 'Добавить товар'}
          </DialogTitle>
          <DialogDescription>
            Заполните информацию о товаре
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название товара *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Intel Core i9-14900K"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Производитель *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Intel"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="68990"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldPrice">Старая цена (₽)</Label>
              <Input
                id="oldPrice"
                type="number"
                value={formData.oldPrice || ''}
                onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="79990"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Категория *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpu">Процессоры</SelectItem>
                <SelectItem value="gpu">Видеокарты</SelectItem>
                <SelectItem value="ram">Память</SelectItem>
                <SelectItem value="storage">Накопители</SelectItem>
                <SelectItem value="motherboard">Материнские платы</SelectItem>
                <SelectItem value="cooling">Охлаждение</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL изображения *</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Подробное описание товара..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Рейтинг (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviews">Количество отзывов</Label>
              <Input
                id="reviews"
                type="number"
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
            />
            <Label htmlFor="inStock" className="cursor-pointer">
              В наличии
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">
              <Icon name={product ? 'Save' : 'Plus'} size={18} className="mr-2" />
              {product ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
