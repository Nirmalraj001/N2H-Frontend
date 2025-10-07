import { Category } from '../../types';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterPanelProps {
  categories: Category[];
  selectedCategories?: string[];
  minPrice?: number;
  maxPrice?: number;
  onCategoryChange: (categoryIds: string[]) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onClear: () => void;
}

export const FilterPanel = ({
  categories,
  selectedCategories = [],
  minPrice,
  maxPrice,
  onCategoryChange,
  onPriceChange,
  onClear,
}: FilterPanelProps) => {
  const [priceMin, setPriceMin] = useState<number>(minPrice || 0);
  const [priceMax, setPriceMax] = useState<number>(maxPrice || 10000);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPriceMin(minPrice || 0);
    setPriceMax(maxPrice || 10000);
  }, [minPrice, maxPrice]);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const handlePriceSliderChange = (value: number, isMin: boolean) => {
    if (isMin) {
      const newMin = Math.min(value, priceMax - 100);
      setPriceMin(newMin);
      if (!isDragging) {
        onPriceChange(newMin, priceMax);
      }
    } else {
      const newMax = Math.max(value, priceMin + 100);
      setPriceMax(newMax);
      if (!isDragging) {
        onPriceChange(priceMin, newMax);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onPriceChange(priceMin, priceMax);
  };

  const hasFilters = selectedCategories.length > 0 || minPrice !== undefined || maxPrice !== undefined;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-text">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 text-text">Categories</h4>
          <div className="space-y-2">
            {categories
              .filter(cat => !cat.parentCategory)
              .map(category => {
                const isSelected = selectedCategories.includes(category._id);
                return (
                  <label
                    key={category._id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background cursor-pointer transition-all duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(category._id)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className={isSelected ? 'font-medium text-primary' : 'text-text'}>
                      {category.name}
                    </span>
                  </label>
                );
              })}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-text">Price Range</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-text">₹{priceMin}</span>
              <span className="text-muted">-</span>
              <span className="font-medium text-text">₹{priceMax}</span>
            </div>

            <div className="relative pt-2 pb-6">
              <div className="absolute w-full h-2 bg-border rounded-full"></div>
              <div
                className="absolute h-2 bg-primary rounded-full"
                style={{
                  left: `${(priceMin / 10000) * 100}%`,
                  right: `${100 - (priceMax / 10000) * 100}%`
                }}
              ></div>

              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceMin}
                onChange={e => handlePriceSliderChange(Number(e.target.value), true)}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
              />

              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceMax}
                onChange={e => handlePriceSliderChange(Number(e.target.value), false)}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted mb-1 block">Min</label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={e => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val < priceMax) {
                      setPriceMin(val);
                      onPriceChange(val, priceMax);
                    }
                  }}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Max</label>
                <input
                  type="number"
                  value={priceMax}
                  onChange={e => {
                    const val = Number(e.target.value);
                    if (val > priceMin && val <= 10000) {
                      setPriceMax(val);
                      onPriceChange(priceMin, val);
                    }
                  }}
                  className="input-field text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
