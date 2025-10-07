import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Category } from '../types';
import { productsAPI, categoriesAPI } from '../services/api';
import { ProductGrid } from '../components/products/ProductGrid';
import { FilterPanel } from '../components/products/FilterPanel';
import { Select } from '../components/ui/Select';
import { SlidersHorizontal } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useAppDispatch();

  const categoryParams = searchParams.getAll('category');
  const searchQuery = searchParams.get('search') || undefined;
  const sortParam = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoriesAPI.getAll();
        setCategories(cats);
      } catch (error) {
        dispatch(showToast({ message: 'Failed to load categories', type: 'error' }));
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let prods = await productsAPI.getAll({
          search: searchQuery,
          sort: sortParam,
          minPrice,
          maxPrice,
          category: categoryParams
        });

        setProducts(prods);
      } catch (error) {
        dispatch(showToast({ message: 'Failed to load products', type: 'error' }));
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categoryParams.join(','), searchQuery, sortParam, minPrice, maxPrice]);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleCategoryChange = (categoryIds: string[]) => {
    const newParams = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (key !== 'category') {
        newParams.set(key, value);
      }
    });

    categoryIds.forEach(id => {
      newParams.append('category', id);
    });

    setSearchParams(newParams);
  };

  const handlePriceChange = (min?: number, max?: number) => {
    updateParams({
      minPrice: min?.toString(),
      maxPrice: max?.toString(),
    });
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      dispatch(showToast({ message: 'Added to cart successfully', type: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: 'Failed to add to cart', type: 'error' }));
    }
  };

  const selectedCategories = categories.filter(c => categoryParams.includes(c._id));
  const categoryNames = selectedCategories.map(c => c.name).join(', ');

  return (
    <div className="container-responsive py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          {categoryNames ? categoryNames : searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-muted mt-2">{products.length} products found</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <SlidersHorizontal className="w-5 h-5 text-text" />
          Filters
        </button>

        <div className="flex-1">
          <Select
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'name_asc', label: 'Name: A to Z' },
              { value: 'rating', label: 'Highest Rated' },
            ]}
            value={sortParam}
            onChange={e => updateParams({ sort: e.target.value })}
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
          <FilterPanel
            categories={categories}
            selectedCategories={categoryParams}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onClear={handleClearFilters}
          />
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <ProductGrid products={products} onAddToCart={handleAddToCart} />
          )}
        </div>
      </div>
    </div>
  );
};
