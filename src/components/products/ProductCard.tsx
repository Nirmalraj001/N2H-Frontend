import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import { useEffect, useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, quantity: number) => void;
  cartQuantity?: number;
}

export const ProductCard = ({ product, onAddToCart, cartQuantity = 0 }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantityInput, setShowQuantityInput] = useState(cartQuantity > 0);

  console.log({showQuantityInput,cartQuantity })

  useEffect(() => {
    setQuantity(cartQuantity);
    setShowQuantityInput(cartQuantity > 0);
  }, [cartQuantity]);

  const handleAddToCart = () => {
    if (onAddToCart) {
      const newQty = quantity + 1;
      onAddToCart(product._id, newQty);
      setShowQuantityInput(true);
    }
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      if (onAddToCart && showQuantityInput) {
        onAddToCart(product._id, 1);
      }
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      if (onAddToCart && showQuantityInput) {
        onAddToCart(product._id, -1);
      }
    }
  };
  return (
    <div className="card">
      <Link to={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-background rounded-t-xl">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-200"
            loading="lazy"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 sm:p-6">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg text-text hover:text-primary transition-all duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted text-sm mt-1 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mt-2">
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="text-sm font-medium text-text">{product.rating}</span>
              {product.reviews && (
                <span className="text-sm text-muted">({product.reviews})</span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {product.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-background text-muted text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-primary">₹{product.price}</p>
            {product.stock > 0 && product.stock < 10 && (
              <p className="text-xs text-orange-600 font-medium">Only {product.stock} left</p>
            )}
          </div>
          {onAddToCart && (
            <div>
              {!showQuantityInput ? (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDecrement}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-border transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <Minus className="w-4 h-4 text-text" />
                  </button>
                  <span className="font-semibold text-lg w-8 text-center text-text">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-primary hover:shadow-md text-white transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
