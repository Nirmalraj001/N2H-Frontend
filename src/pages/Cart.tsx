import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';

export const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector(state => state.cart.items);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.product ? item.product.price * (item.quantity || 0) : 0);
  }, 0);

  const handleIncrement = async (productId: string, quantity: number, stock: number) => {
    if (quantity >= stock) return;
    try {
      await dispatch(updateCartItem({ productId, quantity: quantity + 1 })).unwrap();
      dispatch(showToast({ message: 'Quantity updated', type: 'success' }));
    } catch {
      dispatch(showToast({ message: 'Failed to update cart', type: 'error' }));
    }
  };

  const handleDecrement = async (productId: string, quantity: number) => {
    // if (quantity <= 1) return;
    try {
      await dispatch(updateCartItem({ productId, quantity: quantity - 1 })).unwrap();
      dispatch(showToast({ message: 'Quantity updated', type: 'success' }));
    } catch {
      dispatch(showToast({ message: 'Failed to update cart', type: 'error' }));
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      dispatch(showToast({ message: 'Removed from cart', type: 'success' }));
    } catch {
      dispatch(showToast({ message: 'Failed to remove item', type: 'error' }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products to get started</p>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => {
            return (
              <div key={item.product._id} className="bg-white rounded-lg shadow-md p-6 flex gap-4">
                <img
                  src={item.product?.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Link to={`/products/${item.product._id}`} className="font-semibold text-lg hover:text-blue-600">
                    {item.product.name}
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">{item.product.description.slice(0, 100)}...</p>
                  <p className="text-xl font-bold text-gray-900 mt-2">₹{item.product.price}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrement(item.product._id, item.quantity || 0)}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4 mx-auto" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity || 0}</span>
                    <button
                      onClick={() => handleIncrement(item.product._id, item.quantity || 0, item.product.stock)}
                      disabled={(item.quantity || 0) >= item.product.stock}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{cartTotal?.toFixed(2) }</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹40</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-xl">₹{cartTotal?.toFixed(2) + 40}</span>
              </div>
            </div>
            <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
            <Link to="/products">
              <Button fullWidth variant="outline" className="mt-3">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
