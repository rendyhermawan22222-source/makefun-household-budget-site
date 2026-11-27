/* Page renderers. Every page is real HTML built from the household state,
   with working forms: add, edit and delete rows, toggle bills, change
   quantities, and every total recomputes from the same numbers. */

import { idr, idrShort, pct, monthName, esc } from './format.js';
import { totals, byCategory, billsDue, goalsSummary, groceryTotal, sum } from './store.js';
import { payoffMonths, orderDebts, goalMonths, monthFromNow, fiftyThirtyTwenty } from './calculators.js';
import { TIPS } from './data.js';

export const NAV = [
  ['#/', 'Dashboard'],
  ['#/planner', 'Budget planner'],
  ['#/tracker', 'Monthly tracker'],
  ['#/goals', 'Savings goals'],
  ['#/bills', 'Bills & reminders'],
  ['#/grocery', 'Market prices'],
  ['#/debt', 'Debt payoff'],
  ['#/tips', 'Money tips'],
];

export function navHtml(route) {
  return NAV.map(([href, label]) => {
    const active = (route === href.slice(2) || (route === '' && href === '#/')) ? ' aria-current="page"' : '';
    return `<a href="${href}"${active}>${label}</a>`;
  }).join('');
}

function progressBar(done, total) {
  const p = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
  return `<div class="bar" role="img" aria-label="${p}% complete"><span style="width:${p}%"></span></div>`;
}

function moneyInput(value, attrs) {
  return `<input type="number" min="0" step="1000" value="${value}" ${attrs}>`;
}

/* ---------------- Dashboard ---------------- */

export function dashboard(state) {
  const t = totals(state);
  const cats = byCategory(state);
  const bills = billsDue(state);
  const goals = goalsSummary(state);
  const split = fiftyThirtyTwenty(t.income);
  const needs = cats.filter((c) => ['Food', 'Home', 'Health', 'Education', 'Transport'].includes(c.category))
    .reduce((s, c) => s + c.actual, 0);
  return `
<section class="hero">
  <div>
    <p class="kicker">Keluarga Santoso · Jakarta · November 2026</p>
    <h1>Our household budget, <em>under control.</em></h1>
    <p class="lede">One page for the whole family’s money: what comes in, what goes out, what is due next, and what we are saving for. Every figure below is live — change a number in the planner and this page moves with it.</p>
    <p class="cta-row"><a class="btn" href="#/planner">Open the budget planner →</a> <a class="btn ghost" href="#/tracker">See 6 months of spending</a></p>
  </div>
  <div class="hero-card">
    <p class="card-label">Left to spend this month</p>
    <p class="big">${idr(t.remaining)}</p>
    <p class="muted">${t.savedRate}% of income saved · ${idr(t.spent)} spent of ${idr(t.income)} earned</p>
    ${progressBar(t.income - t.spent, t.income)}
    <p class="muted">Needs take ${idr(needs)} (${pct(needs, t.income)}% of income) — the 50/30/20 target is ${idr(split.needs)}.</p>
  </div>
</section>

<section class="cards" aria-label="Month summary">
  <article class="card"><p class="card-label">Income</p><p class="num">${idr(t.income)}</p><p class="muted">${state.income.length} sources · gaji, warung kopi, freelance</p></article>
  <article class="card"><p class="card-label">Spent so far</p><p class="num">${idr(t.spent)}</p><p class="muted">Budgeted ${idr(t.budgeted)} · ${t.overBudget.length} line${t.overBudget.length === 1 ? '' : 's'} over budget</p></article>
  <article class="card"><p class="card-label">Saved this month</p><p class="num good">${idr(t.remaining)}</p><p class="muted">${t.savedRate}% savings rate — target 20%</p></article>
  <article class="card"><p class="card-label">Bills still to pay</p><p class="num">${idr(bills.unpaidTotal)}</p><p class="muted">${bills.unpaid.length} unpaid · next: ${bills.next ? esc(bills.next.name) + ' — ' + idr(bills.next.amount) + ' due the ' + bills.next.due + 'th' : 'all paid'}</p></article>
</section>

<section class="grid2">
  <article class="panel">
    <h2>Where the money goes</h2>
    <canvas id="chart-donut" width="360" height="190" aria-label="Donut chart of spending by category"></canvas>
    <ul class="bars">${cats.map((c) => `<li><span>${esc(c.category)}</span><span class="bar"><span style="width:${pct(c.actual, t.income)}%"></span></span><b>${idrShort(c.actual)}</b></li>`).join('')}</ul>
  </article>
  <article class="panel">
    <h2>Savings goals — ${idr(goals.saved)} of ${idr(goals.target)}</h2>
    ${state.goals.map((g) => `<p class="goal-line"><a href="#/goals">${esc(g.name)}</a> <b>${pct(g.saved, g.target)}%</b></p>${progressBar(g.saved, g.target)}`).join('')}
    <p class="muted">Putting aside ${idr(goals.monthly)} a month across ${state.goals.length} goals.</p>
    <h2>Coming up</h2>
    <ul class="plain">${bills.unpaid.slice().sort((a, b) => a.due - b.due).slice(0, 4).map((b) => `<li><b>${b.due} Nov</b> — ${esc(b.name)} · ${idr(b.amount)}</li>`).join('')}</ul>
    <p><a href="#/bills">All bills &amp; reminders →</a></p>
  </article>
</section>

<section class="panel">
  <h2>Over budget this month — fix these first</h2>
  ${t.overBudget.length ? `<ul class="plain">${t.overBudget.map((e) => `<li><b>${esc(e.name)}</b>: spent ${idr(e.actual)} against a ${idr(e.budget)} budget — <b class="bad">${idr(e.actual - e.budget)} over</b>. ${e.category === 'Food' ? 'Cook at home twice more this week and the gap closes.' : 'Move the difference from the Fun budget.'}</li>`).join('')}</ul>` : '<p>Nothing is over budget. Well done — keep it that way.</p>'}
  <p><a href="#/planner">Adjust the budget →</a> <a href="#/grocery">Check market prices →</a> <a href="#/debt">Attack the debts →</a></p>
</section>`;
}

/* ---------------- Budget planner ---------------- */

export function planner(state) {
  const t = totals(state);
  const split = fiftyThirtyTwenty(t.income);
  return `
<h1>Budget planner — November 2026</h1>
<p class="lede">Plan the month before it happens. Edit any budget or actual figure and the totals, the savings rate and the 50/30/20 split update at once. Add your own rows; delete what does not apply.</p>

<section class="grid2">
  <article class="panel">
    <h2>Income — ${idr(t.income)} / month</h2>
    <table>
      <thead><tr><th>Source</th><th>Amount</th><th></th></tr></thead>
      <tbody>${state.income.map((r) => `<tr>
        <td>${esc(r.source)} <span class="tag">${esc(r.kind)}</span></td>
        <td>${moneyInput(r.amount, `data-action="income-amount" data-id="${r.id}" aria-label="Amount for ${esc(r.source)}"`)}</td>
        <td><button class="mini" data-action="del-income" data-id="${r.id}">Delete</button></td></tr>`).join('')}</tbody>
    </table>
    <form data-form="add-income" class="addrow">
      <input name="source" required placeholder="New income source, e.g. Overtime pay" aria-label="New income source">
      <input name="amount" type="number" min="0" step="1000" required placeholder="Amount (Rp)" aria-label="Amount">
      <button class="btn small" type="submit">+ Add income</button>
    </form>
  </article>
  <article class="panel">
    <h2>The 50/30/20 rule for ${idr(t.income)}</h2>
    <ul class="plain">
      <li><b>50% needs — ${idr(split.needs)}:</b> food, PLN, PDAM, BPJS, school, transport.</li>
      <li><b>30% wants — ${idr(split.wants)}:</b> eating out, outings, streaming.</li>
      <li><b>20% savings &amp; debt — ${idr(split.savings)}:</b> emergency fund, goals, extra loan payments.</li>
    </ul>
    <p class="muted">This household spends ${pct(sum(state.expenses.filter((e) => ['Food', 'Home', 'Health', 'Education', 'Transport'].includes(e.category)), 'actual'), t.income)}% on needs, ${pct(sum(state.expenses.filter((e) => e.category === 'Fun'), 'actual'), t.income)}% on wants and saves ${t.savedRate}%. The eating-out line is the easiest cut.</p>
    <p><a href="#/tips">8 money tips that actually work →</a></p>
  </article>
</section>

<section class="panel">
  <h2>Expenses — budgeted ${idr(t.budgeted)} · actually spent ${idr(t.spent)}</h2>
  <p class="verdict ${t.spent <= t.budgeted ? 'good' : 'bad'}">${t.spent <= t.budgeted ? `✓ Under budget by ${idr(t.budgeted - t.spent)}.` : `⚠ Over the total budget by ${idr(t.spent - t.budgeted)}.`} <b>${idr(t.remaining)} left</b> from ${idr(t.income)} income.</p>
  <div class="tablewrap"><table>
    <thead><tr><th>Expense</th><th>Category</th><th>Budget</th><th>Actually spent</th><th>Status</th><th></th></tr></thead>
    <tbody>${state.expenses.map((e) => {
      const over = e.actual > e.budget;
      return `<tr>
        <td>${esc(e.name)}</td><td>${esc(e.category)}</td>
        <td>${moneyInput(e.budget, `data-action="exp-budget" data-id="${e.id}" aria-label="Budget for ${esc(e.name)}"`)}</td>
        <td>${moneyInput(e.actual, `data-action="exp-actual" data-id="${e.id}" aria-label="Spent on ${esc(e.name)}"`)}</td>
        <td>${over ? `<b class="bad">+${idr(e.actual - e.budget)} over</b>` : `<span class="good">${idr(e.budget - e.actual)} left</span>`}</td>
        <td><button class="mini" data-action="del-expense" data-id="${e.id}">Delete</button></td></tr>`;
    }).join('')}</tbody>
  </table></div>
  <form data-form="add-expense" class="addrow">
    <input name="name" required placeholder="New expense, e.g. Les piano Putri" aria-label="Expense name">
    <select name="category" aria-label="Category"><option>Food</option><option>Home</option><option>Health</option><option>Education</option><option>Transport</option><option>Debt</option><option>Fun</option><option>Other</option></select>
    <input name="budget" type="number" min="0" step="1000" required placeholder="Budget (Rp)" aria-label="Budget">
    <input name="actual" type="number" min="0" step="1000" value="0" required placeholder="Spent (Rp)" aria-label="Spent">
    <button class="btn small" type="submit">+ Add expense</button>
  </form>
  <p><button class="mini" data-action="reset-data">Reset to the original November figures</button></p>
</section>`;
}

/* ---------------- Monthly tracker ---------------- */

export function tracker(state) {
  const rows = state.months;
  const best = rows.reduce((b, m) => (m.income - m.spent > b.income - b.spent ? m : b), rows[0]);
  return `
<h1>Monthly tracker — June to November 2026</h1>
<p class="lede">Six months of income against spending. Green is income, terracotta is spending — the gap between them is what the family kept. Edit a month’s spending and the chart and the savings column move with it.</p>
<section class="panel">
  <canvas id="chart-bars" width="900" height="300" aria-label="Bar chart of income versus spending for six months"></canvas>
  <p class="muted">Best month so far: <b>${monthName(best.month)}</b> — saved ${idr(best.income - best.spent)} (${pct(best.income - best.spent, best.income)}% of income).</p>
</section>
<section class="panel">
  <div class="tablewrap"><table>
    <thead><tr><th>Month</th><th>Income</th><th>Spent</th><th>Saved</th><th>Savings rate</th></tr></thead>
    <tbody>${rows.map((m) => `<tr>
      <td><b>${monthName(m.month)}</b></td>
      <td>${idr(m.income)}</td>
      <td>${moneyInput(m.spent, `data-action="month-spent" data-id="${m.month}" aria-label="Spent in ${monthName(m.month)}"`)}</td>
      <td class="good"><b>${idr(m.income - m.spent)}</b></td>
      <td>${pct(m.income - m.spent, m.income)}%</td></tr>`).join('')}</tbody>
  </table></div>
  <p class="muted">Average saved per month: <b>${idr(Math.round(rows.reduce((s, m) => s + m.income - m.spent, 0) / rows.length))}</b>. November is the strongest month — market spending fell after the family switched to twice-weekly pasar trips.</p>
  <p><a href="#/planner">Plan next month →</a> <a href="#/goals">Put the savings to work →</a></p>
</section>`;
}

/* ---------------- Savings goals ---------------- */

export function goals(state) {
  const g = goalsSummary(state);
  return `
<h1>Savings goals</h1>
<p class="lede">Four things the family is saving for, with a monthly contribution each and the month each goal is reached. Change a contribution and the finish date updates — the maths uses a 4% yearly deposito return.</p>
<p class="verdict good">Saving <b>${idr(g.saved)}</b> of <b>${idr(g.target)}</b> in total (${pct(g.saved, g.target)}%) · setting aside <b>${idr(g.monthly)} / month</b>.</p>
<section class="grid2">
${state.goals.map((goal) => {
  const calc = goalMonths(goal.target, goal.saved, goal.monthly);
  return `<article class="panel">
    <h2>${esc(goal.name)}</h2>
    <p class="big">${idr(goal.saved)}</p>
    <p class="muted">of ${idr(goal.target)} target · ${pct(goal.saved, goal.target)}% there</p>
    ${progressBar(goal.saved, goal.target)}
    <p>${esc(goal.note)}</p>
    <label>Monthly contribution (Rp)
      ${moneyInput(goal.monthly, `data-action="goal-monthly" data-id="${goal.id}" aria-label="Monthly contribution to ${esc(goal.name)}"`)}</label>
    <p class="verdict ${calc.reached ? 'good' : ''}">${calc.reached ? '✓ Goal reached.' : `At this pace: <b>${goalMonths(goal.target, goal.saved, goal.monthly).months} months</b> to go — done around <b>${monthFromNow(calc.months)}</b>.`}</p>
    <p><button class="mini" data-action="del-goal" data-id="${goal.id}">Delete goal</button></p>
  </article>`;
}).join('')}
</section>
<section class="panel">
  <h2>Add a savings goal</h2>
  <form data-form="add-goal" class="addrow">
    <input name="name" required placeholder="Goal name, e.g. Umroh fund" aria-label="Goal name">
    <input name="target" type="number" min="0" step="100000" required placeholder="Target (Rp)" aria-label="Target">
    <input name="saved" type="number" min="0" step="100000" value="0" required placeholder="Saved so far (Rp)" aria-label="Saved so far">
    <input name="monthly" type="number" min="0" step="50000" required placeholder="Per month (Rp)" aria-label="Monthly contribution">
    <button class="btn small" type="submit">+ Add goal</button>
  </form>
</section>`;
}

/* ---------------- Bills ---------------- */

export function bills(state) {
  const b = billsDue(state);
  return `
<h1>Bills &amp; reminders — November 2026</h1>
<p class="lede">Every recurring bill, its due date and whether it is paid. Tick a bill when you pay it and the totals update; unpaid bills are listed first so nothing is missed.</p>
<p class="verdict ${b.unpaid.length ? '' : 'good'}">${b.unpaid.length ? `⚠ <b>${idr(b.unpaidTotal)}</b> still to pay across ${b.unpaid.length} bills.` : '✓ Every bill this month is paid.'} Paid so far: <b>${idr(b.paidTotal)}</b>.</p>
<section class="panel">
  <div class="tablewrap"><table>
    <thead><tr><th>Paid?</th><th>Bill</th><th>Due</th><th>Amount</th><th>Note</th></tr></thead>
    <tbody>${state.bills.slice().sort((x, y) => (x.paid - y.paid) || (x.due - y.due)).map((bill) => `<tr class="${bill.paid ? 'paid' : 'due'}">
      <td><input type="checkbox" data-action="toggle-bill" data-id="${bill.id}" ${bill.paid ? 'checked' : ''} aria-label="Mark ${esc(bill.name)} as paid"></td>
      <td><b>${esc(bill.name)}</b></td><td>${bill.due} Nov 2026</td><td>${idr(bill.amount)}</td><td class="muted">${esc(bill.note)}</td></tr>`).join('')}</tbody>
  </table></div>
  <form data-form="add-bill" class="addrow">
    <input name="name" required placeholder="New bill, e.g. Asuransi jiwa" aria-label="Bill name">
    <input name="amount" type="number" min="0" step="1000" required placeholder="Amount (Rp)" aria-label="Amount">
    <input name="due" type="number" min="1" max="31" required placeholder="Due day (1–31)" aria-label="Due day">
    <button class="btn small" type="submit">+ Add bill</button>
  </form>
</section>
<section class="panel">
  <h2>How the family never misses a bill</h2>
  <ul class="plain">
    <li><b>Auto-debit</b> BPJS Kesehatan on the 10th — it can never be late.</li>
    <li><b>Payday rule:</b> on the 1st, move the bill money into a separate account; pay each bill from there.</li>
    <li><b>Calendar:</b> PLN on the 5th, wifi on the 12th, PDAM on the 15th, motorbike on the 18th, school on the 20th.</li>
  </ul>
</section>`;
}

/* ---------------- Grocery / market prices ---------------- */

export function grocery(state) {
  const total = groceryTotal(state);
  return `
<h1>Market prices — Pasar Minggu, November 2026</h1>
<p class="lede">This month’s pasar price list with last month’s price beside it, so you can see what got more expensive. Change a quantity with the + / − buttons and the shopping total updates; add anything you buy regularly.</p>
<p class="verdict">Weekly shop total at these quantities: <b>${idr(total)}</b> · monthly estimate (×4): <b>${idr(total * 4)}</b> — the planner budgets ${idr(3200000 + 900000)} for food.</p>
<section class="panel">
  <div class="tablewrap"><table>
    <thead><tr><th>Item</th><th>Price now</th><th>Last month</th><th>Change</th><th>Qty</th><th>Line total</th><th></th></tr></thead>
    <tbody>${state.grocery.map((item) => {
      const diff = item.price - item.lastMonth;
      const chg = item.lastMonth ? Math.round((diff / item.lastMonth) * 100) : 0;
      return `<tr>
        <td><b>${esc(item.item)}</b> <span class="muted">/ ${esc(item.unit)}</span></td>
        <td>${idr(item.price)}</td><td>${idr(item.lastMonth)}</td>
        <td>${diff > 0 ? `<b class="bad">▲ ${chg}%</b>` : diff < 0 ? `<span class="good">▼ ${Math.abs(chg)}%</span>` : '— same'}</td>
        <td><button class="mini" data-action="grocery-qty" data-id="${item.id}" data-delta="-1" aria-label="One less ${esc(item.item)}">−</button> <b>${item.qty}</b> <button class="mini" data-action="grocery-qty" data-id="${item.id}" data-delta="1" aria-label="One more ${esc(item.item)}">+</button></td>
        <td><b>${idr(item.price * item.qty)}</b></td>
        <td><button class="mini" data-action="del-grocery" data-id="${item.id}">Delete</button></td></tr>`;
    }).join('')}</tbody>
  </table></div>
  <form data-form="add-grocery" class="addrow">
    <input name="item" required placeholder="Item, e.g. Ikan lele" aria-label="Item">
    <input name="unit" placeholder="Unit, e.g. kg" aria-label="Unit">
    <input name="price" type="number" min="0" step="500" required placeholder="Price (Rp)" aria-label="Price">
    <input name="qty" type="number" min="0" step="1" value="1" required placeholder="Qty" aria-label="Quantity">
    <button class="btn small" type="submit">+ Add item</button>
  </form>
  <p class="muted">Cheapest this month: cabai merah fell 12% to Rp 42.000/kg. Most expensive rise: telur ayam, up 6% — the family now buys eggs twice a week instead of daily.</p>
</section>`;
}

/* ---------------- Debt payoff ---------------- */

export function debt(state) {
  const totalBalance = sum(state.debts, 'balance');
  const totalPayment = sum(state.debts, 'payment');
  return `
<h1>Debt payoff calculator</h1>
<p class="lede">Three debts, ${idr(totalBalance)} in total. Pick a strategy — avalanche (highest interest first, cheapest) or snowball (smallest balance first, fastest win) — add an extra payment and watch the months and the interest fall.</p>
<section class="panel">
  <div class="calc-row">
    <label>Strategy
      <select id="debt-method" data-action="debt-method" aria-label="Payoff strategy">
        <option value="avalanche" selected>Avalanche — highest interest first</option>
        <option value="snowball">Snowball — smallest balance first</option>
      </select>
    </label>
    <label>Extra payment per month (Rp)
      <input id="debt-extra" type="number" min="0" step="50000" value="300000" data-action="debt-extra" aria-label="Extra payment per month">
    </label>
  </div>
  <p class="muted">Extra money goes to the first debt in the order below; when it is cleared, the freed payment rolls into the next one.</p>
  <div id="debt-results"></div>
</section>
<section class="panel">
  <h2>Your debts</h2>
  <div class="tablewrap"><table>
    <thead><tr><th>Debt</th><th>Balance</th><th>Interest / year</th><th>Monthly payment</th><th>Months left</th><th>Interest total</th></tr></thead>
    <tbody id="debt-rows"></tbody>
  </table></div>
  <p class="muted">Total balance ${idr(totalBalance)} · paying ${idr(totalPayment)} a month before any extra payment. The credit card at 24% costs about Rp 84.000 a month in interest alone — that is why the avalanche puts it first.</p>
  <form data-form="add-debt" class="addrow">
    <input name="name" required placeholder="Debt name, e.g. Pinjaman bank" aria-label="Debt name">
    <input name="balance" type="number" min="0" step="100000" required placeholder="Balance (Rp)" aria-label="Balance">
    <input name="rate" type="number" min="0" step="0.5" required placeholder="Rate % / year" aria-label="Interest rate">
    <input name="payment" type="number" min="0" step="50000" required placeholder="Payment / month (Rp)" aria-label="Monthly payment">
    <button class="btn small" type="submit">+ Add debt</button>
  </form>
</section>`;
}

/* Renders the debt table rows + results box for a chosen strategy/extra. */
export function debtResults(state, method, extra) {
  const ordered = orderDebts(state.debts, method);
  const rows = ordered.map((d, i) => {
    const pay = d.payment + (i === 0 ? extra : 0);
    const calc = payoffMonths(d.balance, d.rate, pay);
    return { ...d, pay, calc, first: i === 0 };
  });
  const worst = rows.reduce((a, b) => (a.calc.months > b.calc.months ? a : b), rows[0]);
  const interest = rows.reduce((s, r) => s + (Number.isFinite(r.calc.totalInterest) ? r.calc.totalInterest : 0), 0);
  const baseInterest = state.debts.reduce((s, d) => {
    const c = payoffMonths(d.balance, d.rate, d.payment);
    return s + (Number.isFinite(c.totalInterest) ? c.totalInterest : 0);
  }, 0);
  const saved = Math.max(0, baseInterest - interest);
  return {
    rowsHtml: rows.map((r) => `<tr>
      <td><b>${esc(r.name)}</b> ${r.first ? '<span class="tag">pay first</span>' : ''}</td>
      <td>${idr(r.balance)}</td><td>${r.rate}%</td><td>${idr(r.pay)}${r.first && extra ? ` <span class="muted">(incl. ${idr(extra)} extra)</span>` : ''}</td>
      <td>${Number.isFinite(r.calc.months) ? r.calc.months + ' months' : 'never — payment below interest'}</td>
      <td>${Number.isFinite(r.calc.totalInterest) ? idr(r.calc.totalInterest) : '—'}</td></tr>`).join(''),
    resultsHtml: `<p class="verdict good">With the ${method} order and ${idr(extra)} extra a month: the longest debt clears in <b>${Number.isFinite(worst.calc.months) ? worst.calc.months + ' months' : '—'}</b>, total interest <b>${idr(interest)}</b> — saving <b>${idr(saved)}</b> against paying no extra at all.</p>`,
  };
}

/* ---------------- Tips ---------------- */

export function tips(state) {
  const t = totals(state);
  return `
<h1>Money tips that actually work</h1>
<p class="lede">Eight habits this family uses, each with the rupiah amount it saves. No apps to buy, no subscriptions — just things a Jakarta household can do this week.</p>
<p class="verdict good">This month the family saves <b>${idr(t.remaining)}</b> (${t.savedRate}% of income). The tips below are how that number stays above 20%.</p>
<section class="grid2">
${TIPS.map((tip, i) => `<article class="panel"><h2>${i + 1}. ${esc(tip.title)}</h2><p>${esc(tip.body)}</p></article>`).join('')}
</section>
<section class="panel">
  <h2>The one-page version</h2>
  <ol class="plain">
    <li>Payday: move savings out first (${idr(1000000)} emergency + ${idr(750000)} education).</li>
    <li>Shop the pasar twice a week, in the morning.</li>
    <li>Pay the credit card before anything else extra — 24% a year.</li>
    <li>Check this page every Sunday night: 10 minutes, whole family.</li>
  </ol>
  <p><a href="#/planner">Back to the planner →</a></p>
</section>`;
}
