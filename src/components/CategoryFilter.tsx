import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'Все товары', icon: 'Grid3x3' },
  { id: 'cpu', name: 'Процессоры', icon: 'Cpu' },
  { id: 'gpu', name: 'Видеокарты', icon: 'Monitor' },
  { id: 'ram', name: 'Память', icon: 'Database' },
  { id: 'storage', name: 'Накопители', icon: 'HardDrive' },
  { id: 'motherboard', name: 'Материнские платы', icon: 'Layers' },
  { id: 'cooling', name: 'Охлаждение', icon: 'Fan' },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'ghost'}
              className={`flex-shrink-0 gap-2 ${
                selectedCategory === category.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon name={category.icon as any} size={18} />
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
