export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const [y, m, d] = dateString.split('-');
    const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getMonthName(periodOrMonth) {
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  if (typeof periodOrMonth === 'number') {
    return MONTHS[periodOrMonth - 1] || '';
  }
  if (typeof periodOrMonth === 'string' && periodOrMonth.includes('-')) {
    const monthNum = parseInt(periodOrMonth.split('-')[1], 10);
    return MONTHS[monthNum - 1] || periodOrMonth;
  }
  return String(periodOrMonth);
}
