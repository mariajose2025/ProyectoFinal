export function calculateStockAlert(currentStock, minimumStock) {
  if (currentStock > minimumStock) return 'green';
  if (currentStock === minimumStock) return 'yellow';
  return 'red';
}

export function calculateExpiryAlert(expiryDate, thresholds) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry > thresholds.expiryYellow) return 'green';
  if (daysUntilExpiry > thresholds.expiryRed) return 'yellow';
  return 'red';
}

export function getAlertColor(level) {
  const colors = {
    green: '#22c55e',
    yellow: '#eab308',
    red: '#ef4444'
  };
  return colors[level] || colors.green;
}

export function getAlertLabel(level) {
  const labels = {
    green: 'Normal',
    yellow: 'Alerta',
    red: 'Crítico'
  };
  return labels[level] || 'Normal';
}

export function getDaysUntilExpiry(expiryDate) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
}
