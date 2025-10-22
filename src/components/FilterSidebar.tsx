import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  inStockOnly: boolean;
  onInStockToggle: (value: boolean) => void;
  onResetFilters: () => void;
}

const brands = [
  { id: 'intel', name: 'Intel', count: 2 },
  { id: 'amd', name: 'AMD', count: 3 },
  { id: 'nvidia', name: 'NVIDIA', count: 1 },
  { id: 'corsair', name: 'Corsair', count: 1 },
  { id: 'gskill', name: 'G.Skill', count: 1 },
  { id: 'samsung', name: 'Samsung', count: 1 },
  { id: 'wd', name: 'Western Digital', count: 1 },
];

export default function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandToggle,
  inStockOnly,
  onInStockToggle,
  onResetFilters
}: FilterSidebarProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="SlidersHorizontal" size={20} />
            Фильтры
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            Сбросить
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-4 block">Цена</Label>
          <div className="space-y-4">
            <Slider
              min={0}
              max={200000}
              step={1000}
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {priceRange[0].toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-muted-foreground">
                {priceRange[1].toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-base font-semibold mb-4 block">Производитель</Label>
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={brand.id}
                    checked={selectedBrands.includes(brand.name)}
                    onCheckedChange={() => onBrandToggle(brand.name)}
                  />
                  <label
                    htmlFor={brand.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {brand.name}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">({brand.count})</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-base font-semibold mb-4 block">Наличие</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="instock"
              checked={inStockOnly}
              onCheckedChange={onInStockToggle}
            />
            <label
              htmlFor="instock"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Только в наличии
            </label>
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-base font-semibold mb-3 block">Рейтинг</Label>
          <div className="space-y-2">
            {[5, 4, 3].map((rating) => (
              <Button
                key={rating}
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={14}
                      className={i < rating ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}
                    />
                  ))}
                </div>
                <span className="text-sm">и выше</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
