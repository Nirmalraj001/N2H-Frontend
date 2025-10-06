import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Package, Truck, Shield, Plus, Minus, Heart, Share2, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductGrid } from '../components/products/ProductGrid';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart, fetchCart, updateCartItem } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');

  const { data: product, isLoading } = useProduct(id || '');
  const { data: allProducts = [] } = useProducts({});
  const cartItems = useAppSelector(state => state.cart.items);

  const cartItem = cartItems.find(item => item.product._id === id);
  const inCart = !!cartItem;

  const productList = allProducts?.items || [];
  const suggestedProducts = productList.filter((p: Product) => p._id !== id && product && (p.category === product.category || p.tags.some((tag: string) => product.tags.includes(tag))))
    .slice(0, 4);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem?.quantity);   // always reflect actual cart quantity
    } else {
      setQuantity(1);
    }
  }, [cartItem]);

  console.log({cartItem})

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      if (inCart) {
        // update existing cart quantity
        await dispatch(updateCartItem({ productId: product._id, quantity })).unwrap();
        dispatch(showToast({ message: `Updated cart to ${quantity} item(s)`, type: 'success' }));
      } else {
        // add new item
        await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
        dispatch(showToast({ message: `Added ${quantity} item(s) to cart`, type: 'success' }));
      }
    } catch {
      dispatch(showToast({ message: 'Failed to update cart', type: 'error' }));
    }
  };


  const handleIncrement = async () => {
    if (!product || quantity >= product.stock) return;
    const newQty = quantity + 1;
    setQuantity(newQty);

    if (inCart) {
      try {
        await dispatch(updateCartItem({ productId: product._id, quantity: newQty })).unwrap();
      } catch (err) {
        dispatch(showToast({ message: 'Failed to update cart', type: 'error' }));
      }
    }
  };

  const handleDecrement = async () => {
    if (!product || quantity <= 1) return;
    const newQty = quantity - 1;
    setQuantity(newQty);

    if (inCart) {
      try {
        await dispatch(updateCartItem({ productId: product._id, quantity: newQty })).unwrap();
      } catch (err) {
        dispatch(showToast({ message: 'Failed to update cart', type: 'error' }));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-6 shadow-md">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-100 rounded-xl overflow-hidden border-3 transition-all hover:scale-105 ${selectedImage === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent'
                        }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

                <div className="flex items-center gap-4 mb-6">
                  {product.rating && (
                    <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">{product.rating}</span>
                      {product.reviews && (
                        <span className="text-gray-600">({product.reviews} reviews)</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <div className="flex items-baseline gap-3 mb-3">
                  <div className="text-5xl font-bold text-gray-900">₹{product.price}</div>
                  <div className="text-2xl text-gray-400 line-through">₹{Math.round(product.price * 1.2)}</div>
                </div>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <p className="text-green-600 font-semibold text-lg">In Stock ({product.stock} available)</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <p className="text-red-600 font-semibold text-lg">Out of Stock</p>
                  </div>
                )}
              </div>

              <div className="space-y-6 mb-8">
                {inCart ? (
                  // Already in cart -> show quantity controls
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={async () => {
                          if (!product) return;
                          if (quantity <= 1) {
                            // remove from cart
                            await dispatch(updateCartItem({ productId: product._id, quantity: 0 })).unwrap();
                            setQuantity(1);
                          } else {
                            handleDecrement();
                          }
                        }}
                        className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
                        disabled={quantity <= 0}
                      >
                        <Minus className="w-6 h-6" />
                      </button>
                      <span className="text-4xl font-bold w-24 text-center">{quantity}</span>
                      <button
                        onClick={handleIncrement}
                        className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all"
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Currently in cart: {cartItem?.quantity} items</p>
                  </div>
                ) : (
                  // Not in cart -> show Add button
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      className="flex-1"
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button size="lg" variant="outline" className="px-6">
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="px-6">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>


              {/* <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleDecrement}
                      className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <span className="text-4xl font-bold w-24 text-center">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  {inCart && <p className="text-sm text-gray-600 mt-2">Currently in cart: {cartItem?.quantity} items</p>}
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {inCart ? 'Update Cart' : 'Add to Cart'}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div> */}

              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="p-3 bg-blue-50 rounded-xl inline-block mb-2">
                    <Package className="w-7 h-7 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Premium Quality</p>
                  <p className="text-xs text-gray-500">Certified Products</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-green-50 rounded-xl inline-block mb-2">
                    <Truck className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-500">2-3 Business Days</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-orange-50 rounded-xl inline-block mb-2">
                    <Shield className="w-7 h-7 text-orange-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% Protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 px-2 font-semibold text-lg transition-all ${activeTab === 'description'
                ? 'text-blue-600 border-b-3 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 px-2 font-semibold text-lg transition-all ${activeTab === 'details'
                ? 'text-blue-600 border-b-3 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-2 font-semibold text-lg transition-all ${activeTab === 'reviews'
                ? 'text-blue-600 border-b-3 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Reviews
            </button>
          </div>

          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">100% Authentic</h4>
                    <p className="text-gray-600 text-sm">Sourced directly from trusted suppliers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Quality Assured</h4>
                    <p className="text-gray-600 text-sm">Rigorous quality control standards</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Fresh Products</h4>
                    <p className="text-gray-600 text-sm">Always fresh, never expired</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Easy Returns</h4>
                    <p className="text-gray-600 text-sm">7-day hassle-free return policy</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="flex py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-900 w-48">Product ID:</span>
                <span className="text-gray-600">{product?._id}</span>
              </div>
              <div className="flex py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-900 w-48">Category:</span>
                <span className="text-gray-600">{typeof product.category === 'string' ? product.category : product.category.name}</span>
              </div>
              <div className="flex py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-900 w-48">Stock:</span>
                <span className="text-gray-600">{product.stock} units</span>
              </div>
              <div className="flex py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-900 w-48">Tags:</span>
                <span className="text-gray-600">{product.tags.join(', ')}</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600">Be the first to review this product</p>
              </div>
            </div>
          )}
        </div>

        {suggestedProducts?.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <ProductGrid
              products={suggestedProducts}
              onAddToCart={async (productId, qty) => {
                try {
                  await dispatch(addToCart({ productId, quantity: qty })).unwrap();
                  dispatch(showToast({ message: 'Added to cart successfully', type: 'success' }));
                } catch {
                  dispatch(showToast({ message: 'Failed to add to cart', type: 'error' }));
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
