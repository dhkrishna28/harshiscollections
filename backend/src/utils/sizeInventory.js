function normalizeSizeInventory(input) {
  if (!input) return [];

  let parsed = input;
  if (typeof input === 'string') {
    try {
      parsed = JSON.parse(input);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  const seen = new Set();
  return parsed
    .map((item) => ({
      size: String(item?.size || '').trim(),
      stock_quantity: Number(item?.stock_quantity || 0),
    }))
    .filter((item) => item.size.length > 0)
    .filter((item) => {
      const key = item.size.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((item) => ({
      size: item.size,
      stock_quantity: Math.max(0, Math.floor(item.stock_quantity)),
      availability_status: item.stock_quantity > 0 ? 'in_stock' : 'out_of_stock',
    }));
}

function getInventorySummary(sizeInventory) {
  const normalized = normalizeSizeInventory(sizeInventory);
  const stock_quantity = normalized.reduce((sum, item) => sum + item.stock_quantity, 0);
  return {
    sizes: normalized.map((item) => item.size),
    size_inventory: normalized,
    stock_quantity,
    availability_status: stock_quantity > 0 ? 'in_stock' : 'out_of_stock',
  };
}

function getSizeInventoryEntry(sizeInventory, selectedSize) {
  if (!selectedSize) return null;
  const normalized = normalizeSizeInventory(sizeInventory);
  return normalized.find((item) => item.size === selectedSize) || null;
}

module.exports = {
  normalizeSizeInventory,
  getInventorySummary,
  getSizeInventoryEntry,
};
