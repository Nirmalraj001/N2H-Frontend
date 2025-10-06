import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { useAppSelector } from '../../store/hooks';

interface ProductGridProps {
  products: Product[] | { items: Product[] };
  onAddToCart?: (productId: string, quantity: number) => void;
}

export const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  const cartItems = useAppSelector(state => state.cart.items);

  const productList = Array.isArray(products) ? products : products?.items || [];

  if (productList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productList.map((product: Product) => {
        const cartItem = cartItems.find(item => item.productId === product._id);
        return (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
            cartQuantity={cartItem?.quantity || 0}
          />
        );
      })}
    </div>
  );
};
