import React, { useEffect, useState } from 'react';
import { bulkOrderService } from '../../services/bulkOrderService';
import { BulkOrder } from '../../types';
import { Link } from 'react-router-dom';
import { exportAllBulkOrdersToCSV } from '../../utils/csvExporter';
import { exportAllBulkOrdersToExcel } from '../../utils/excelExporter';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-cyan-100 text-cyan-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AdminBulkOrders: React.FC = () => {
  const [orders, setOrders] = useState<BulkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bulkOrderService.getAllBulkOrders?.()
      .then(setOrders)
      .catch(() => setError('Failed to load bulk orders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleExportAll = (type: 'csv' | 'excel') => {
    if (orders.length === 0) return;
    if (type === 'csv') {
      exportAllBulkOrdersToCSV(orders);
    } else {
      exportAllBulkOrdersToExcel(orders);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Bulk Orders</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleExportAll('csv')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            disabled={orders.length === 0}
          >
            Export All as CSV
          </button>
          <button
            onClick={() => handleExportAll('excel')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            disabled={orders.length === 0}
          >
            Export All as Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Total Qty</th>
              <th className="p-2 border">Total Price</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="p-2 border">{order._id}</td>
                <td className="p-2 border">{order.userId.name}</td>
                <td className={`p-2 border ${statusColors[order.status] || ''}`}>{order.status}</td>
                <td className="p-2 border">{order.totalQuantity}</td>
                <td className="p-2 border">₹{order.totalPrice}</td>
                <td className="p-2 border">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-2 border">
                  <Link to={`/admin/bulk-orders/${order._id}`} className="text-primary underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBulkOrders;
