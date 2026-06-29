import React, { useMemo } from 'react';
import { useData } from '../data/DataContext';
import { hoyISO, inicioSemana } from '../data/format';

// Port web de src/Screens/Home/widgets/WidgetResumen.tsx (solo modo claro).
// Medidor semicircular: balance del día al centro, ↑ingresos ↓gastos y balance semanal.

// Geometría del gauge (basada en el viewBox)
const W = 165;
const H = 180;
const CX = W / 2;
const R = 62;
const CY = 92;
const START = 160;
const SPAN = 220;
const FILL_W = 12;

const deg2rad = (d: number) => (d * Math.PI) / 180;
const pt = (deg: number, r = R) => ({
  x: CX + r * Math.cos(deg2rad(deg)),
  y: CY + r * Math.sin(deg2rad(deg)),
});
const arcPath = (fromDeg: number, sweep: number, r = R): string => {
  if (sweep < 0.5) return '';
  const s = pt(fromDeg, r);
  const e = pt(fromDeg + sweep, r);
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
};
const clamp = (v: number) => Math.max(0.005, Math.min(0.995, v));

const fmt = (n: number) => {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)}K`;
  return `${sign}${abs}`;
};

const WidgetResumen: React.FC = () => {
  const { gastos, ingresos } = useData();

  const { balance, totalI, totalG, balSem, ratio } = useMemo(() => {
    const hoy = hoyISO();
    const totalG = gastos.filter((g) => g.fecha === hoy).reduce((a, g) => a + (g.monto ?? 0), 0);
    const totalI = ingresos.filter((i) => i.fecha === hoy).reduce((a, i) => a + (i.monto ?? 0) * (i.cantidad ?? 1), 0);

    const lunes = inicioSemana();
    const totalGSem = gastos.filter((g) => g.fecha >= lunes).reduce((a, g) => a + (g.monto ?? 0), 0);
    const totalISem = ingresos.filter((i) => i.fecha >= lunes).reduce((a, i) => a + (i.monto ?? 0) * (i.cantidad ?? 1), 0);

    const total = totalI + totalG;
    return {
      balance: totalI - totalG,
      totalI,
      totalG,
      balSem: totalISem - totalGSem,
      ratio: total > 0 ? totalI / total : 0.5,
    };
  }, [gastos, ingresos]);

  const filled = clamp(ratio) * SPAN;
  const dotPt = pt(START + filled);
  const gradLX = pt(START).x;
  const gradRX = pt(START + SPAN).x;

  const dotColor = ratio < 0.38 ? '#EF4444' : ratio < 0.62 ? '#FFB800' : '#16A34A';
  const statusLabel = ratio < 0.38 ? 'Negativo' : ratio < 0.62 ? 'Equilibrio' : 'Positivo';
  const statusColor = ratio < 0.38 ? '#F87171' : ratio < 0.62 ? '#FBBF24' : '#16A34A';

  const balTextColor = balance >= 0 ? '#15803D' : '#DC2626';
  const tickClr = balance >= 0 ? '#5A8C6A' : '#8C5A5A';
  const tickMajClr = balance >= 0 ? '#3D6B4D' : '#6B3D3D';

  // Ticks de la escala
  const ticks: Array<{ ox: number; oy: number; ix: number; iy: number; major: boolean }> = [];
  for (let i = 0; i <= SPAN; i += 5) {
    const deg = START + i;
    const major = i % 20 === 0;
    const outerR = R + 3;
    const innerR = major ? outerR - 9 : outerR - 5;
    const o = pt(deg, outerR);
    const inn = pt(deg, innerR);
    ticks.push({ ox: o.x, oy: o.y, ix: inn.x, iy: inn.y, major });
  }

  return (
    <div className="widget-card" style={{ background: 'linear-gradient(135deg, #F0FBF4, #DCF3E6)' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="gfill" x1={gradLX} y1={0} x2={gradRX} y2={0} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#EF4444" />
            <stop offset="0.42" stopColor="#FFB800" />
            <stop offset="1" stopColor="#16A34A" />
          </linearGradient>
        </defs>

        {ticks.map((t, idx) => (
          <line key={idx} x1={t.ox} y1={t.oy} x2={t.ix} y2={t.iy}
            stroke={t.major ? tickMajClr : tickClr}
            strokeWidth={t.major ? 1.6 : 0.9} strokeLinecap="round" />
        ))}

        <path d={arcPath(START, filled)} stroke="url(#gfill)" strokeWidth={FILL_W} fill="none" strokeLinecap="round" />

        <circle cx={dotPt.x} cy={dotPt.y} r={13} fill={dotColor} opacity={0.15} />
        <circle cx={dotPt.x} cy={dotPt.y} r={7} fill={dotColor} opacity={0.4} />
        <circle cx={dotPt.x} cy={dotPt.y} r={4} fill={dotColor} />
        <circle cx={dotPt.x} cy={dotPt.y} r={2} fill="#FFFFFF" opacity={0.9} />

        <text x={CX} y={CY + 10} fontSize={30} fontWeight="800" fill={balTextColor} textAnchor="middle" letterSpacing={-1}>{fmt(balance)}</text>
        <text x={CX} y={CY + 26} fontSize={12} fontWeight="700" fill={statusColor} textAnchor="middle">{statusLabel}</text>
        <text x={14} y={H - 26} fontSize={11} fontWeight="600" fill="#15803D" textAnchor="start">{`↑ ${fmt(totalI)}`}</text>
        <text x={W - 14} y={H - 26} fontSize={11} fontWeight="600" fill="#DC2626" textAnchor="end">{`↓ ${fmt(totalG)}`}</text>
        <text x={CX} y={H - 12} fontSize={10} fontWeight="500" fill="#6B7280" textAnchor="middle">{`Semana ${fmt(balSem)}`}</text>
      </svg>
    </div>
  );
};

export default WidgetResumen;
