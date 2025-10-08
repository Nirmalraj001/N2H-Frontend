import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, ChevronLeft, ChevronRight, Flame, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/ui/Button';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart, fetchCart } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';
import { Product } from '../types';

const carouselBanners = [
  {
    title: 'Premium Quality Spices',
    subtitle: 'Experience the authentic taste of India',
    image: 'https://images.pexels.com/photos/4198939/pexels-photo-4198939.jpeg?auto=compress&cs=tinysrgb&w=1600',
    cta: 'Shop Spices',
    link: '/products?category=c1',
  },
  {
    title: 'Authentic Masala Blends',
    subtitle: 'Traditional recipes passed down generations',
    image: 'https://images.pexels.com/photos/4198843/pexels-photo-4198843.jpeg?auto=compress&cs=tinysrgb&w=1600',
    cta: 'Explore Masalas',
    link: '/products?category=c2',
  },
  {
    title: 'Premium Tea Collection',
    subtitle: 'Handpicked tea leaves from the finest estates',
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=1600',
    cta: 'Browse Tea',
    link: '/products?category=c4',
  },
];

export const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useAppDispatch();
const cartItems = useAppSelector(state => state.cart.items);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: allProducts = [], isLoading: productsLoading } = useProducts({ });

  const productList = allProducts || [];
  const featuredProducts = productList.slice(0, 8);
  const bestSellingProducts = productList.filter((p: Product) => p.rating && p.rating >= 4.5).slice(0, 4);
  const topCategories = categories.filter(c => !c.parentCategory);

  useEffect(() => {
      dispatch(fetchCart());
    }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (productId: string, quantity: number) => {
    dispatch(addToCart({ productId, quantity }));
    dispatch(showToast({ message: 'Added to cart successfully', type: 'success' }));
  };

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % carouselBanners.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + carouselBanners.length) % carouselBanners.length);

  const isLoading = categoriesLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted font-medium">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
        {carouselBanners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container-responsive w-full">
                <div className="max-w-xl lg:max-w-2xl text-white">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-xs sm:text-sm font-medium">Premium Collection</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-200 leading-relaxed">
                    {banner.subtitle}
                  </p>
                  <Link to={banner.link}>
                    <Button size="lg" variant="secondary" className="shadow-xl hover:shadow-2xl transition-all">
                      {banner.cta} <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-text" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-text" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {carouselBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-4 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="container-responsive py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-h2 text-text mb-3">Shop by Category</h2>
          <p className="text-base sm:text-lg text-muted">Discover our curated collection of premium products</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {topCategories.map(category => (
            <Link
              key={category._id}
              to={`/products?category=${category._id}`}
              className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-hover transition-all duration-200 hover:scale-105"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-200"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end">
                <div className="p-4 sm:p-6 text-white w-full">
                  <h3 className="font-bold text-base sm:text-lg lg:text-xl mb-1 sm:mb-2 group-hover:text-accent transition-all duration-200">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 hidden sm:block">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/categories">
            <Button variant="outline" size="lg">
              View All Categories <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container-responsive">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text">Featured Products</h2>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-muted">Our top-rated and most loved products</p>
            </div>
            <Link to="/products">
              <Button variant="outline" size="lg" className="hidden md:flex">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: Product) => {
                    const cartItem = cartItems.find(item => item.product._id === product._id);
                    return (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        cartQuantity={cartItem?.quantity || 0}
                      />
                    );
                  })}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 py-12 sm:py-16 lg:py-20">
        <div className="container-responsive">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text">Best Sellers</h2>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-muted">Customer favorites and trending items</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellingProducts.map((product: Product) => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-responsive py-12 sm:py-16 lg:py-20">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 text-white shadow-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs sm:text-sm font-semibold">Special Offer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">
              Get 10% Off Your First Order
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90 leading-relaxed">
              Subscribe to our newsletter and receive exclusive deals, recipes, and updates on new products.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl text-text focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg text-base sm:text-lg"
              />
              <Button size="lg" variant="secondary" className="shadow-xl hover:shadow-2xl">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container-responsive">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-h2 text-text mb-3">What Our Customers Say</h2>
            <p className="text-base sm:text-lg text-muted">Trusted by thousands of satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Priya Sharma',
                rating: 5,
                text: 'The quality of spices is outstanding! Fresh aroma and authentic taste. Highly recommended.',
              },
              {
                name: 'Rahul Patel',
                rating: 5,
                text: 'Best masala blends I have tried. The garam masala is perfect for all my dishes.',
              },
              {
                name: 'Anita Desai',
                rating: 4,
                text: 'Great selection and fast delivery. The packaging ensures everything stays fresh.',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-background p-6 sm:p-8 rounded-xl shadow-md hover:shadow-hover transition-all duration-200">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-text mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">{testimonial.text}</p>
                <p className="font-bold text-text text-base sm:text-lg">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
