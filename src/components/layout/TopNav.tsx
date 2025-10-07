import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, LogOut, Package, LayoutDashboard, Bell, Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSelector } from '../../store/hooks';
import { productsAPI, categoriesAPI } from '../../services/api';
import { Product, Category } from '../../types';

export const TopNav = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    products: Product[];
    categories: Category[];
  }>({ products: [], categories: [] });
  const { user, logout, isAdmin } = useAuth();
  const cartItems = useAppSelector(state => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchData = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults({ products: [], categories: [] });
        setShowSearchResults(false);
        return;
      }

      try {
        const [products, categories] = await Promise.all([
          productsAPI.getAll({ search: searchQuery }),
          categoriesAPI.getAll(),
        ]);

        const filteredCategories = categories.filter(c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults({
          products: products.slice(0, 5),
          categories: filteredCategories.slice(0, 3),
        });
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    const timeoutId = setTimeout(searchData, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSelectCategory = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/" className="flex items-center gap-2 transition-all duration-200 hover:scale-105">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-text">N2H Enterprises</span>
            </Link>

            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-field w-64 lg:w-96 pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />

                {showSearchResults && (searchResults.products.length > 0 || searchResults.categories.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-hover max-h-96 overflow-y-auto z-50">
                    {searchResults.categories.length > 0 && (
                      <div className="p-2 border-b border-border">
                        <p className="text-xs font-semibold text-muted uppercase px-2 py-1">Categories</p>
                        {searchResults.categories.map(category => (
                          <button
                            key={category._id}
                            onClick={() => handleSelectCategory(category._id)}
                            className="w-full text-left px-3 py-2 hover:bg-background rounded-lg flex items-center gap-2 transition-all duration-200"
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-background">
                              {category.image && (
                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" loading="lazy" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm text-text">{category.name}</p>
                              <p className="text-xs text-muted line-clamp-1">{category.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.products.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-semibold text-muted uppercase px-2 py-1">Products</p>
                        {searchResults.products.map(product => (
                          <button
                            key={product._id}
                            onClick={() => handleSelectProduct(product._id)}
                            className="w-full text-left px-3 py-2 hover:bg-background rounded-lg flex items-center gap-3 transition-all duration-200"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-background">
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm text-text">{product.name}</p>
                              <p className="text-sm text-primary font-semibold">₹{product.price}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 hover:bg-background rounded-full transition-all duration-200 hover:scale-110 hidden md:block focus:outline-none focus:ring-2 focus:ring-primary">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-text" />
            </button>

            <Link
              to="/cart"
              className="relative p-2 hover:bg-background rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-text" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-background rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-text" />
                  <span className="hidden md:block text-sm font-medium text-text">{user.name}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-hover py-2 z-20 border border-border">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-background transition-all duration-200 text-text"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-background transition-all duration-200 text-text"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-background transition-all duration-200 text-text"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package className="w-4 h-4" />
                        Orders
                      </Link>
                      <Link
                        to="/reviews"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-background transition-all duration-200 text-text"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Star className="w-4 h-4" />
                        My Reviews
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-background transition-all duration-200 w-full text-left text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block btn-primary"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-background rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Menu className="w-6 h-6 text-text" />
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-border">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-field w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              </div>
            </form>
            {!user && (
              <Link
                to="/login"
                className="block w-full btn-primary text-center"
                onClick={() => setShowMobileMenu(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
