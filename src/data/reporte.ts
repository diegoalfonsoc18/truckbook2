// Generador del informe financiero en HTML (para imprimir / guardar como PDF).
// Portado de generarReporteHTML de FinanzasGenerales.tsx (RN) — HTML agnóstico de framework.

export type ViewType = 'dias' | 'meses' | 'años';

export interface GastoDetalle {
  fecha: string;
  tipo_gasto: string;
  descripcion: string;
  monto: number;
}

export interface IngresoDetalle {
  fecha: string;
  tipo_ingreso: string;
  descripcion: string;
  monto: number;
  cantidad?: number;
  cliente?: string | null;
}

export interface ReporteParams {
  placas: string[];
  rangoInicio: string;
  rangoFin: string;
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  rentabilidad: string;
  periodos: string[];
  ingresosPorPeriodo: number[];
  gastosPorPeriodo: number[];
  gastosDetalle: GastoDetalle[];
  ingresosDetalle: IngresoDetalle[];
  clienteFiltro?: string | null;
  view: ViewType;
}

export function generarReporteHTML(params: ReporteParams): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(n);

  const fmtFecha = (s: string) => {
    const d = new Date(s + 'T12:00:00');
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
  };

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const labelPeriodo = (key: string) => {
    if (params.view === 'dias') {
      const [, m, d] = key.split('-');
      return `${d}/${m}`;
    }
    if (params.view === 'meses') {
      const [a, m] = key.split('-');
      return `${meses[parseInt(m) - 1]} ${a}`;
    }
    return key;
  };

  const periodoRows = params.periodos
    .map((k, i) => {
      const ing = params.ingresosPorPeriodo[i] || 0;
      const gas = params.gastosPorPeriodo[i] || 0;
      const bal = ing - gas;
      const balColor = bal >= 0 ? '#16A34A' : '#EF4444';
      return `<tr>
      <td>${labelPeriodo(k)}</td>
      <td class="right green">${fmt(ing)}</td>
      <td class="right red">${fmt(gas)}</td>
      <td class="right" style="color:${balColor};font-weight:700">${fmt(bal)}</td>
    </tr>`;
    })
    .join('');

  const cleanDesc = (d: string) => (d || '—').replace(/\[TEL:[^\]]*\]/g, '').trim() || '—';

  const top15Ingresos = [...params.ingresosDetalle]
    .sort((a, b) => b.monto * (b.cantidad ?? 1) - a.monto * (a.cantidad ?? 1))
    .slice(0, 15)
    .map((i) => {
      const cant = i.cantidad ?? 1;
      const total = i.monto * cant;
      const cantLabel = cant > 1 ? ` (x${cant})` : '';
      const clienteLabel =
        i.cliente ||
        (() => {
          const d = (i.descripcion || '').replace(/\[TEL:[^\]]*\]/g, '').split(' · ')[0].trim();
          return d.length > 1 ? d : '—';
        })();
      return `<tr>
      <td>${fmtFecha(i.fecha)}</td>
      <td>${i.tipo_ingreso}${cantLabel}</td>
      <td>${clienteLabel}</td>
      <td>${cleanDesc(i.descripcion)}</td>
      <td class="right green">${fmt(total)}</td>
    </tr>`;
    })
    .join('');

  const top15Gastos = [...params.gastosDetalle]
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 15)
    .map(
      (g) => `<tr>
      <td>${fmtFecha(g.fecha)}</td>
      <td>${g.tipo_gasto}</td>
      <td>${cleanDesc(g.descripcion)}</td>
      <td class="right red">${fmt(g.monto)}</td>
    </tr>`
    )
    .join('');

  const rentNum = Number(params.rentabilidad);
  const balColor = params.balance >= 0 ? '#16A34A' : '#EF4444';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Informe TruckBook</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; background: #F5F5F5; padding: 24px; color: #000; }
    .page { background: #fff; max-width: 680px; margin: 0 auto; padding: 32px; border-radius: 8px; }
    .doc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 3px solid #000; padding-bottom: 16px; }
    .brand { font-size: 24px; font-weight: 800; color: #000; letter-spacing: -0.5px; }
    .doc-info { text-align: right; font-size: 12px; color: #000; }
    .doc-info strong { color: #000; display: block; font-size: 16px; font-weight: 700; margin-bottom: 4px; }
    .meta-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; display: flex; gap: 32px; font-size: 12px; color: #000; }
    .meta-item strong { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #000; margin-bottom: 2px; }
    .meta-item span { font-size: 13px; font-weight: 600; color: #000; }
    .summary { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-bottom: 28px; }
    .s-card { border-radius: 10px; padding: 14px; border: 1px solid #E2E8F0; text-align: center; }
    .s-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; color: #000; margin-bottom: 6px; }
    .s-value { font-size: 15px; font-weight: 800; color: #000; }
    .green { color: #16A34A; }
    .red { color: #EF4444; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #000; margin: 24px 0 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #000; color: #fff; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 10px; text-align: left; }
    th.right { text-align: right; }
    td { padding: 8px 10px; border-bottom: 1px solid #F1F5F9; color: #000; vertical-align: middle; }
    td.right { text-align: right; }
    tr:last-child td { border-bottom: none; }
    .total-tr td { background: #F1F5F9; font-weight: 700; font-size: 13px; border-top: 2px solid #CBD5E1; color: #000; }
    .footer { text-align: center; font-size: 10px; color: #000; margin-top: 28px; border-top: 1px solid #E2E8F0; padding-top: 14px; }
    @media print { body { background: #fff; padding: 0; } .page { box-shadow: none; max-width: 100%; } }
  </style>
</head>
<body>
<div class="page">
  <div class="doc-header">
    <div>
      <div class="brand">Truck<span>Book</span></div>
      <div style="font-size:13px;color:#666;margin-top:4px;">Informe Financiero</div>
    </div>
    <div class="doc-info">
      <strong>Informe de Finanzas</strong>
      Generado: ${new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}
    </div>
  </div>

  <div class="meta-box">
    <div class="meta-item">
      <strong>Período</strong>
      <span>${fmtFecha(params.rangoInicio)} — ${fmtFecha(params.rangoFin)}</span>
    </div>
    <div class="meta-item">
      <strong>Vehículo(s)</strong>
      <span>${params.placas.length > 0 ? params.placas.join(', ') : 'Todos'}</span>
    </div>
    ${params.clienteFiltro ? `<div class="meta-item"><strong>Cliente</strong><span>${params.clienteFiltro}</span></div>` : ''}
    <div class="meta-item">
      <strong>Transacciones</strong>
      <span>${params.gastosDetalle.length + params.ingresosDetalle.length}</span>
    </div>
  </div>

  <div class="summary">
    <div class="s-card" style="border-color:#16A34A40">
      <div class="s-label">Ingresos</div>
      <div class="s-value green">${fmt(params.totalIngresos)}</div>
    </div>
    <div class="s-card" style="border-color:#EF444440">
      <div class="s-label">Gastos</div>
      <div class="s-value red">${fmt(params.totalGastos)}</div>
    </div>
    <div class="s-card" style="border-color:${balColor}40">
      <div class="s-label">Balance</div>
      <div class="s-value" style="color:${balColor}">${fmt(params.balance)}</div>
    </div>
    <div class="s-card" style="border-color:${rentNum >= 0 ? '#16A34A40' : '#EF444440'}">
      <div class="s-label">Rentabilidad</div>
      <div class="s-value" style="color:${rentNum >= 0 ? '#16A34A' : '#EF4444'}">${rentNum >= 0 ? '+' : ''}${params.rentabilidad}%</div>
    </div>
  </div>

  ${
    params.periodos.length > 0
      ? `<div class="section-title">Resumen por período</div>
  <table>
    <thead><tr><th>Período</th><th class="right">Ingresos</th><th class="right">Gastos</th><th class="right">Balance</th></tr></thead>
    <tbody>
      ${periodoRows}
      <tr class="total-tr">
        <td>Total</td>
        <td class="right green">${fmt(params.totalIngresos)}</td>
        <td class="right red">${fmt(params.totalGastos)}</td>
        <td class="right" style="color:${balColor}">${fmt(params.balance)}</td>
      </tr>
    </tbody>
  </table>`
      : ''
  }

  ${
    params.ingresosDetalle.length > 0
      ? `<div class="section-title">Ingresos del período (${params.ingresosDetalle.length})</div>
  <table>
    <thead><tr><th>Fecha</th><th>Tipo</th><th>Cliente</th><th>Descripción</th><th class="right">Monto</th></tr></thead>
    <tbody>${top15Ingresos}</tbody>
  </table>
  ${params.ingresosDetalle.length > 15 ? `<div style="font-size:10px;color:#999;margin-top:4px;text-align:right">Mostrando 15 de ${params.ingresosDetalle.length} registros</div>` : ''}`
      : ''
  }

  ${
    params.gastosDetalle.length > 0
      ? `<div class="section-title">Gastos del período (${params.gastosDetalle.length})</div>
  <table>
    <thead><tr><th>Fecha</th><th>Tipo</th><th>Descripción</th><th class="right">Monto</th></tr></thead>
    <tbody>${top15Gastos}</tbody>
  </table>
  ${params.gastosDetalle.length > 15 ? `<div style="font-size:10px;color:#999;margin-top:4px;text-align:right">Mostrando 15 de ${params.gastosDetalle.length} registros</div>` : ''}`
      : ''
  }

  <div class="footer">Generado con TruckBook</div>
</div>
</body>
</html>`;
}
