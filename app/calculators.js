/* Money calculators: debt payoff, savings projection and the 50/30/20 split.
   Pure functions, so the pages and the tests can share them. */

/* Months to clear a loan, and total interest, at a fixed monthly payment.
   rate is the yearly percent; payment is per month. */
export function payoffMonths(balance, yearlyRate, monthlyPayment) {
  const r = yearlyRate / 100 / 12;
  const b = Number(balance) || 0;
  const p = Number(monthlyPayment) || 0;
  if (b <= 0) return { months: 0, totalInterest: 0, totalPaid: 0 };
  if (p <= 0) return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity };
  if (r <= 0) {
    const months = Math.ceil(b / p);
    return { months, totalInterest: 0, totalPaid: b };
  }
  if (p <= b * r) return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity };
  const months = Math.ceil(-Math.log(1 - (b * r) / p) / Math.log(1 + r));
  const totalPaid = months * p;
  return { months, totalInterest: Math.max(0, totalPaid - b), totalPaid };
}

/* Order debts by the avalanche method (highest rate first) and by the
   snowball method (smallest balance first). */
export function orderDebts(debts, method) {
  const rows = debts.map((d) => ({ ...d }));
  if (method === 'snowball') rows.sort((a, b) => a.balance - b.balance);
  else rows.sort((a, b) => b.rate - a.rate);
  return rows;
}

/* Months until a savings goal is reached at a fixed monthly contribution,
   with a small yearly return (e.g. a deposito at 4%). */
export function goalMonths(target, saved, monthly, yearlyReturn = 4) {
  const gap = target - saved;
  if (gap <= 0) return { months: 0, reached: true };
  if (monthly <= 0) return { months: Infinity, reached: false };
  const r = yearlyReturn / 100 / 12;
  let balance = saved;
  let months = 0;
  while (balance < target && months < 1200) {
    balance = balance * (1 + r) + monthly;
    months += 1;
  }
  /* reached means already there today; months is how long the rest takes. */
  return { months, reached: gap <= 0 };
}

/* Months from now to a date month-count away, as "Month Year". */
export function monthFromNow(months) {
  if (!Number.isFinite(months)) return '—';
  const d = new Date(2026, 10 + months, 1);
  const names = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return names[d.getMonth()] + ' ' + d.getFullYear();
}

/* 50/30/20 split of a monthly income. */
export function fiftyThirtyTwenty(income) {
  return {
    needs: Math.round(income * 0.5),
    wants: Math.round(income * 0.3),
    savings: Math.round(income * 0.2),
  };
}

/* How much of the income each category actually takes, for the dashboard. */
export function categoryShares(byCategoryRows, income) {
  return byCategoryRows.map((c) => ({
    ...c,
    share: income ? (c.actual / income) * 100 : 0,
  }));
}
