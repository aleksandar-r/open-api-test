const REPORT_ORDER_KEY = 'report-order';

function getStoredOrder() {
  try {
    const parsed = JSON.parse(localStorage.getItem(REPORT_ORDER_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrderToStorage(order: string[]) {
  localStorage.setItem(REPORT_ORDER_KEY, JSON.stringify(order));
}

export { getStoredOrder, saveOrderToStorage };
