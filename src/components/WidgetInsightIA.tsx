import React, { useMemo, useState } from 'react';
import { IonIcon, IonModal, IonContent } from '@ionic/react';
import { timerOutline, person, briefcase } from 'ionicons/icons';
import { useData } from '../data/DataContext';
import { formatCompact, formatCurrency, diasDesde } from '../data/format';
import { esEmpresa } from '../data/clientes';

// Port web de src/Screens/Home/widgets/WidgetInsightIA.tsx (solo modo claro).
// "Por cobrar": total con urgencia + mini lista de pendientes y modal de detalle.
// Se omiten el servicio de notificaciones IA y useClientType del original.

const wText = '#691714';
const wMuted = '#8B5E3C';

const nombreDe = (i: { descripcion?: string; categoria?: string }) =>
  (i.descripcion ?? i.categoria ?? 'Flete').split(' · ')[0].trim();

const colorPorDias = (dias: number) => (dias >= 15 ? '#EF4444' : dias >= 7 ? '#F59E0B' : '#16A34A');

const WidgetInsightIA: React.FC = () => {
  const { ingresos } = useData();
  const [modalVisible, setModalVisible] = useState(false);

  const pendientes = useMemo(
    () =>
      ingresos
        .filter((i) => i.estado === 'pendiente')
        .sort((a, b) => ((a.fecha ?? '') > (b.fecha ?? '') ? 1 : -1)),
    [ingresos]
  );

  const totalPend = pendientes.reduce((a, i) => a + (i.monto ?? 0) * (i.cantidad ?? 1), 0);
  const mostrados = pendientes.slice(0, 3);
  const resto = pendientes.length - 3;

  const diasMax = pendientes.length > 0 ? diasDesde(pendientes[0].fecha) : 0;
  const urgencia = Math.min(diasMax / 30, 1);
  const urgenciaColor = urgencia < 0.5 ? '#7e1d1a' : '#EF4444';

  return (
    <>
      <div
        className="widget-card"
        style={{ background: 'linear-gradient(135deg, #FFF7F4, #FFEDE8)', padding: '12px 13px', cursor: pendientes.length ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        onClick={() => pendientes.length > 0 && setModalVisible(true)}
      >
        {/* Header */}
        <span style={{ fontSize: 10, fontWeight: 700, color: wText, letterSpacing: 0.5 }}>Por cobrar</span>

        {/* Total */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {pendientes.length > 0 && (
            <div style={{ width: 36, height: 36, borderRadius: 18, background: '#FFD6C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IonIcon icon={timerOutline} style={{ fontSize: 20, color: '#8B3A1A' }} />
            </div>
          )}
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.8, lineHeight: '26px', color: pendientes.length > 0 ? urgenciaColor : wText }}>
            {pendientes.length > 0 ? formatCompact(totalPend) : 'Al día ✓'}
          </span>
        </div>

        {/* Lista mini o vacío */}
        {pendientes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <div style={{ fontSize: 22, marginBottom: 2 }}>🎉</div>
            <div style={{ fontSize: 10, color: wMuted }}>Sin pendientes</div>
          </div>
        ) : (
          <div>
            {mostrados.map((item) => {
              const cliente = nombreDe(item);
              const dias = diasDesde(item.fecha);
              const itemColor = colorPorDias(dias);
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '3px 0', gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: itemColor + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IonIcon icon={esEmpresa(cliente) ? briefcase : person} style={{ fontSize: 13, color: itemColor }} />
                  </div>
                  <span style={{ flex: 1, fontSize: 10, fontWeight: 500, color: '#3a3a3a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cliente}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#3a3a3a' }}>{formatCompact((item.monto ?? 0) * (item.cantidad ?? 1))}</span>
                </div>
              );
            })}
            {resto > 0 && (
              <div style={{ fontSize: 9, color: wMuted, textAlign: 'center', fontWeight: 600, marginTop: 2 }}>+{resto} más</div>
            )}
          </div>
        )}
      </div>

      {/* Modal detalle */}
      <IonModal isOpen={modalVisible} onDidDismiss={() => setModalVisible(false)} breakpoints={[0, 0.75]} initialBreakpoint={0.75}>
        <IonContent>
          <div style={{ padding: '0 20px 20px' }}>
            <div className="tb-sheet-handle" />
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '4px 0 4px' }}>Por cobrar</h3>
            <p style={{ margin: '0 0 16px', color: 'var(--tb-text-secondary)', fontSize: 13 }}>
              {pendientes.length} pendiente{pendientes.length === 1 ? '' : 's'} · {formatCurrency(totalPend)}
            </p>
            {pendientes.map((item) => {
              const cliente = nombreDe(item);
              const dias = diasDesde(item.fecha);
              const itemColor = colorPorDias(dias);
              return (
                <div key={item.id} className="tb-row" style={{ marginBottom: 8 }}>
                  <span className="tb-row-icon" style={{ background: itemColor + '1A' }}>
                    <IonIcon icon={esEmpresa(cliente) ? briefcase : person} style={{ fontSize: 20, color: itemColor }} />
                  </span>
                  <div className="tb-row-info">
                    <p className="tb-row-name">{cliente}</p>
                    <span style={{ fontSize: 11, fontWeight: 600, color: itemColor }}>
                      {dias === 0 ? 'Hoy' : `Hace ${dias} día${dias === 1 ? '' : 's'}`}
                    </span>
                  </div>
                  <div className="tb-row-amount">{formatCurrency((item.monto ?? 0) * (item.cantidad ?? 1))}</div>
                </div>
              );
            })}
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default WidgetInsightIA;
