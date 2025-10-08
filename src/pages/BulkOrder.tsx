
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseBulkOrderCSV } from '../lib/bulkOrderCsv';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { BulkOrderItem, Product } from '../types';
import { productService } from '../services/productService';
import { bulkOrderService } from '../services/bulkOrderService';
import { useAuth } from '../contexts/AuthContext';

const emptyRow = (products: Product[]): BulkOrderItem => ({
  id: Math.random().toString(36).slice(2),
  bulkOrderId: '',
  productId: '',
  quantity: 1,
  price: 0,
  subtotal: 0,
  sku: '',
  productName: '',
});

const BulkOrder: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [rows, setRows] = useState<BulkOrderItem[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<{ [idx: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    productService.getAllProducts().then(setProducts);
    setRows([emptyRow([])]);
  }, []);

  console.log({products})

  const validateRow = (row: BulkOrderItem): string => {
    if (!row.productId) return 'Select a product.';
    const prod = products.find(p => p._id === row.productId);
    if (!prod) return 'Invalid product.';
    if (!row.quantity || row.quantity < 1) return 'Quantity must be at least 1.';
    if (row.quantity > prod.stock) return `Only ${prod.stock} in stock.`;
    if (row.quantity < 1) return 'Minimum quantity is 1.';
    if (row.quantity > 1000) return 'Maximum quantity is 1000.';
    return '';
  };

  const handleRowChange = (idx: number, field: keyof BulkOrderItem, value: any) => {
    setRows(prev => {
      const updated = [...prev];
      let row = { ...updated[idx] };
      if (field === 'productId') {
        const prod = products.find(p => p._id === value);
        row.productId = value;
        row.productName = prod?.name || '';
        row.price = prod?.price || 0;
        row.sku = '';
        row.subtotal = row.price * (row.quantity || 1);
      } else if (field === 'quantity') {
        row.quantity = Number(value);
        row.subtotal = row.price * row.quantity;
      } else {
        (row as any)[field] = value;
      }
      updated[idx] = row;
      // Validate row
      const error = validateRow(row);
      setRowErrors(prevErrs => ({ ...prevErrs, [idx]: error }));
      return updated;
    });
  };

  const handleAddRow = () => setRows(prev => [...prev, emptyRow(products)]);
  const handleRemoveRow = (idx: number) => setRows(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = parseBulkOrderCSV(text, products);
        if (parsed.length === 0) throw new Error('No valid products found in CSV.');
        setRows(parsed);
        setCsvError(null);
      } catch (err) {
        setCsvError('Invalid CSV format.');
      }
    };
    reader.readAsText(file);
  };

  const totalQuantity = rows.reduce((sum, r) => sum + (r.quantity || 0), 0);
  const totalPrice = rows.reduce((sum, r) => sum + (r.subtotal || 0), 0);

  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const handleCheckout = async () => {
    setSubmitError(null);
    setSuccess(null);
    // Validate all rows before submit
    const errors: { [idx: number]: string } = {};
    rows.forEach((row, idx) => {
      const err = validateRow(row);
      if (err) errors[idx] = err;
    });
    setRowErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitError('Please fix errors before submitting.');
      return;
    }
    if (!user) {
      setSubmitError('You must be logged in.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        userId: user._id,
        totalQuantity,
        totalPrice,
        status: 'pending' as 'pending',
        items: rows.map(({ id, bulkOrderId, ...rest }) => rest),
      };
      const result = await bulkOrderService.createBulkOrder(payload);
      const orderId = result?.id || result?._id;
      setSuccess('Bulk order placed successfully!');
      setCreatedOrderId(orderId);
      setRows([emptyRow(products)]);
      // Optionally redirect after short delay
      setTimeout(() => {
        if (orderId) navigate(`/orders/bulk/${orderId}`);
      }, 2000);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || 'Failed to place bulk order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-responsive py-8">
      <h1 className="text-2xl font-bold mb-4">Bulk Order</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <label className="block font-medium mb-1">Upload CSV/Excel</label>
            <input type="file" accept=".csv,.xlsx" onChange={handleCsvUpload} />
            {csvError && <p className="text-red-500 text-sm mt-1">{csvError}</p>}
          </div>
          <Button variant="outline" onClick={handleAddRow}>Add Row</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Product</th>
                {/* <th className="p-2 border">SKU</th> */}
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Subtotal</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id}>
                  <td className="p-2 border min-w-[200px]">
                    <Select
                      options={products.map(p => ({ value: p._id, label: p.name }))}
                      value={row.productId}
                      onChange={e => handleRowChange(idx, 'productId', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  {/* <td className="p-2 border">
                    <Input
                      value={row.sku || ''}
                      onChange={e => handleRowChange(idx, 'sku', e.target.value)}
                      className="w-28"
                    />
                  </td> */}
                  <td className="p-2 border">
                    <Input
                      type="number"
                      min={1}
                      value={row.quantity}
                      onChange={e => handleRowChange(idx, 'quantity', e.target.value)}
                      className="w-20"
                    />
                  </td>
                  <td className="p-2 border">₹{row.price}</td>
                  <td className="p-2 border">₹{row.subtotal}</td>
                  <td className="p-2 border">
                    <Button variant="danger" size="sm" onClick={() => handleRemoveRow(idx)} disabled={rows.length === 1}>Remove</Button>
                  </td>
                </tr>
              ))}
              {rows.map((row, idx) => rowErrors[idx] && (
                <tr key={row.id + '-err'}>
                  <td colSpan={6} className="p-2 border text-red-600 text-xs">{rowErrors[idx]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <div>
            <div>Total Items: <span className="font-bold">{totalQuantity}</span></div>
            <div>Total Cost: <span className="font-bold">₹{totalPrice}</span></div>
            <div>Shipping Estimate: <span className="font-bold">(calculated at checkout)</span></div>
          </div>
          <Button variant="primary" size="lg" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Placing Order...' : 'Proceed to Checkout'}
          </Button>
        </div>
        {submitError && <div className="text-red-600 text-sm mt-4">{submitError}</div>}
        {success && (
          <div className="text-green-600 text-sm mt-4">
            {success}
            {createdOrderId && (
              <>
                {' '}<a href={`/orders/bulk/${createdOrderId}`} className="underline text-primary ml-2">View Order Details</a>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkOrder;
