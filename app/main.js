/* Boot and routing for Anggaran Rumah Tangga.
   Hash routes, one per page; every control on every page is wired here
   through delegation on #app, so a control always does what it says. */

import { loadState, saveState, resetState, uid } from './store.js';
import { drawBars, drawDonut } from './charts.js';
import { byCategory, totals } from './store.js';
import {
  dashboard, planner, tracker, goals, bills, grocery, debt, debtResults, tips, navHtml,
} from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');
let state = loadState();

const ROUTES = {
  '': dashboard,
  'planner': planner,
  'tracker': tracker,
  'goals': goals,
  'bills': bills,
  'grocery': grocery,
  'debt': debt,
  'tips': tips,
};

function route() {
  return (location.hash.replace(/^#\/?/, '').split('/')[0] || '');
}

function render() {
  window.__shotReady = false;
  const r = route();
  const page = ROUTES[r] || dashboard;
  nav.innerHTML = navHtml(r);
  app.innerHTML = page(state);
  if (r === '' || !ROUTES[r]) {
    const donut = document.getElementById('chart-donut');
    if (donut) drawDonut(donut, byCategory(state));
  }
  if (r === 'tracker') {
    const bars = document.getElementById('chart-bars');
    if (bars) drawBars(bars, state.months);
  }
  if (r === 'debt') refreshDebt();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function refreshDebt() {
  const methodEl = document.getElementById('debt-method');
  const extraEl = document.getElementById('debt-extra');
  if (!methodEl || !extraEl) return;
  const method = methodEl.value;
  const extra = Math.max(0, Number(extraEl.value) || 0);
  const out = debtResults(state, method, extra);
  const rows = document.getElementById('debt-rows');
  const res = document.getElementById('debt-results');
  if (rows) rows.innerHTML = out.rowsHtml;
  if (res) res.innerHTML = out.resultsHtml;
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
}

function formData(form) {
  const data = {};
  new FormData(form).forEach((v, k) => { data[k] = String(v).trim(); });
  return data;
}

app.addEventListener('change', (event) => {
  const el = event.target;
  const action = el.dataset.action;
  if (!action) return;
  const id = el.dataset.id;
  if (action === 'exp-budget' || action === 'exp-actual') {
    const row = state.expenses.find((e) => e.id === id);
    if (row) row[action === 'exp-budget' ? 'budget' : 'actual'] = num(el.value);
  } else if (action === 'income-amount') {
    const row = state.income.find((e) => e.id === id);
    if (row) row.amount = num(el.value);
  } else if (action === 'month-spent') {
    const row = state.months.find((m) => m.month === id);
    if (row) row.spent = num(el.value);
  } else if (action === 'goal-monthly') {
    const row = state.goals.find((g) => g.id === id);
    if (row) row.monthly = num(el.value);
  } else if (action === 'toggle-bill') {
    const row = state.bills.find((b) => b.id === id);
    if (row) row.paid = el.checked;
  } else if (action === 'debt-method' || action === 'debt-extra') {
    refreshDebt();
    return;
  } else {
    return;
  }
  saveState(state);
  render();
});

app.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  const id = el.dataset.id;
  if (action === 'del-expense') state.expenses = state.expenses.filter((e) => e.id !== id);
  else if (action === 'del-income') state.income = state.income.filter((e) => e.id !== id);
  else if (action === 'del-goal') state.goals = state.goals.filter((g) => g.id !== id);
  else if (action === 'del-grocery') state.grocery = state.grocery.filter((g) => g.id !== id);
  else if (action === 'reset-data') state = resetState();
  else if (action === 'grocery-qty') {
    const row = state.grocery.find((g) => g.id === id);
    if (row) row.qty = Math.max(0, row.qty + Number(el.dataset.delta || 0));
  } else return;
  saveState(state);
  render();
});

app.addEventListener('submit', (event) => {
  const form = event.target;
  const kind = form.dataset.form;
  if (!kind) return;
  event.preventDefault();
  const d = formData(form);
  if (kind === 'add-income' && d.source) {
    state.income.push({ id: uid('inc'), source: d.source, amount: num(d.amount), kind: 'variable' });
  } else if (kind === 'add-expense' && d.name) {
    state.expenses.push({ id: uid('e'), name: d.name, category: d.category || 'Other', budget: num(d.budget), actual: num(d.actual) });
  } else if (kind === 'add-goal' && d.name) {
    state.goals.push({ id: uid('g'), name: d.name, target: num(d.target), saved: num(d.saved), monthly: num(d.monthly), note: 'Added by the family.' });
  } else if (kind === 'add-bill' && d.name) {
    state.bills.push({ id: uid('b'), name: d.name, amount: num(d.amount), due: Math.max(1, Math.min(31, num(d.due) || 1)), paid: false, note: 'Added by the family.' });
  } else if (kind === 'add-grocery' && d.item) {
    state.grocery.push({ id: uid('gr'), item: d.item, unit: d.unit || 'unit', price: num(d.price), lastMonth: num(d.price), qty: Math.max(1, num(d.qty) || 1) });
  } else if (kind === 'add-debt' && d.name) {
    state.debts.push({ id: uid('d'), name: d.name, balance: num(d.balance), rate: Number(d.rate) || 0, payment: num(d.payment), note: 'Added by the family.' });
  } else {
    return;
  }
  saveState(state);
  render();
});

window.addEventListener('hashchange', render);
render();
