import { BulkOrder } from '../types';

export const exportBulkOrderToCSV = (order: BulkOrder) => {
  const headers = ['Product', 'SKU', 'Quantity', 'Unit Price', 'Subtotal'];

  const rows = order.items?.map((item: any) => {
    const productName = typeof item.productId === 'object' && item.productId?.name
      ? item.productId.name
      : item.productName || 'N/A';
    const sku = item.sku || '-';

    return [
      `"${productName.replace(/"/g, '""')}"`,
      sku,
      item.quantity,
      item.price,
      item.subtotal
    ].join(',');
  }) || [];

  const metadataRows = [
    `Order ID,${order._id}`,
    `Order Date,${new Date(order.createdAt).toLocaleDateString()}`,
    `Status,${order.status}`,
    `Total Quantity,${order.totalQuantity}`,
    `Total Price,₹${order.totalPrice}`,
    '',
    headers.join(',')
  ];

  const csvContent = [...metadataRows, ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `bulk_order_${order._id}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportAllBulkOrdersToCSV = (orders: BulkOrder[]) => {
  const headers = ['Order ID', 'Customer', 'Status', 'Total Quantity', 'Total Price', 'Created Date'];

  const rows = orders.map((order: any) => {
    const customerName = typeof order.userId === 'object' && order.userId?.name
      ? order.userId.name
      : 'N/A';

    return [
      order._id,
      `"${customerName.replace(/"/g, '""')}"`,
      order.status,
      order.totalQuantity,
      order.totalPrice,
      new Date(order.createdAt).toLocaleDateString()
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `all_bulk_orders_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
