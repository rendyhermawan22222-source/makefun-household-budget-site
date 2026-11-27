/* Seed data for Keluarga Santoso, a family of four in Jakarta.
   Every figure is realistic for an Indonesian household in late 2026:
   salaries, pasar (wet market) shopping, PLN electricity, BPJS health
   insurance, pulsa (mobile credit), school fees and a motorbike loan. */

export const HOUSEHOLD = {
  name: 'Keluarga Santoso',
  city: 'Jakarta, Indonesia',
  members: 'Budi (father) · Sari (mother) · Dimas (12) · Putri (8)',
  month: '2026-11',
  currency: 'IDR',
};

export const INCOME_SEED = [
  { id: 'inc1', source: 'Gaji Budi — office salary', amount: 9500000, kind: 'fixed' },
  { id: 'inc2', source: 'Gaji Sari — teacher salary', amount: 4200000, kind: 'fixed' },
  { id: 'inc3', source: 'Warung kopi — weekend coffee stall', amount: 1800000, kind: 'variable' },
  { id: 'inc4', source: 'Freelance design (Sari)', amount: 1000000, kind: 'variable' },
];

/* Budgeted vs actually spent this month, by category. */
export const EXPENSE_SEED = [
  { id: 'e1', name: 'Belanja pasar — wet market groceries', category: 'Food', budget: 3200000, actual: 2985000 },
  { id: 'e2', name: 'Beras & sembako — rice & staples', category: 'Food', budget: 900000, actual: 875000 },
  { id: 'e3', name: 'Listrik PLN — electricity', category: 'Home', budget: 650000, actual: 612000 },
  { id: 'e4', name: 'Air PDAM — water', category: 'Home', budget: 180000, actual: 165000 },
  { id: 'e5', name: 'BPJS Kesehatan — health insurance', category: 'Health', budget: 350000, actual: 350000 },
  { id: 'e6', name: 'Pulsa & internet — mobile & wifi', category: 'Home', budget: 450000, actual: 435000 },
  { id: 'e7', name: 'Uang sekolah Dimas & Putri — school fees', category: 'Education', budget: 1500000, actual: 1500000 },
  { id: 'e8', name: 'Transport — BBM & ojek', category: 'Transport', budget: 900000, actual: 968000 },
  { id: 'e9', name: 'Makan di luar — eating out', category: 'Food', budget: 600000, actual: 742000 },
  { id: 'e10', name: 'Cicilan motor — motorbike loan', category: 'Debt', budget: 1250000, actual: 1250000 },
  { id: 'e11', name: 'Pakaian & keperluan rumah', category: 'Home', budget: 400000, actual: 285000 },
  { id: 'e12', name: 'Hiburan — family outing & streaming', category: 'Fun', budget: 500000, actual: 420000 },
  { id: 'e13', name: 'Arisan bulanan — rotating savings circle', category: 'Fun', budget: 500000, actual: 500000 },
  { id: 'e14', name: 'Les & kursus anak — tutoring & courses', category: 'Education', budget: 800000, actual: 800000 },
  { id: 'e15', name: 'Perawatan & obat — pharmacy & care', category: 'Health', budget: 400000, actual: 450000 },
  { id: 'e16', name: 'Hadiah & kondangan — gifts & weddings', category: 'Fun', budget: 400000, actual: 550500 },
];

/* Six months of history for the tracker chart. */
export const MONTHS_SEED = [
  { month: '2026-06', income: 15800000, spent: 13240000 },
  { month: '2026-07', income: 16100000, spent: 13980000 },
  { month: '2026-08', income: 16500000, spent: 14750000 },
  { month: '2026-09', income: 15900000, spent: 13520000 },
  { month: '2026-10', income: 16400000, spent: 14100000 },
  { month: '2026-11', income: 16500000, spent: 12887500 },
];

export const GOALS_SEED = [
  { id: 'g1', name: 'Dana darurat — emergency fund', target: 20000000, saved: 13500000, monthly: 1000000, note: '6 months of essential spending, kept in a separate account.' },
  { id: 'g2', name: 'Liburan keluarga — family holiday to Yogyakarta', target: 8000000, saved: 5200000, monthly: 500000, note: 'Train tickets, hotel and food for four, Lebaran break.' },
  { id: 'g3', name: 'DP rumah — house down payment', target: 150000000, saved: 42000000, monthly: 2000000, note: 'Saving for a small house in Bekasi; target in about 4 years.' },
  { id: 'g4', name: 'Pendidikan anak — children education fund', target: 30000000, saved: 9750000, monthly: 750000, note: 'Dimas starts junior high next year; fees rise sharply.' },
];

export const BILLS_SEED = [
  { id: 'b1', name: 'Listrik PLN', amount: 612000, due: 5, paid: true, note: 'Token meter — top up before the 5th.' },
  { id: 'b2', name: 'BPJS Kesehatan', amount: 350000, due: 10, paid: true, note: 'Auto-debit from Budi’s account.' },
  { id: 'b3', name: 'Internet wifi (IndiHome)', amount: 385000, due: 12, paid: false, note: 'Pay by the 12th or the speed drops.' },
  { id: 'b4', name: 'Air PDAM', amount: 165000, due: 15, paid: false, note: 'Bill arrives around the 8th.' },
  { id: 'b5', name: 'Cicilan motor Honda Beat', amount: 1250000, due: 18, paid: false, note: '14 payments left after this one.' },
  { id: 'b6', name: 'Uang sekolah Putri', amount: 650000, due: 20, paid: false, note: 'Transfer to the school account.' },
  { id: 'b7', name: 'Uang sekolah Dimas', amount: 850000, due: 20, paid: false, note: 'Transfer to the school account.' },
  { id: 'b8', name: 'Iuran RT & keamanan', amount: 100000, due: 25, paid: false, note: 'Neighbourhood dues, cash to Pak RT.' },
];

export const GROCERY_SEED = [
  { id: 'gr1', item: 'Beras premium', unit: 'kg', price: 14500, lastMonth: 14000, qty: 25 },
  { id: 'gr2', item: 'Telur ayam', unit: 'kg', price: 28000, lastMonth: 26500, qty: 4 },
  { id: 'gr3', item: 'Ayam potong', unit: 'kg', price: 38000, lastMonth: 36000, qty: 6 },
  { id: 'gr4', item: 'Minyak goreng', unit: 'liter', price: 17500, lastMonth: 17000, qty: 5 },
  { id: 'gr5', item: 'Gula pasir', unit: 'kg', price: 17500, lastMonth: 17500, qty: 3 },
  { id: 'gr6', item: 'Cabai merah', unit: 'kg', price: 42000, lastMonth: 48000, qty: 1 },
  { id: 'gr7', item: 'Bawang merah', unit: 'kg', price: 34000, lastMonth: 32000, qty: 2 },
  { id: 'gr8', item: 'Sayur bayam & kangkung', unit: 'ikat', price: 5000, lastMonth: 5000, qty: 12 },
  { id: 'gr9', item: 'Tahu & tempe', unit: 'pack', price: 8000, lastMonth: 7500, qty: 10 },
  { id: 'gr10', item: 'Susu UHT 1 liter', unit: 'box', price: 19500, lastMonth: 19000, qty: 8 },
  { id: 'gr11', item: 'Kopi bubuk', unit: '250 g', price: 22000, lastMonth: 21000, qty: 2 },
  { id: 'gr12', item: 'Gas LPG 3 kg', unit: 'tabung', price: 23000, lastMonth: 22000, qty: 3 },
];

export const DEBTS_SEED = [
  { id: 'd1', name: 'Cicilan motor Honda Beat', balance: 17500000, rate: 12, payment: 1250000, note: '14 payments left at the current pace.' },
  { id: 'd2', name: 'Kartu kredit — credit card', balance: 4200000, rate: 24, payment: 500000, note: 'Pay this one first: the interest rate is double the motorbike loan.' },
  { id: 'd3', name: 'Pinjaman koperasi — cooperative loan', balance: 6000000, rate: 9, payment: 650000, note: 'Taken for Dimas’s school enrolment fee.' },
];

export const TIPS = [
  { title: 'Pay yourself first', body: 'Move the savings (Rp 1.000.000 to the emergency fund, Rp 750.000 to education) on payday, before any spending. What is left is what you may spend — not the other way round.' },
  { title: 'Belanja pasar in the morning', body: 'Vegetables and fish are cheapest before 8 a.m. at Pasar Minggu. This family saves about Rp 250.000 a month by shopping twice a week instead of daily at the minimarket.' },
  { title: 'The 50/30/20 rule, Indonesian style', body: 'Aim for 50% needs (rent, food, PLN, BPJS, school), 30% wants (eating out, outings) and 20% savings and debt. This household is at 58% needs — the eating-out line is the easiest to cut.' },
  { title: 'One PLN trick', body: 'A 1.300 VA meter with the air conditioner at 25°C and the water dispenser switched off at night cut this family’s electricity bill from Rp 780.000 to Rp 612.000.' },
  { title: 'Cook rice in bulk, freeze portions', body: 'Cooking 25 kg of rice a month at home costs about Rp 362.500. The same rice as takeaway nasi padang would cost more than four times as much.' },
  { title: 'Round down the ojek budget', body: 'Transport ran Rp 68.000 over budget this month. Booking ojek online in a bundle (GoPay later) and walking trips under 1 km saves roughly Rp 150.000 a month.' },
  { title: 'Kill the credit card first', body: 'At 24% a year, the Rp 4.200.000 card balance costs Rp 84.000 a month in interest alone. Paying an extra Rp 300.000 a month clears it 5 months sooner and saves Rp 410.000.' },
  { title: 'Arisan is not savings', body: 'The monthly arisan (Rp 500.000) is a social commitment, not a savings plan — it pays out once and the money is usually spent at once. Keep it separate from the emergency fund.' },
];
