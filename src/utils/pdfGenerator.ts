import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BulkOrder } from '../types';

export const generateBulkOrderInvoice = (order: BulkOrder) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('BULK ORDER INVOICE', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 35);
  doc.text(`Order ID: ${order._id}`, 14, 42);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 49);
  doc.text(`Status: ${order.status.toUpperCase()}`, 14, 56);

  if (order.userId && typeof order.userId === 'object' && 'name' in order.userId) {
    doc.text(`Customer: ${(order.userId as any).name}`, 14, 63);
    if ('email' in order.userId) {
      doc.text(`Email: ${(order.userId as any).email}`, 14, 70);
    }
  }

  const tableData = order.items?.map((item: any) => {
    const productName = typeof item.productId === 'object' && item.productId?.name
      ? item.productId.name
      : item.productName || 'N/A';
    const sku = item.sku || '-';

    return [
      productName,
      sku,
      item.quantity.toString(),
      `₹${item.price.toFixed(2)}`,
      `₹${item.subtotal.toFixed(2)}`
    ];
  }) || [];

  autoTable(doc, {
    startY: 80,
    head: [['Product', 'SKU', 'Quantity', 'Unit Price', 'Subtotal']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 80;

  doc.setFontSize(10);
  doc.text(`Total Quantity: ${order.totalQuantity}`, 140, finalY + 15);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Total Price: ₹${order.totalPrice.toFixed(2)}`, 140, finalY + 25);

  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text('Thank you for your business!', 105, finalY + 40, { align: 'center' });

  doc.save(`bulk_order_invoice_${order._id}.pdf`);
};
