import * as XLSX from 'xlsx';
import { BulkOrder } from '../types';

export const exportBulkOrderToExcel = (order: BulkOrder) => {
  const metadata = [
    ['Order ID', order._id],
    ['Order Date', new Date(order.createdAt).toLocaleDateString()],
    ['Status', order.status],
    ['Total Quantity', order.totalQuantity],
    ['Total Price', `₹${order.totalPrice}`],
    []
  ];

  const headers = ['Product', 'SKU', 'Quantity', 'Unit Price', 'Subtotal'];

  const items = order.items?.map((item: any) => {
    const productName = typeof item.productId === 'object' && item.productId?.name
      ? item.productId.name
      : item.productName || 'N/A';
    const sku = item.sku || '-';

    return [
      productName,
      sku,
      item.quantity,
      item.price,
      item.subtotal
    ];
  }) || [];

  const sheetData = [...metadata, headers, ...items];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  ws['!cols'] = [
    { wch: 40 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bulk Order');

  XLSX.writeFile(wb, `bulk_order_${order._id}.xlsx`);
};

export const exportAllBulkOrdersToExcel = (orders: BulkOrder[]) => {
  const headers = ['Order ID', 'Customer', 'Status', 'Total Quantity', 'Total Price', 'Created Date'];

  const rows = orders.map((order: any) => {
    const customerName = typeof order.userId === 'object' && order.userId?.name
      ? order.userId.name
      : 'N/A';

    return [
      order._id,
      customerName,
      order.status,
      order.totalQuantity,
      order.totalPrice,
      new Date(order.createdAt).toLocaleDateString()
    ];
  });

  const sheetData = [headers, ...rows];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  ws['!cols'] = [
    { wch: 25 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'All Bulk Orders');

  XLSX.writeFile(wb, `all_bulk_orders_${new Date().toISOString().split('T')[0]}.xlsx`);
};
