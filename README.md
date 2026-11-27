# makefun-household-budget-site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/rendyhermawan22222-source/makefun-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/rendyhermawan22222-source/makefun-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Anggaran Rumah Tangga — a working household budget site built for the make.fun bounty "Make the best household budget site" (best-household-budget-site-20261126-1457). A budget planner for Keluarga Santoso, a family of four in Jakarta, with realistic Indonesian rupiah figures: gaji, belanja pasar, listrik PLN, BPJS, pulsa, uang sekolah and a motorbike loan. Every page is a real working tool, not a mockup.

## What it does

- **Dashboard** — income vs spending, savings rate, a donut chart of spending by category, savings-goal progress and the next bills due.
- **Budget planner** — edit any income or expense figure and the totals, savings rate and 50/30/20 split update at once; add or delete rows.
- **Monthly tracker** — six months of income vs spending as a bar chart, with editable months.
- **Savings goals** — four goals with progress bars and a finish-date calculator (4% yearly deposito return).
- **Bills & reminders** — every recurring bill with its due date; tick bills paid and the totals update.
- **Market prices** — a Pasar Minggu price list with last month's prices, quantity buttons and a running shopping total.
- **Debt payoff** — avalanche vs snowball strategies with an extra-payment calculator showing months and interest saved.
- **Money tips** — eight practical habits with the rupiah each one saves.

All data is saved only in the visitor's own browser (localStorage). The site is plain static files with no build step and no network requests.

## Run it

```sh
cd app && python3 -m http.server 8080
```

Then open http://localhost:8080 in a browser (desktop or phone).

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=731kem14&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
