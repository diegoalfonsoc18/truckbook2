import React, { useMemo } from 'react';
import { IonIcon } from '@ionic/react';
import { peopleOutline, personAddOutline, person, briefcase } from 'ionicons/icons';
import { useData } from '../data/DataContext';
import { formatCompact } from '../data/format';
import { esEmpresa } from '../data/clientes';

// Port web del widget original src/Screens/Home/widgets/WidgetClientes.tsx
// (sin expo-linear-gradient, @expo/vector-icons, normalización Gemini ni useClientType).
// Deriva los clientes a partir de los ingresos tipo "flete" del store.

const MEDAL = ['#FFB800', '#94A3B8', '#CD7F32']; // oro, plata, bronce

interface ClienteInfo {
  viajes: number;
  total: number;
  ultimaFecha: string;
  cargas: Map<string, number>;
}

const WidgetClientes: React.FC = () => {
  const { ingresos } = useData();

  const clienteData = useMemo<Array<[string, ClienteInfo]>>(() => {
    const clienteMap = new Map<string, ClienteInfo>();

    for (const ing of ingresos) {
      if (ing.categoria !== 'flete' || !ing.descripcion) continue;

      // Limpiar [TEL:xxx] antes de parsear
      const descLimpia = ing.descripcion.replace(/\[TEL:[^\]]*\]/g, '').trim();
      const partes = descLimpia.split(' · ');
      const nombre = partes[0]?.trim();
      if (!nombre || nombre === 'Flete') continue;

      const prev = clienteMap.get(nombre) ?? { viajes: 0, total: 0, ultimaFecha: '', cargas: new Map() };
      const cant = ing.cantidad ?? 1;
      prev.viajes += cant;
      prev.total += (ing.monto ?? 0) * cant;
      if (ing.fecha > prev.ultimaFecha) prev.ultimaFecha = ing.fecha;

      const rawMercancia =
        partes.length >= 3
          ? partes[partes.length - 1]?.trim()
          : partes.length === 2
            ? partes[1]?.trim()
            : null;
      const mercancia = rawMercancia?.trim() || null;
      if (mercancia && !mercancia.includes('→')) {
        prev.cargas.set(mercancia, (prev.cargas.get(mercancia) ?? 0) + 1);
      }

      clienteMap.set(nombre, prev);
    }

    // Ordenar por total de ganancias (mayor primero), top 7
    return Array.from(clienteMap.entries()).sort((a, b) => b[1].total - a[1].total).slice(0, 7);
  }, [ingresos]);

  // ── Estado vacío ──
  if (clienteData.length === 0) {
    return (
      <div className="top-clientes-card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', marginBottom: 12 }}>
          <IonIcon icon={peopleOutline} style={{ fontSize: 16 }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.8 }}>Top Clientes</span>
        </div>
        <IonIcon icon={personAddOutline} style={{ fontSize: 24 }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '8px 0 0', lineHeight: '17px' }}>
          Registra fletes para ver tus clientes frecuentes
        </p>
      </div>
    );
  }

  const muted = 'rgba(255,255,255,0.50)';
  const div = 'rgba(255,255,255,0.10)';

  return (
    <div className="top-clientes-card">
      {/* Título */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <IonIcon icon={peopleOutline} style={{ fontSize: 16 }} />
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.8 }}>Top Clientes</span>
      </div>

      {/* Encabezados de columna */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ flex: 1, fontSize: 10, fontWeight: 700, color: muted, letterSpacing: 0.8 }}>Cliente</span>
        <span style={{ width: 55, fontSize: 10, fontWeight: 700, color: muted, textAlign: 'right', letterSpacing: 0.8 }}>Viajes</span>
        <span style={{ width: 75, fontSize: 10, fontWeight: 700, color: muted, textAlign: 'right', letterSpacing: 0.8 }}>Total</span>
      </div>
      <div style={{ height: 1, background: div, marginBottom: 4 }} />

      {clienteData.map(([nombre, info], idx) => {
        const medal = MEDAL[idx] ?? '#FFFFFF';
        const topCarga = info.cargas.size > 0
          ? Array.from(info.cargas.entries()).sort((a, b) => b[1] - a[1])[0][0]
          : null;

        return (
          <div key={nombre}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0', gap: 10 }}>
              {/* Avatar */}
              <div style={{
                width: 38, height: 38, borderRadius: 19, flexShrink: 0,
                border: `1.5px solid ${medal}40`, background: `${medal}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {idx < 3 ? (
                  <span style={{ fontSize: 15, fontWeight: 900, color: medal }}>{idx + 1}</span>
                ) : (
                  <IonIcon icon={esEmpresa(nombre) ? briefcase : person} style={{ fontSize: 15, color: medal }} />
                )}
              </div>

              {/* Nombre + carga */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {nombre}
                </div>
                {topCarga && (
                  <div style={{ fontSize: 10, color: muted, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {topCarga}
                  </div>
                )}
              </div>

              {/* Viajes */}
              <span style={{ width: 55, fontSize: 15, fontWeight: 800, color: '#fff', textAlign: 'right' }}>
                {info.viajes}
              </span>

              {/* Total */}
              <span style={{ width: 75, fontSize: 13, fontWeight: 800, color: medal, textAlign: 'right' }}>
                {formatCompact(info.total)}
              </span>
            </div>
            {idx < clienteData.length - 1 && (
              <div style={{ height: 1, background: div, marginLeft: 48 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WidgetClientes;
