import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonButton, IonIcon, IonModal,
  IonList, IonItem, IonLabel, IonBadge
} from '@ionic/react';
import { swapHorizontalOutline, alertCircleOutline, shieldCheckmarkOutline, carOutline, constructOutline, idCardOutline, checkmarkCircle } from 'ionicons/icons';

interface Vehiculo {
  placa: string;
  tipo: string;
  estado: string;
}

const vehiculos: Vehiculo[] = [
  { placa: 'EKA854', tipo: 'Volqueta', estado: 'Activo' },
  { placa: 'TRK001', tipo: 'Tractomula', estado: 'Activo' },
  { placa: 'CMN332', tipo: 'Camión', estado: 'Inactivo' },
];

const Home: React.FC = () => {
  const [vehiculoActivo, setVehiculoActivo] = useState<Vehiculo>(vehiculos[0]);
  const [showModal, setShowModal] = useState(false);

  const tarjetas = [
    { icon: alertCircleOutline, label: 'Multas', color: '#eb445a', estado: 'Al día', ok: true },
    { icon: shieldCheckmarkOutline, label: 'SOAT', color: '#2dd36f', estado: 'Vigente', ok: true },
    { icon: carOutline, label: 'Tecno\nmecánica', color: '#3880ff', estado: 'Vigente', ok: true },
    { icon: constructOutline, label: 'Mantenimiento', color: '#ffc409', estado: 'Pendiente', ok: false },
    { icon: idCardOutline, label: 'Licencia', color: '#5260ff', estado: 'Vigente', ok: true },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>TruckBook</span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Vehículo activo */}
        <IonCard style={{ borderRadius: 16, background: '#1a1a2e', color: '#fff', margin: 0, marginBottom: 16 }}>
          <IonCardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: '#aaa' }}>Vehículo activo</p>
                <h2 style={{ margin: '4px 0', fontSize: 22, fontWeight: 800, color: '#fff' }}>
                  {vehiculoActivo.tipo}
                </h2>
                <span className="placa-chip">{vehiculoActivo.placa}</span>
              </div>
              <div style={{ fontSize: 48 }}>🚛</div>
            </div>
            <IonButton
              fill="outline"
              size="small"
              style={{ marginTop: 12, '--border-color': '#FFE500', '--color': '#FFE500' }}
              onClick={() => setShowModal(true)}
            >
              <IonIcon icon={swapHorizontalOutline} slot="start" />
              Cambiar vehículo
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Actividad semanal */}
        <div className="home-card-grid">
          <div className="home-stat-card">
            <p style={{ margin: 0, fontSize: 11, color: '#888' }}>⛽ Combustible</p>
            <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 700 }}>$500K</p>
            <p style={{ margin: 0, fontSize: 10, color: '#aaa' }}>Esta semana</p>
          </div>
          <div className="home-stat-card">
            <p style={{ margin: 0, fontSize: 11, color: '#888' }}>🚚 Viajes</p>
            <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 700 }}>6 viajes</p>
            <p style={{ margin: 0, fontSize: 10, color: '#aaa' }}>Desde $800K</p>
          </div>
          <div className="home-stat-card" style={{ gridColumn: '1 / -1' }}>
            <p style={{ margin: 0, fontSize: 11, color: '#888' }}>💰 Ingresos del mes</p>
            <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 800, color: '#2dd36f' }}>$1.600.000</p>
          </div>
        </div>

        {/* Tarjetas de consulta */}
        <h3 style={{ marginTop: 20, marginBottom: 10, fontWeight: 700, fontSize: 16 }}>Estado del vehículo</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {tarjetas.map((t, i) => (
            <IonCard key={i} style={{ borderRadius: 14, margin: 0 }} button>
              <IonCardContent style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IonIcon icon={t.icon} style={{ fontSize: 28, color: t.color }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, whiteSpace: 'pre-line' }}>{t.label}</p>
                    <IonBadge color={t.ok ? 'success' : 'warning'} style={{ fontSize: 10 }}>
                      {t.estado}
                    </IonBadge>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        {/* Modal cambio de vehículo */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} breakpoints={[0, 0.5]} initialBreakpoint={0.5}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Seleccionar vehículo</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {vehiculos.map((v, i) => (
                <IonItem
                  key={i}
                  button
                  onClick={() => { setVehiculoActivo(v); setShowModal(false); }}
                >
                  <IonIcon icon={carOutline} slot="start" />
                  <IonLabel>
                    <h3>{v.tipo}</h3>
                    <p><span className="placa-chip">{v.placa}</span></p>
                  </IonLabel>
                  {vehiculoActivo.placa === v.placa && (
                    <IonIcon icon={checkmarkCircle} slot="end" color="success" />
                  )}
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
