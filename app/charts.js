/* Canvas charts drawn from the household's own numbers — no library,
   no network. Bar chart for the 6-month tracker, donut for spending. */

export function drawBars(canvas, months) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const padL = 8;
  const padB = 26;
  const padT = 12;
  const max = Math.max(...months.map((m) => Math.max(m.income, m.spent)), 1);
  const slot = (W - padL * 2) / months.length;
  const barW = Math.min(26, slot * 0.32);
  ctx.font = '11px system-ui, sans-serif';
  months.forEach((m, i) => {
    const x = padL + i * slot + slot / 2;
    const hIn = ((H - padT - padB) * m.income) / max;
    const hSp = ((H - padT - padB) * m.spent) / max;
    ctx.fillStyle = '#146c43';
    ctx.fillRect(x - barW - 3, H - padB - hIn, barW, hIn);
    ctx.fillStyle = '#c65d3a';
    ctx.fillRect(x + 3, H - padB - hSp, barW, hSp);
    ctx.fillStyle = '#5b5648';
    ctx.textAlign = 'center';
    ctx.fillText(m.month.slice(5), x, H - 8);
    if (W >= 600) {
      ctx.fillStyle = '#146c43';
      ctx.fillText('Rp ' + Math.round(m.income / 1e6) + ' jt', x - barW / 2 - 3, H - padB - hIn - 5);
    }
  });
  ctx.fillStyle = '#5b5648';
  ctx.textAlign = 'left';
  ctx.fillText('■ Income', padL, 12);
  ctx.fillStyle = '#c65d3a';
  ctx.fillText('■ Spent', 80, 12);
}

export function drawDonut(canvas, rows) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const total = rows.reduce((t, r) => t + r.actual, 0) || 1;
  const colors = ['#146c43', '#c65d3a', '#d9a441', '#4a7fa5', '#7d5ba6', '#8a6d3b', '#3d8b7a'];
  const cx = 90;
  const cy = H / 2;
  const R = Math.min(72, H / 2 - 12);
  let angle = -Math.PI / 2;
  rows.forEach((r, i) => {
    const sweep = (r.actual / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    angle += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = '#faf6ef';
  ctx.fill();
  ctx.fillStyle = '#1d2b22';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Rp ' + Math.round(total / 1e6) + ' jt', cx, cy - 2);
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = '#5b5648';
  ctx.fillText('spent / month', cx, cy + 14);
  ctx.textAlign = 'left';
  ctx.font = '12px system-ui, sans-serif';
  rows.forEach((r, i) => {
    const y = 18 + i * 22;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(190, y - 9, 12, 12);
    ctx.fillStyle = '#1d2b22';
    const share = Math.round((r.actual / total) * 100);
    ctx.fillText(`${r.category} — ${share}%`, 208, y + 2);
  });
}
