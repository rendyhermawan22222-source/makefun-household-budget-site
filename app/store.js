/* State: loads the seed data, keeps every edit in localStorage, and
   exposes the totals every page needs. Nothing leaves the browser. */

import {
  INCOME_SEED, EXPENSE_SEED, MONTHS_SEED, GOALS_SEED,
  BILLS_SEED, GROCERY_SEED, DEBTS_SEED,
} from './data.js';

const KEY = 'anggaran-rumah-tangga-v1';

function freshState() {
  return {
    income: structuredClone(INCOME_SEED),
    expenses: structuredClone(EXPENSE_SEED),
    months: structuredClone(MONTHS_SEED),
    goals: structuredClone(GOALS_SEED),
    bills: structuredClone(BILLS_SEED),
    grocery: structuredClone(GROCERY_SEED),
    debts: structuredClone(DEBTS_SEED),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    const base = freshState();
    for (const k of Object.keys(base)) {
      if (!Array.isArray(parsed[k])) parsed[k] = base[k];
    }
    return parsed;
  } catch (e) {
    return freshState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) { /* private mode: the site still works for the session */ }
}

export function resetState() {
  localStorage.removeItem(KEY);
  return freshState();
}

export const sum = (rows, field) => rows.reduce((t, r) => t + (Number(r[field]) || 0), 0);

export function totals(state) {
  const income = sum(state.income, 'amount');
  const budgeted = sum(state.expenses, 'budget');
  const spent = sum(state.expenses, 'actual');
  return {
    income,
    budgeted,
    spent,
    remaining: income - spent,
    savedRate: income ? Math.round(((income - spent) / income) * 100) : 0,
    overBudget: state.expenses.filter((e) => e.actual > e.budget),
  };
}

export function byCategory(state) {
  const map = new Map();
  for (const e of state.expenses) {
    const row = map.get(e.category) || { category: e.category, budget: 0, actual: 0 };
    row.budget += e.budget;
    row.actual += e.actual;
    map.set(e.category, row);
  }
  return [...map.values()].sort((a, b) => b.actual - a.actual);
}

export function billsDue(state) {
  const unpaid = state.bills.filter((b) => !b.paid);
  return {
    unpaid,
    unpaidTotal: sum(unpaid, 'amount'),
    paidTotal: sum(state.bills.filter((b) => b.paid), 'amount'),
    next: unpaid.slice().sort((a, b) => a.due - b.due)[0] || null,
  };
}

export function goalsSummary(state) {
  return {
    saved: sum(state.goals, 'saved'),
    target: sum(state.goals, 'target'),
    monthly: sum(state.goals, 'monthly'),
  };
}

export function groceryTotal(state) {
  return state.grocery.reduce((t, g) => t + g.price * g.qty, 0);
}

export function uid(prefix) {
  return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
}
