/* Formatting helpers: Indonesian rupiah, dates and small numbers. */

export function idr(n) {
  const v = Math.round(Number(n) || 0);
  const sign = v < 0 ? '-' : '';
  const digits = String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return sign + 'Rp ' + digits;
}

export function idrShort(n) {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 1e9) return 'Rp ' + (v / 1e9).toFixed(1).replace(/\.0$/, '') + ' M';
  if (Math.abs(v) >= 1e6) return 'Rp ' + (v / 1e6).toFixed(1).replace(/\.0$/, '') + ' jt';
  if (Math.abs(v) >= 1e3) return 'Rp ' + Math.round(v / 1e3) + ' rb';
  return idr(v);
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function monthName(iso) {
  const [y, m] = iso.split('-').map(Number);
  const names = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return names[m - 1] + ' ' + y;
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, Number(n) || 0));
}
