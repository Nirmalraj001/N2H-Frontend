import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { Order, BulkOrder } from '../types';
import { ordersAPI } from '../services/api';
import { bulkOrderService } from '../services/bulkOrderService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      try {
        const [normalOrders, userBulkOrders] = await Promise.all([
          ordersAPI.getAll(),
          bulkOrderService.getUserBulkOrders(user._id),
        ]);
        setOrders(normalOrders);
        setBulkOrders(userBulkOrders);
      } catch (error) {
        showToast('Failed to load orders', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [user]);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-cyan-100 text-cyan-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (orders.length === 0 && bulkOrders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-600 mb-6">Start shopping to create your first order</p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      </div>

      <div className="space-y-4">
        {/* Normal Orders */}
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="space-y-3 mb-4">
              {order.products.map((product, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{product.price * product.quantity}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold">₹{order.totalPrice?.toFixed(2)}</p>
              </div>
              <Link
                to={`/orders/${order._id}`}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                View Details
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ))}
        {/* Bulk Orders */}
        {bulkOrders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Bulk Order ID: {order._id}</p>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="space-y-3 mb-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.productId.name} </p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.subtotal}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm text-gray-600">Total Quantity</p>
                <p className="text-xl font-bold">{order.totalQuantity}</p>
                <p className="text-sm text-gray-600 mt-1">Total Amount</p>
                <p className="text-xl font-bold">₹{order.totalPrice?.toFixed(2)}</p>
              </div>
              <Link
                to={`/orders/bulk/${order._id}`}
                className="flex items-center gap-2 text-primary hover:text-blue-700"
              >
                View Bulk Order
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
