# Redux Usage Examples

This document provides examples of how to use Redux Toolkit in your components.

## Store Setup

The Redux store is configured in `src/store/index.ts` with the following slices:
- `auth` - Authentication state
- `cart` - Shopping cart state
- `ui` - UI state
- `categories` - Categories data
- `products` - Products data
- `orders` - Orders data
- `users` - Users data

## Using Redux in Components

### 1. Authentication Example

```tsx
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, logout } from '../store/slices/authSlice';

function LoginComponent() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (email: string, password: string) => {
    try {
      await dispatch(login({ email, password })).unwrap();
      // Login successful
    } catch (err) {
      // Handle error
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && <p>Welcome, {user.name}</p>}
    </div>
  );
}
```

### 2. Products Example

```tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/slices/productSlice';

function ProductsComponent() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ category: 'electronics', sort: 'price_asc' }));
  }, [dispatch]);

  const handleCreateProduct = async (productData) => {
    try {
      await dispatch(createProduct(productData)).unwrap();
      // Product created
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div>
      {loading && <p>Loading products...</p>}
      {error && <p>Error: {error}</p>}
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### 3. Categories Example

```tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../store/slices/categorySlice';

function CategoriesComponent() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDeleteCategory = async (id: string) => {
    await dispatch(deleteCategory(id)).unwrap();
  };

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
}
```

### 4. Orders Example

```tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders, createOrder, updateOrderStatus } from '../store/slices/orderSlice';

function OrdersComponent() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders(user.id));
    }
  }, [dispatch, user]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
  };

  return (
    <div>
      {orders.map((order) => (
        <div key={order.id}>Order #{order.id}</div>
      ))}
    </div>
  );
}
```

### 5. Users Example

```tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers, updateUser, addAddress } from '../store/slices/userSlice';

function UsersComponent() {
  const dispatch = useAppDispatch();
  const { users, currentProfile, loading } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddAddress = async (userId: string, address) => {
    await dispatch(addAddress({ userId, address })).unwrap();
  };

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 6. Cart Example

```tsx
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';

function CartComponent() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  const handleAddToCart = (productId: string, quantity: number) => {
    dispatch(addToCart({ productId, quantity }));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateCartItem({ productId, quantity }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.productId}>
          Quantity: {item.quantity}
        </div>
      ))}
    </div>
  );
}
```

## Available Actions

### Auth Slice
- `login(data)` - Login user
- `register(data)` - Register new user
- `forgotPassword(email)` - Request password reset
- `logout()` - Logout current user
- `setUser(user)` - Set user data
- `clearError()` - Clear error message

### Products Slice
- `fetchProducts(filters?)` - Fetch all products with optional filters
- `fetchProductById(id)` - Fetch single product
- `createProduct(data)` - Create new product
- `updateProduct({ id, data })` - Update product
- `deleteProduct(id)` - Delete product
- `clearError()` - Clear error message
- `clearCurrentProduct()` - Clear current product

### Categories Slice
- `fetchCategories()` - Fetch all categories
- `createCategory(data)` - Create new category
- `updateCategory({ id, data })` - Update category
- `deleteCategory(id)` - Delete category
- `clearError()` - Clear error message

### Orders Slice
- `fetchOrders(userId?)` - Fetch orders (optionally filter by user)
- `fetchOrderById(id)` - Fetch single order
- `createOrder(data)` - Create new order
- `updateOrderStatus({ id, status })` - Update order status
- `clearError()` - Clear error message
- `clearCurrentOrder()` - Clear current order

### Users Slice
- `fetchUsers()` - Fetch all users
- `fetchUserById(id)` - Fetch single user
- `updateUser({ id, data })` - Update user
- `addAddress({ userId, address })` - Add address to user
- `updateAddress({ userId, addressId, updates })` - Update user address
- `deleteAddress({ userId, addressId })` - Delete user address
- `clearError()` - Clear error message
- `setCurrentProfile(user)` - Set current profile

### Cart Slice
- `addToCart(item)` - Add item to cart
- `updateCartItem({ productId, quantity })` - Update cart item quantity
- `removeFromCart(productId)` - Remove item from cart
- `clearCart()` - Clear all items from cart

## Service Layer

Each service file wraps the `api.ts` functions:
- `authService` - Authentication operations
- `categoryService` - Category CRUD operations
- `productService` - Product CRUD operations
- `orderService` - Order management
- `userService` - User management

The services use localStorage for data persistence and include simulated network delays.
