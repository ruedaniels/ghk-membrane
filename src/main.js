const PK = 1, PNA = 0.04, PCL = 0.45;
const CLI = 10, CLO = 140;
const RTF = 25.7;

function ghk(Ko, Ki, Nao, Nai) {
  const num = PK * Ko + PNA * Nao + PCL * CLI;
  const den = PK * Ki + PNA * Nai + PCL * CLO;
  return RTF * Math.log(num / den);
}

function nernst(out, inn) {
  return RTF * Math.log(out / inn);
}

function update() {
  const Ko  = parseFloat(document.getElementById('Ko').value);
  const Ki  = parseFloat(document.getElementById('Ki').value);
  const Nao = parseFloat(document.getElementById('Nao').value);
  const Nai = parseFloat(document.getElementById('Nai').value);

  document.getElementById('vKo').textContent  = Ko.toFixed(1);
  document.getElementById('vKi').textContent  = Ki.toFixed(0);
  document.getElementById('vNao').textContent = Nao.toFixed(0);
  document.getElementById('vNai').textContent = Nai.toFixed(1);

  const Vm  = ghk(Ko, Ki, Nao, Nai);
  const Ek  = nernst(Ko, Ki);
  const Ena = nernst(Nao, Nai);
  const onTarget = Math.abs(Vm + 55) < 2;

  const vmEl = document.getElementById('m-vm');
  vmEl.textContent = Vm.toFixed(1);
  vmEl.className = 'metric-val' + (onTarget ? ' on-target' : '');

  document.getElementById('m-ek').textContent  = Ek.toFixed(1);
  document.getElementById('m-ena').textContent = Ena.toFixed(1);

  const pill = document.getElementById('targetPill');
  pill.textContent = onTarget ? 'reached' : 'not reached';
  pill.className = 'target-pill' + (onTarget ? ' achieved' : '');

  drawMembrane(Ko, Ki, Nao, Nai, Vm);
}

function drawMembrane(Ko, Ki, Nao, Nai, Vm) {
  const cv  = document.getElementById('membrane');
  cv.width  = cv.offsetWidth || 600;
  const W   = cv.width, H = cv.height;
  const ctx = cv.getContext('2d');

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff8f9';
  ctx.fillRect(0, 0, W, H);

  ctx.font = '500 12px DM Sans, sans-serif';
  ctx.fillStyle = '#d4a0b0';
  ctx.textAlign = 'left';
  ctx.fillText('Extracellular', 12, 20);
  ctx.fillText('Intracellular', 12, H - 8);

  const mY = H / 2, thick = 38;
  const mg = ctx.createLinearGradient(0, mY - thick / 2, 0, mY + thick / 2);
  mg.addColorStop(0,   '#fce4ef');
  mg.addColorStop(0.5, '#f8d0e4');
  mg.addColorStop(1,   '#fce4ef');
  ctx.fillStyle = mg;
  ctx.fillRect(0, mY - thick / 2, W, thick);

  for (let x = 14; x < W - 8; x += 20) {
    ctx.fillStyle = '#f0b0c8';
    ctx.beginPath(); ctx.arc(x, mY - thick / 2 + 5.5, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, mY + thick / 2 - 5.5, 3.5, 0, Math.PI * 2); ctx.fill();
  }

  const c1x = W * 0.40, c2x = W * 0.70;
  drawChannel(ctx, c1x, mY, thick, '#c9bfe8', '#b0a0d8');
  drawChannel(ctx, c2x, mY, thick, '#b8e8df', '#8ed4c8');

  ctx.textAlign = 'center';
  ctx.font = 'bold 13px DM Sans, sans-serif'; ctx.fillStyle = '#b0a0d8';
  ctx.fillText('K⁺', c1x, mY - thick / 2 - 27);
  ctx.font = '12px DM Sans, sans-serif'; ctx.fillStyle = '#a0606e';
  ctx.fillText(Ko.toFixed(1) + ' mM', c1x, mY - thick / 2 - 13);
  ctx.font = 'bold 13px DM Sans, sans-serif'; ctx.fillStyle = '#b0a0d8';
  ctx.fillText('K⁺', c1x, mY + thick / 2 + 27);
  ctx.font = '12px DM Sans, sans-serif'; ctx.fillStyle = '#a0606e';
  ctx.fillText(Ki.toFixed(0) + ' mM', c1x, mY + thick / 2 + 41);

  ctx.font = 'bold 13px DM Sans, sans-serif'; ctx.fillStyle = '#5aada0';
  ctx.fillText('Na⁺', c2x, mY - thick / 2 - 27);
  ctx.font = '12px DM Sans, sans-serif'; ctx.fillStyle = '#a0606e';
  ctx.fillText(Nao.toFixed(0) + ' mM', c2x, mY - thick / 2 - 13);
  ctx.font = 'bold 13px DM Sans, sans-serif'; ctx.fillStyle = '#5aada0';
  ctx.fillText('Na⁺', c2x, mY + thick / 2 + 27);
  ctx.font = '12px DM Sans, sans-serif'; ctx.fillStyle = '#a0606e';
  ctx.fillText(Nai.toFixed(1) + ' mM', c2x, mY + thick / 2 + 41);

  ctx.textAlign = 'right'; ctx.font = '10px DM Sans, sans-serif'; ctx.fillStyle = '#d4b0bc';
  ctx.fillText('Cl⁻  140 mM', W - 12, mY - thick / 2 - 10);
  ctx.fillText('Cl⁻  10 mM',  W - 12, mY + thick / 2 + 14);

  drawVoltmeter(ctx, 56, mY, Vm);
  ctx.textAlign = 'left';
}

function drawChannel(ctx, x, mY, thick, light, dark) {
  const cw = 15, ch = thick + 6;
  ctx.fillStyle = light;
  ctx.beginPath();
  ctx.moveTo(x - cw, mY - ch / 2);
  ctx.bezierCurveTo(x - 4, mY - ch / 2, x - 4, mY - 4, x - 4, mY);
  ctx.bezierCurveTo(x - 4, mY + 4, x - 4, mY + ch / 2, x - cw, mY + ch / 2);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + cw, mY - ch / 2);
  ctx.bezierCurveTo(x + 4, mY - ch / 2, x + 4, mY - 4, x + 4, mY);
  ctx.bezierCurveTo(x + 4, mY + 4, x + 4, mY + ch / 2, x + cw, mY + ch / 2);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = dark + '28';
  ctx.fillRect(x - 4, mY - ch / 2, 8, ch);
}

function drawVoltmeter(ctx, cx, mY, Vm) {
  const r = 26;
  ctx.strokeStyle = '#e8b8c8'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, mY - r); ctx.lineTo(cx, mY - 50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, mY + r); ctx.lineTo(cx, mY + 50); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, mY - 50); ctx.lineTo(cx - 28, mY - 50);
  ctx.lineTo(cx - 28, mY + 50); ctx.lineTo(cx, mY + 50);
  ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, mY, r, 0, Math.PI * 2);
  ctx.fillStyle = 'white'; ctx.fill();
  ctx.strokeStyle = '#f0c4d0'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.textAlign = 'center';
  ctx.font = '600 12px DM Sans, sans-serif'; ctx.fillStyle = '#c0516a';
  ctx.fillText(Vm.toFixed(1), cx, mY + 3);
  ctx.font = '10px DM Sans, sans-serif'; ctx.fillStyle = '#c47a8a';
  ctx.fillText('mV', cx, mY + 15);
}

['Ko', 'Ki', 'Nao', 'Nai'].forEach(id => {
  document.getElementById(id).addEventListener('input', update);
});

window.resetAll = function () {
  document.getElementById('Ko').value  = 5;
  document.getElementById('Ki').value  = 140;
  document.getElementById('Nao').value = 145;
  document.getElementById('Nai').value = 12;
  update();
};

window.addEventListener('resize', update);
update();