import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bulkOrderService } from '../services/bulkOrderService';
import { BulkOrder } from '../types';

const BulkOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<BulkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    bulkOrderService.getBulkOrderById(id)
      .then(setOrder)
      .catch(() => setError('Failed to load bulk order.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadInvoice = () => {
    if (!id) return;
    window.open(`/api/bulk-orders/export/${id}`, '_blank');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Bulk Order Details</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between mb-2">
          <div>
            <div className="text-sm text-gray-600">Order ID: {order._id}</div>
            <div className="text-sm text-gray-600">Placed on: {new Date(order.createdAt).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Status: <span className="font-semibold">{order.status}</span></div>
          </div>
          <button onClick={handleDownloadInvoice} className="btn-primary">Download Invoice</button>
        </div>
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Products</h2>
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Product</th>
                <th className="p-2 border">SKU</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Unit Price</th>
                <th className="p-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{item.productId.name}</td>
                  <td className="p-2 border">{ '-'}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">₹{item.price}</td>
                  <td className="p-2 border">₹{item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
          <div>
            <div className="text-sm text-gray-600">Total Quantity: <span className="font-bold">{order.totalQuantity}</span></div>
            <div className="text-lg font-bold">Total Price: ₹{order.totalPrice}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderDetail;
