import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, ChevronLeft, ChevronRight, Flame, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/ui/Button';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';

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

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: allProducts = [], isLoading: productsLoading } = useProducts({ });

  const featuredProducts = allProducts?.items?.slice(0, 8);
  const bestSellingProducts = allProducts?.items?.filter(p => p.rating && p.rating >= 4.5).slice(0, 4);
  const topCategories = categories.filter(c => !c.parentCategory);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <section className="relative h-[600px] overflow-hidden">
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
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-white">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">Premium Collection</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                    {banner.subtitle}
                  </p>
                  <Link to={banner.link}>
                    <Button size="lg" variant="secondary" className="shadow-xl hover:shadow-2xl transition-shadow">
                      {banner.cta} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-3 rounded-full transition-all hover:scale-110 shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-3 rounded-full transition-all hover:scale-110 shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-gray-900" />
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
          <p className="text-lg text-gray-600">Discover our curated collection of premium products</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {topCategories.map(category => (
            <Link
              key={category.id}
              to={`/products?category=${category._id}`}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end">
                <div className="p-6 text-white w-full">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-yellow-400 transition-colors">{category.name}</h3>
                  <p className="text-sm text-gray-200 line-clamp-2">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Featured Products</h2>
              </div>
              <p className="text-lg text-gray-600">Our top-rated and most loved products</p>
            </div>
            <Link to="/products">
              <Button variant="outline" size="lg" className="hidden md:flex">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
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

      <section className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Flame className="w-7 h-7 text-orange-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Best Sellers</h2>
              </div>
              <p className="text-lg text-gray-600">Customer favorites and trending items</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellingProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold">Special Offer</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              Get 10% Off Your First Order
            </h2>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Subscribe to our newsletter and receive exclusive deals, recipes, and updates on new products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg text-lg"
              />
              <Button size="lg" variant="secondary" className="shadow-xl hover:shadow-2xl">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Trusted by thousands of satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div key={index} className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">{testimonial.text}</p>
                <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
