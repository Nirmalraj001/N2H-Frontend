import { BulkOrderItem, Product } from '../types';

export function parseBulkOrderCSV(csv: string, products: Product[]): BulkOrderItem[] {
  const lines = csv.trim().split(/\r?\n/);
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const items: BulkOrderItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(cell => cell.trim());
    const rowObj: Record<string, string> = {};
    header.forEach((h, idx) => (rowObj[h] = row[idx]));
    const product = products.find(p => p.name.toLowerCase() === rowObj['product']?.toLowerCase() || p._id === rowObj['product']);
    if (!product) continue;
    const quantity = parseInt(rowObj['quantity'], 10);
    const price = product.price;
    items.push({
      id: `${product._id}-${i}`,
      bulkOrderId: '',
      productId: product._id,
      quantity,
      price,
      subtotal: price * quantity,
      sku: rowObj['sku'] || '',
      productName: product.name,
    });
  }
  return items;
}
