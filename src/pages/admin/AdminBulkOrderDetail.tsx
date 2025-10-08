import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bulkOrderService } from '../../services/bulkOrderService';
import { BulkOrder } from '../../types';
import { exportBulkOrderToCSV } from '../../utils/csvExporter';
import { exportBulkOrderToExcel } from '../../utils/excelExporter';

const statusOptions = [
  'pending',
  'approved',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const AdminBulkOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<BulkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    bulkOrderService.getBulkOrderById(id)
      .then((data) => {
        setOrder(data);
        setStatus(data.status);
      })
      .catch(() => setError('Failed to load bulk order.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (!id) return;
    setUpdating(true);
    setUpdateMsg(null);
    try {
      await bulkOrderService.updateBulkOrderStatus(id, newStatus);
      setUpdateMsg('Status updated successfully.');
      setOrder((prev) => prev ? { ...prev, status: newStatus as BulkOrder['status'] } : prev);
    } catch {
      setUpdateMsg('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleExport = (type: 'csv' | 'excel') => {
    if (!order) return;
    if (type === 'csv') {
      exportBulkOrderToCSV(order);
    } else {
      exportBulkOrderToExcel(order);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Bulk Order Detail (Admin)</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between mb-2">
          <div>
            <div className="text-sm text-gray-600">Order ID: {order._id}</div>
            <div className="text-sm text-gray-600">User ID: {order.userId}</div>
            <div className="text-sm text-gray-600">Placed on: {new Date(order.createdAt).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Status: 
              <select value={status} onChange={handleStatusChange} className="ml-2 border rounded px-2 py-1">
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
              </select>
              {updating && <span className="ml-2 text-xs text-gray-500">Updating...</span>}
              {updateMsg && <span className="ml-2 text-xs text-green-600">{updateMsg}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleExport('csv')} className="btn-primary">Export CSV</button>
            <button onClick={() => handleExport('excel')} className="btn-primary">Export Excel</button>
          </div>
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
                  <td className="p-2 border">{'-'}</td>
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

export default AdminBulkOrderDetail;
