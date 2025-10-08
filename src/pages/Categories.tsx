import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { ArrowRight, Grid3x3, Layers } from 'lucide-react';

export const Categories = () => {
  const { data: categories = [], isLoading, error } = useCategories();

  const parentCategories = categories.filter(c => !c.parentCategory);
  const getSubCategories = (parentId: string) =>
    categories.filter(c => c.parentCategory === parentId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load categories</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-12 sm:py-16 lg:py-20">
        <div className="container-responsive">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Grid3x3 className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Explore Our Collection</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6">
              Browse Categories
            </h1>
            <p className="text-lg sm:text-xl text-muted leading-relaxed">
              Discover our wide range of premium products organized by category. Find exactly what you're looking for.
            </p>
          </div>
        </div>
      </div>

      <div className="container-responsive py-12 sm:py-16 lg:py-20">
        {parentCategories.length === 0 ? (
          <div className="text-center py-16">
            <Layers className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
            <p className="text-xl text-muted">No categories available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {parentCategories.map(category => {
              const subCategories = getSubCategories(category._id);

              return (
                <div key={category._id} className="group">
                  <Link
                    to={`/products?category=${category._id}`}
                    className="block relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-hover transition-all duration-300 mb-4"
                  >
                    <img
                      src={category.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                      <div className="p-6 text-white w-full">
                        <h2 className="font-bold text-2xl mb-2 group-hover:text-accent transition-colors duration-200">
                          {category.name}
                        </h2>
                        {category.description && (
                          <p className="text-sm text-gray-200 line-clamp-2 mb-3">
                            {category.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all duration-200">
                          <span>Shop Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {subCategories.length > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="text-sm font-semibold text-muted uppercase mb-3 flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Subcategories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {subCategories.map(subCategory => (
                          <Link
                            key={subCategory._id}
                            to={`/products?category=${subCategory._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background hover:bg-primary/10 rounded-lg text-sm font-medium text-text hover:text-primary transition-all duration-200 hover:scale-105"
                          >
                            {subCategory.name}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-accent/5 py-12 sm:py-16">
        <div className="container-responsive text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
            Browse all our products or use the search feature to find specific items.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            View All Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
