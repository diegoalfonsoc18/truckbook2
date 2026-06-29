import React, { useMemo, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent,
  IonSegment, IonSegmentButton, IonLabel,
} from '@ionic/react';
import { useData } from '../data/DataContext';
import { formatCurrency, formatCompact } from '../data/format';

type Periodo = 'dias' | 'meses' | 'anos';

// Agrupa montos por una clave derivada de la fecha
function agrupar<T extends { fecha: string; monto: number; cantidad?: number }>(
  items: T[],
  clave: (f: Date) => string
): Record<string, number> {
  return items.reduce((acc, it) => {
    const k = clave(new Date(it.fecha + 'T12:00:00'));
    acc[k] = (acc[k] ?? 0) + it.monto * (it.cantidad ?? 1);
    return acc;
  }, {} as Record<string, number>);
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const Reportes: React.FC = () => {
  const { placa, gastos, ingresos } = useData();
  const [periodo, setPeriodo] = useState<Periodo>('meses');

  const totalIngresos = useMemo(
    () => ingresos.reduce((a, i) => a + i.monto * (i.cantidad ?? 1), 0),
    [ingresos]
  );
  const totalGastos = useMemo(() => gastos.reduce((a, g) => a + g.monto, 0), [gastos]);
  const balance = totalIngresos - totalGastos;
  const esPositivo = balance >= 0;
  const balanceColor = esPositivo ? 'var(--tb-income)' : 'var(--tb-expense)';

  // Claves de agrupación según el período
  const claveFn = useMemo(() => {
    if (periodo === 'dias') return (f: Date) => String(f.getDate());
    if (periodo === 'anos') return (f: Date) => String(f.getFullYear());
    return (f: Date) => MESES[f.getMonth()];
  }, [periodo]);

  const { etiquetas, barras } = useMemo(() => {
    const gIng = agrupar(ingresos, claveFn);
    const gGas = agrupar(gastos, claveFn);
    const keys = Array.from(new Set([...Object.keys(gIng), ...Object.keys(gGas)]));
    const max = Math.max(1, ...Object.values(gIng), ...Object.values(gGas));
    return {
      etiquetas: keys,
      barras: keys.map((k) => ({
        label: k,
        ing: ((gIng[k] ?? 0) / max) * 100,
        gas: ((gGas[k] ?? 0) / max) * 100,
      })),
    };
  }, [ingresos, gastos, claveFn]);

  const numTransacciones = gastos.length + ingresos.length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="tb-header" style={{ padding: '8px 16px' }}>
            <h1 className="tb-title">Finanzas</h1>
            <span className="tb-plate">{placa}</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding tb-screen">
        {/* Ingresos / Gastos */}
        <div className="tb-report-row">
          <div className="tb-stat">
            <p className="tb-stat-label">📈 Ingresos</p>
            <span className="tb-stat-value" style={{ color: 'var(--tb-income)' }}>
              {formatCurrency(totalIngresos)}
            </span>
          </div>
          <div className="tb-stat">
            <p className="tb-stat-label">📉 Gastos</p>
            <span className="tb-stat-value" style={{ color: 'var(--tb-expense)' }}>
              {formatCurrency(totalGastos)}
            </span>
          </div>
        </div>

        {/* Balance */}
        <div className="tb-balance-card" style={{ borderColor: balanceColor, marginBottom: 20 }}>
          <span className="tb-stat-label">Balance</span>
          <span className="tb-balance-value" style={{ color: balanceColor }}>
            {esPositivo ? '+' : ''}{formatCurrency(balance)}
          </span>
          <span className="tb-balance-sub">
            {esPositivo ? 'Ganancia del periodo' : 'Pérdida del periodo'}
          </span>
        </div>

        {/* Filtros */}
        <IonSegment value={periodo} onIonChange={(e) => setPeriodo(e.detail.value as Periodo)} style={{ marginBottom: 16 }}>
          <IonSegmentButton value="dias"><IonLabel>Días</IonLabel></IonSegmentButton>
          <IonSegmentButton value="meses"><IonLabel>Meses</IonLabel></IonSegmentButton>
          <IonSegmentButton value="anos"><IonLabel>Años</IonLabel></IonSegmentButton>
        </IonSegment>

        {/* Gráfica comparativa */}
        <div className="tb-stat" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <strong style={{ fontSize: 14 }}>Comparativa</strong>
            <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
              <span><span style={{ color: 'var(--tb-income)' }}>●</span> Ingresos</span>
              <span><span style={{ color: 'var(--tb-expense)' }}>●</span> Gastos</span>
            </div>
          </div>

          {etiquetas.length === 0 ? (
            <p className="tb-empty">Sin datos para este período.</p>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 130 }}>
              {barras.map((b, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', justifyContent: 'center', height: 100 }}>
                    <div style={{ width: '45%', height: `${b.ing}%`, minHeight: 2, background: 'var(--tb-income)', borderRadius: '4px 4px 0 0' }} />
                    <div style={{ width: '45%', height: `${b.gas}%`, minHeight: 2, background: 'var(--tb-expense)', borderRadius: '4px 4px 0 0' }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--tb-text-muted)' }}>{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalles */}
        <div className="tb-stat">
          <p style={{ margin: '0 0 12px', fontWeight: 600 }}>Detalles del período</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--tb-text-secondary)' }}>Transacciones</span>
            <span style={{ fontWeight: 700 }}>{numTransacciones}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ color: 'var(--tb-text-secondary)' }}>Total ingresos</span>
            <span style={{ fontWeight: 700, color: 'var(--tb-income)' }}>{formatCompact(totalIngresos)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ color: 'var(--tb-text-secondary)' }}>Total gastos</span>
            <span style={{ fontWeight: 700, color: 'var(--tb-expense)' }}>{formatCompact(totalGastos)}</span>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Reportes;
