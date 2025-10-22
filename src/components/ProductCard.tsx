import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export default function ProductCard({
  name,
  price,
  oldPrice,
  image,
  brand,
  rating,
  reviews,
  inStock
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-all ${
            isFavorite ? 'text-red-500' : ''
          }`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Icon name={isFavorite ? 'Heart' : 'Heart'} size={20} className={isFavorite ? 'fill-current' : ''} />
        </Button>

        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            -{discount}%
          </Badge>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-lg font-semibold">Нет в наличии</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1">{brand}</div>
        <h3 className="font-medium text-sm line-clamp-2 min-h-[40px] mb-2">{name}</h3>
        
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Icon 
                key={i}
                name="Star" 
                size={14} 
                className={i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{price.toLocaleString('ru-RU')} ₽</span>
          {oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {oldPrice.toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className={`w-full transition-all duration-300 ${
            isHovered ? 'bg-secondary hover:bg-secondary/90' : ''
          }`}
          disabled={!inStock}
        >
          <Icon name="ShoppingCart" size={18} className="mr-2" />
          В корзину
        </Button>
      </CardFooter>
    </Card>
  );
}
