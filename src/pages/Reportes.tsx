import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardContent
} from '@ionic/react';

const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
const dataIngresos = [1200000, 1800000, 900000, 1300000, 3400000, 2100000];
const dataGastos =   [800000, 1200000, 750000, 1448000, 556500, 1400000];

const Reportes: React.FC = () => {
  const [filtro, setFiltro] = useState<'dias' | 'meses' | 'anos'>('meses');

  const totalIngresos = dataIngresos[4]; // Mayo como activo
  const totalGastos = dataGastos[4];
  const balance = totalIngresos - totalGastos;
  const porcentaje = ((balance / totalIngresos) * 100).toFixed(1);
  const esPositivo = balance >= 0;

  const maxVal = Math.max(...dataIngresos, ...dataGastos);
  const formatCOP = (n: number) => {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
    return '$' + n;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Finanzas</span>
              <span className="placa-chip">EKA854</span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Período */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, background: '#fff', borderRadius: 12, padding: '10px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: '#aaa' }}>Desde</p>
            <p style={{ margin: 0, fontWeight: 600 }}>1 de may.</p>
          </div>
          <span style={{ color: '#aaa' }}>→</span>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: '#aaa' }}>Hasta</p>
            <p style={{ margin: 0, fontWeight: 600 }}>31 de may.</p>
          </div>
        </div>

        {/* Cards ingresos / gastos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div className="home-stat-card">
            <p style={{ margin: 0, fontSize: 11, color: '#888' }}>📈 Ingresos</p>
            <p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 800, color: '#2dd36f' }}>
              {formatCOP(totalIngresos)}
            </p>
          </div>
          <div className="home-stat-card">
            <p style={{ margin: 0, fontSize: 11, color: '#888' }}>📉 Gastos</p>
            <p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 800, color: '#eb445a' }}>
              {formatCOP(totalGastos)}
            </p>
          </div>
        </div>

        {/* Balance neto */}
        <IonCard style={{ borderRadius: 16, border: `2px solid ${esPositivo ? '#2dd36f' : '#eb445a'}`, margin: '0 0 16px', boxShadow: 'none' }}>
          <IonCardContent>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>Balance neto</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: esPositivo ? '#2dd36f' : '#eb445a' }}>
                {esPositivo ? '+' : ''}{formatCOP(balance)}
              </span>
              <span style={{
                background: esPositivo ? '#d1e7dd' : '#f8d7da',
                color: esPositivo ? '#0a3622' : '#842029',
                padding: '4px 10px', borderRadius: 20, fontWeight: 700, fontSize: 13
              }}>
                {esPositivo ? '+' : ''}{porcentaje}%
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#aaa' }}>
              {esPositivo ? 'Ganancia en el período' : 'Pérdida en el período'}
            </p>
          </IonCardContent>
        </IonCard>

        {/* Filtros */}
        <IonSegment value={filtro} onIonChange={(e) => setFiltro(e.detail.value as any)} style={{ marginBottom: 16 }}>
          <IonSegmentButton value="dias"><IonLabel>Días</IonLabel></IonSegmentButton>
          <IonSegmentButton value="meses"><IonLabel>Meses</IonLabel></IonSegmentButton>
          <IonSegmentButton value="anos"><IonLabel>Años</IonLabel></IonSegmentButton>
        </IonSegment>

        {/* Gráfica de barras */}
        <IonCard style={{ borderRadius: 16, margin: '0 0 16px' }}>
          <IonCardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <strong style={{ fontSize: 14 }}>Comparativa</strong>
              <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                <span><span style={{ color: '#2dd36f' }}>●</span> Ingresos</span>
                <span><span style={{ color: '#eb445a' }}>●</span> Gastos</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 130, paddingBottom: 24, position: 'relative' }}>
              {meses.map((mes, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', justifyContent: 'center', height: 100 }}>
                    <div style={{
                      width: '45%',
                      height: `${(dataIngresos[i] / maxVal) * 100}%`,
                      background: '#2dd36f',
                      borderRadius: '4px 4px 0 0',
                      opacity: i === 4 ? 1 : 0.5
                    }} />
                    <div style={{
                      width: '45%',
                      height: `${(dataGastos[i] / maxVal) * 100}%`,
                      background: '#eb445a',
                      borderRadius: '4px 4px 0 0',
                      opacity: i === 4 ? 1 : 0.5
                    }} />
                  </div>
                  <span style={{ fontSize: 10, color: '#aaa' }}>{mes}</span>
                </div>
              ))}
            </div>
          </IonCardContent>
        </IonCard>

        {/* Detalles */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <p style={{ margin: 0, fontWeight: 600, marginBottom: 12 }}>Detalles del período</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>Transacciones</span>
            <span style={{ fontWeight: 700 }}>10</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ color: '#888' }}>Promedio diario gastos</span>
            <span style={{ fontWeight: 700, color: '#eb445a' }}>$17.952</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ color: '#888' }}>Promedio diario ingresos</span>
            <span style={{ fontWeight: 700, color: '#2dd36f' }}>$109.677</span>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Reportes;
