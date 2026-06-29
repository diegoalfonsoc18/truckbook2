import React, { useMemo, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent,
  IonModal, IonDatetime, IonIcon,
} from '@ionic/react';
import { arrowForward, documentTextOutline, close } from 'ionicons/icons';
import { useData, PLACA_ACTUAL } from '../data/DataContext';
import { GASTOS_CATEGORIAS, INGRESOS_CATEGORIAS, buscarCategoria } from '../data/categorias';
import { generarReporteHTML, ViewType } from '../data/reporte';

// ── Helpers ──
function groupBy<T extends { fecha: string; value: number }>(items: T[], keyFn: (i: T) => string) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + Number(item.value);
    return acc;
  }, {});
}

function filtrarPorRango<T extends { fecha: string }>(items: T[], inicio: string, fin: string) {
  if (!inicio && !fin) return items;
  return items.filter((i) => !(inicio && i.fecha < inicio) && !(fin && i.fecha > fin));
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function formatLabel(fecha: string, view: ViewType) {
  if (view === 'dias') {
    const [, mes, dia] = fecha.split('-');
    return `${dia}/${mes}`;
  }
  if (view === 'meses') {
    const [anio, mes] = fecha.split('-');
    return `${MESES[parseInt(mes, 10) - 1]} ${anio?.slice(2)}`;
  }
  return fecha;
}

function fmtCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
}

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function formatDateShort(s: string) {
  return new Date(s + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function nombreCategoria(lista: typeof GASTOS_CATEGORIAS, id: string) {
  return buscarCategoria(lista, id).name;
}

function clienteDeIngreso(descripcion: string): string | null {
  const parte = (descripcion || '').replace(/\[TEL:[^\]]*\]/g, '').split(' · ')[0].trim();
  return parte.length > 1 ? parte : null;
}

type PeriodoRapido = 'semana' | 'mes' | 'mes_anterior' | 'trimestre' | 'año' | 'personalizado';

function calcularRango(p: PeriodoRapido, actual: { inicio: string; fin: string }): { inicio: string; fin: string } {
  const now = new Date();
  if (p === 'semana') {
    const lunes = new Date(now);
    lunes.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    return { inicio: iso(lunes), fin: iso(domingo) };
  }
  if (p === 'mes') {
    return { inicio: iso(new Date(now.getFullYear(), now.getMonth(), 1)), fin: iso(new Date(now.getFullYear(), now.getMonth() + 1, 0)) };
  }
  if (p === 'mes_anterior') {
    return { inicio: iso(new Date(now.getFullYear(), now.getMonth() - 1, 1)), fin: iso(new Date(now.getFullYear(), now.getMonth(), 0)) };
  }
  if (p === 'trimestre') {
    const fm = Math.floor(now.getMonth() / 3) * 3;
    return { inicio: iso(new Date(now.getFullYear(), fm, 1)), fin: iso(new Date(now.getFullYear(), fm + 3, 0)) };
  }
  if (p === 'año') {
    return { inicio: `${now.getFullYear()}-01-01`, fin: `${now.getFullYear()}-12-31` };
  }
  return actual;
}

const rangoMesActual = (): { inicio: string; fin: string } => {
  const now = new Date();
  return { inicio: iso(new Date(now.getFullYear(), now.getMonth(), 1)), fin: iso(new Date(now.getFullYear(), now.getMonth() + 1, 0)) };
};

const PERIODOS: { key: PeriodoRapido; label: string }[] = [
  { key: 'semana', label: 'Esta semana' },
  { key: 'mes', label: 'Este mes' },
  { key: 'mes_anterior', label: 'Mes anterior' },
  { key: 'trimestre', label: 'Trimestre' },
  { key: 'año', label: 'Este año' },
  { key: 'personalizado', label: 'Personalizado' },
];

const Reportes: React.FC = () => {
  const { gastos, ingresos } = useData();

  const [view, setView] = useState<ViewType>('meses');
  const [rango, setRango] = useState(rangoMesActual);

  // Calendario compartido (rango principal o de exportación)
  const [calOpen, setCalOpen] = useState(false);
  const [selecting, setSelecting] = useState<'inicio' | 'fin'>('inicio');
  const [calTarget, setCalTarget] = useState<'main' | 'export'>('main');

  // Modal de exportación
  const [exportOpen, setExportOpen] = useState(false);
  const [periodoRapido, setPeriodoRapido] = useState<PeriodoRapido>('mes');
  const [exportRango, setExportRango] = useState(rangoMesActual);
  const [exportCliente, setExportCliente] = useState('');

  const placasActivas = [PLACA_ACTUAL];

  // ── Cálculos memorizados ──
  const {
    gastosPorPlaca, ingresosPorPlaca, gastosFiltrados, ingresosFiltrados,
    allKeys, chartGastosData, chartIngresosData, totalGastos, totalIngresos,
    balance, rentabilidad, formattedLabels,
  } = useMemo(() => {
    const set = new Set(placasActivas);
    const gPorPlaca = gastos.filter((g) => set.has(g.placa));
    const iPorPlaca = ingresos.filter((i) => set.has(i.placa));

    const gTransf = gPorPlaca.map((g) => ({ fecha: g.fecha, value: g.monto }));
    const iTransf = iPorPlaca.map((i) => ({ fecha: i.fecha, value: i.monto * (i.cantidad ?? 1) }));

    const gFilt = filtrarPorRango(gTransf, rango.inicio, rango.fin);
    const iFilt = filtrarPorRango(iTransf, rango.inicio, rango.fin);

    const sliceLen = view === 'dias' ? 10 : view === 'meses' ? 7 : 4;
    const keyFn = (item: { fecha: string }) => item.fecha?.slice(0, sliceLen);

    const groupedG = groupBy(gFilt, keyFn);
    const groupedI = groupBy(iFilt, keyFn);
    const keys = Array.from(new Set([...Object.keys(groupedG), ...Object.keys(groupedI)])).sort();

    const chartG = keys.map((k) => (isFinite(groupedG[k]) ? groupedG[k] : 0));
    const chartI = keys.map((k) => (isFinite(groupedI[k]) ? groupedI[k] : 0));

    const totG = chartG.reduce((a, b) => a + b, 0);
    const totI = chartI.reduce((a, b) => a + b, 0);
    const bal = totI - totG;
    const rent = totI === 0 ? '0' : ((bal / totI) * 100).toFixed(1);

    return {
      gastosPorPlaca: gPorPlaca,
      ingresosPorPlaca: iPorPlaca,
      gastosFiltrados: gFilt,
      ingresosFiltrados: iFilt,
      allKeys: keys,
      chartGastosData: chartG,
      chartIngresosData: chartI,
      totalGastos: totG,
      totalIngresos: totI,
      balance: bal,
      rentabilidad: rent,
      formattedLabels: keys.length > 0 ? keys.map((k) => formatLabel(k, view)) : ['Sin datos'],
    };
  }, [gastos, ingresos, rango.inicio, rango.fin, view]);

  const maxBar = Math.max(1, ...chartIngresosData, ...chartGastosData);
  const esPositivo = balance >= 0;
  const balColor = esPositivo ? 'var(--tb-income)' : 'var(--tb-expense)';
  const rentNum = Number(rentabilidad);

  const openCal = (tipo: 'inicio' | 'fin', target: 'main' | 'export' = 'main') => {
    setSelecting(tipo);
    setCalTarget(target);
    setCalOpen(true);
  };

  const seleccionarPeriodo = (p: PeriodoRapido) => {
    setPeriodoRapido(p);
    if (p !== 'personalizado') setExportRango(calcularRango(p, exportRango));
  };

  // ── Exportar a PDF (abre el informe e invoca el diálogo de impresión / guardar) ──
  const generarPDF = () => {
    const r = exportRango;
    const cliente = exportCliente.trim() || null;

    const gastosDetalle = (cliente ? [] : gastosPorPlaca.filter((g) => g.fecha >= r.inicio && g.fecha <= r.fin)).map((g) => ({
      fecha: g.fecha,
      tipo_gasto: nombreCategoria(GASTOS_CATEGORIAS, g.categoria),
      descripcion: g.descripcion,
      monto: g.monto,
    }));

    const ingresosDetalle = ingresosPorPlaca
      .filter((i) => i.fecha >= r.inicio && i.fecha <= r.fin && (cliente === null || clienteDeIngreso(i.descripcion) === cliente))
      .map((i) => ({
        fecha: i.fecha,
        tipo_ingreso: nombreCategoria(INGRESOS_CATEGORIAS, i.categoria),
        descripcion: i.descripcion,
        monto: i.monto,
        cantidad: i.cantidad,
        cliente: clienteDeIngreso(i.descripcion),
      }));

    if (gastosDetalle.length === 0 && ingresosDetalle.length === 0) {
      alert('No hay transacciones en el período seleccionado.');
      return;
    }

    const gGrp = groupBy(gastosDetalle.map((g) => ({ fecha: g.fecha, value: g.monto })), (g) => g.fecha.slice(0, 7));
    const iGrp = groupBy(ingresosDetalle.map((i) => ({ fecha: i.fecha, value: i.monto * (i.cantidad ?? 1) })), (i) => i.fecha.slice(0, 7));
    const keys = Array.from(new Set([...Object.keys(gGrp), ...Object.keys(iGrp)])).sort();
    const ingPeriodo = keys.map((k) => iGrp[k] || 0);
    const gasPeriodo = keys.map((k) => gGrp[k] || 0);
    const totIng = ingPeriodo.reduce((a, b) => a + b, 0);
    const totGas = gasPeriodo.reduce((a, b) => a + b, 0);
    const bal = totIng - totGas;
    const rent = totIng === 0 ? '0' : ((bal / totIng) * 100).toFixed(1);

    const html = generarReporteHTML({
      placas: placasActivas,
      rangoInicio: r.inicio,
      rangoFin: r.fin,
      totalIngresos: totIng,
      totalGastos: totGas,
      balance: bal,
      rentabilidad: rent,
      periodos: keys,
      ingresosPorPeriodo: ingPeriodo,
      gastosPorPeriodo: gasPeriodo,
      gastosDetalle,
      ingresosDetalle,
      view: 'meses',
      clienteFiltro: cliente,
    });

    setExportOpen(false);
    const w = window.open('', '_blank');
    if (!w) {
      alert('Permite las ventanas emergentes para exportar el informe.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => { try { w.focus(); w.print(); } catch { /* noop */ } }, 600);
  };

  // Clientes disponibles para sugerencias
  const clientesDisponibles = useMemo(
    () => Array.from(new Set(ingresosPorPlaca.map((i) => clienteDeIngreso(i.descripcion)).filter((v): v is string => !!v))).sort(),
    [ingresosPorPlaca]
  );
  const sugerencias = exportCliente.trim().length >= 2
    ? clientesDisponibles.filter((c) => c.toLowerCase().includes(exportCliente.trim().toLowerCase()))
    : [];

  const calValue = calTarget === 'export'
    ? (selecting === 'inicio' ? exportRango.inicio : exportRango.fin)
    : (selecting === 'inicio' ? rango.inicio : rango.fin);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="tb-header" style={{ padding: '8px 16px' }}>
            <h1 className="tb-title">Finanzas</h1>
            <span className="tb-plate">{PLACA_ACTUAL}</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding tb-screen">
        {/* Selector de rango */}
        <div className="rep-range">
          <button className="rep-date-btn" onClick={() => openCal('inicio')}>
            <span className="rep-date-label">Desde</span>
            <span className="rep-date-value">{formatDateShort(rango.inicio)}</span>
          </button>
          <IonIcon icon={arrowForward} style={{ color: 'var(--tb-text-muted)' }} />
          <button className="rep-date-btn" onClick={() => openCal('fin')}>
            <span className="rep-date-label">Hasta</span>
            <span className="rep-date-value">{formatDateShort(rango.fin)}</span>
          </button>
        </div>

        {/* Ingresos / Gastos */}
        <div className="tb-report-row">
          <div className="tb-stat">
            <p className="tb-stat-label">📈 Ingresos</p>
            <span className="tb-stat-value" style={{ color: 'var(--tb-income)' }}>{fmtCurrency(totalIngresos)}</span>
          </div>
          <div className="tb-stat">
            <p className="tb-stat-label">📉 Gastos</p>
            <span className="tb-stat-value" style={{ color: 'var(--tb-expense)' }}>{fmtCurrency(totalGastos)}</span>
          </div>
        </div>

        {/* Balance neto + rentabilidad */}
        <div className="tb-balance-card" style={{ borderColor: balColor, marginBottom: 16, textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="tb-stat-label">Balance neto</span>
            <span style={{ background: (rentNum >= 0 ? 'var(--tb-income-light)' : 'var(--tb-expense-light)'), color: balColor, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
              {rentNum >= 0 ? '+' : ''}{rentabilidad}%
            </span>
          </div>
          <span className="tb-balance-value" style={{ color: balColor, display: 'block', textAlign: 'left' }}>{fmtCurrency(balance)}</span>
          <span className="tb-balance-sub">{esPositivo ? 'ganancia en el período' : 'pérdida en el período'}</span>
        </div>

        {/* Tabs de vista */}
        <div className="rep-tabs">
          {(['dias', 'meses', 'años'] as ViewType[]).map((v) => (
            <button key={v} className={`rep-tab${view === v ? ' active' : ''}`} onClick={() => setView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* Gráfica comparativa */}
        <div className="tb-stat" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <strong style={{ fontSize: 14 }}>Comparativa</strong>
            <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
              <span><span style={{ color: 'var(--tb-income)' }}>●</span> Ingresos</span>
              <span><span style={{ color: 'var(--tb-expense)' }}>●</span> Gastos</span>
            </div>
          </div>
          {allKeys.length === 0 ? (
            <p className="tb-empty">Sin datos en este período.</p>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 130 }}>
              {allKeys.map((k, i) => (
                <div key={k} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', justifyContent: 'center', height: 100 }}>
                    <div style={{ width: '45%', height: `${(chartIngresosData[i] / maxBar) * 100}%`, minHeight: 2, background: 'var(--tb-income)', borderRadius: '4px 4px 0 0' }} />
                    <div style={{ width: '45%', height: `${(chartGastosData[i] / maxBar) * 100}%`, minHeight: 2, background: 'var(--tb-expense)', borderRadius: '4px 4px 0 0' }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--tb-text-muted)' }}>{formattedLabels[i]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalles */}
        <div className="tb-stat" style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 12, color: 'var(--tb-text-secondary)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Detalles del período</p>
          <div className="rep-detail-row">
            <span style={{ color: 'var(--tb-text-secondary)' }}>Transacciones</span>
            <span style={{ fontWeight: 700 }}>{gastosFiltrados.length + ingresosFiltrados.length}</span>
          </div>
          <div className="rep-detail-row">
            <span style={{ color: 'var(--tb-text-secondary)' }}>Promedio ingresos</span>
            <span style={{ fontWeight: 700, color: 'var(--tb-income)' }}>{fmtCurrency(ingresosFiltrados.length > 0 ? totalIngresos / Math.max(allKeys.length, 1) : 0)}</span>
          </div>
          <div className="rep-detail-row" style={{ borderBottom: 'none' }}>
            <span style={{ color: 'var(--tb-text-secondary)' }}>Promedio gastos</span>
            <span style={{ fontWeight: 700, color: 'var(--tb-expense)' }}>{fmtCurrency(gastosFiltrados.length > 0 ? totalGastos / Math.max(allKeys.length, 1) : 0)}</span>
          </div>
        </div>

        {/* Botón exportar */}
        <button
          className="tb-save-btn"
          style={{ background: 'var(--ion-color-primary)', color: 'var(--ion-color-primary-contrast)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          onClick={() => { seleccionarPeriodo('mes'); setExportCliente(''); setExportOpen(true); }}
        >
          <IonIcon icon={documentTextOutline} />
          Exportar informe
        </button>
      </IonContent>

      {/* Calendario */}
      <IonModal isOpen={calOpen} onDidDismiss={() => setCalOpen(false)} breakpoints={[0, 0.6]} initialBreakpoint={0.6}>
        <IonContent>
          <div style={{ padding: '8px 16px' }}>
            <div className="tb-sheet-handle" />
            <p style={{ textAlign: 'center', fontWeight: 700, margin: '0 0 8px' }}>
              Fecha {selecting === 'inicio' ? 'inicial' : 'final'}
            </p>
          </div>
          <IonDatetime
            presentation="date"
            value={calValue}
            onIonChange={(e) => {
              const v = e.detail.value;
              if (typeof v !== 'string') return;
              const fecha = v.slice(0, 10);
              if (calTarget === 'export') {
                setExportRango((prev) => ({ ...prev, [selecting]: fecha }));
                setPeriodoRapido('personalizado');
              } else {
                setRango((prev) => ({ ...prev, [selecting]: fecha }));
              }
              setCalOpen(false);
            }}
          />
        </IonContent>
      </IonModal>

      {/* Modal exportar */}
      <IonModal isOpen={exportOpen} onDidDismiss={() => setExportOpen(false)} breakpoints={[0, 0.85]} initialBreakpoint={0.85}>
        <IonContent>
          <div style={{ padding: '0 20px 24px' }}>
            <div className="tb-sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 20px' }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Exportar informe</h3>
              <button onClick={() => setExportOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <IonIcon icon={close} style={{ fontSize: 22, color: 'var(--tb-text-muted)' }} />
              </button>
            </div>

            {/* Períodos rápidos */}
            <p className="rep-export-label">Período</p>
            <div className="rep-periodos">
              {PERIODOS.map(({ key, label }) => (
                <button key={key} className={`rep-periodo-chip${periodoRapido === key ? ' active' : ''}`} onClick={() => seleccionarPeriodo(key)}>
                  {label}
                </button>
              ))}
            </div>

            {/* Rango personalizado */}
            <div className="rep-range" style={{ marginTop: 4 }}>
              <button className="rep-date-btn" onClick={() => openCal('inicio', 'export')}>
                <span className="rep-date-label">Desde</span>
                <span className="rep-date-value">{new Date(exportRango.inicio + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </button>
              <IonIcon icon={arrowForward} style={{ color: 'var(--tb-text-muted)' }} />
              <button className="rep-date-btn" onClick={() => openCal('fin', 'export')}>
                <span className="rep-date-label">Hasta</span>
                <span className="rep-date-value">{new Date(exportRango.fin + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </button>
            </div>

            {/* Filtro cliente */}
            <p className="rep-export-label" style={{ marginTop: 16 }}>Filtrar por cliente (opcional)</p>
            <input
              className="rep-cliente-input"
              style={{ borderColor: exportCliente ? 'var(--ion-color-primary)' : 'var(--tb-border)' }}
              placeholder="Escribe el nombre del cliente..."
              value={exportCliente}
              onChange={(e) => setExportCliente(e.target.value.replace(/[<>{}[\]\\/`'"%;()&+]/g, '').slice(0, 80))}
            />
            {sugerencias.length > 0 && (
              <div className="rep-sugerencias">
                {sugerencias.slice(0, 5).map((cli) => (
                  <button key={cli} className="rep-sugerencia-item" onClick={() => setExportCliente(cli)}>{cli}</button>
                ))}
              </div>
            )}

            {/* Generar */}
            <button className="tb-save-btn" style={{ background: 'var(--ion-color-primary)', color: 'var(--ion-color-primary-contrast)', marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={generarPDF}>
              <IonIcon icon={documentTextOutline} />
              Generar PDF
            </button>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Reportes;
