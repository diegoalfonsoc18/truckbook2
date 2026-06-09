import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonIcon, IonButton, IonBadge
} from '@ionic/react';
import {
  personOutline, carOutline, colorPaletteOutline,
  lockClosedOutline, notificationsOutline, helpCircleOutline,
  chevronForwardOutline, documentTextOutline, shieldOutline, logOutOutline
} from 'ionicons/icons';

const opciones = [
  { icon: personOutline, label: 'Mi perfil', sub: 'Nombre y datos personales' },
  { icon: lockClosedOutline, label: 'Seguridad', sub: 'Cambiar contraseña' },
  { icon: helpCircleOutline, label: 'Ayuda', sub: 'Soporte y contacto' },
];

const masInfo = [
  { icon: documentTextOutline, label: 'Términos y condiciones', sub: 'Condiciones de uso de la app' },
  { icon: shieldOutline, label: 'Política de privacidad', sub: 'Tratamiento de tu información' },
];

const Cuenta: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Avatar y datos */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: 24,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          marginBottom: 20
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#1a1a2e', color: '#FFE500',
            fontSize: 28, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            D
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>Diego Alfonso</h2>
          <p style={{ margin: '4px 0 8px', color: '#888', fontSize: 13 }}>dlalfonso57@gmail.com</p>
          <IonBadge color="primary" style={{ background: '#1a1a2e', color: '#FFE500', padding: '4px 12px', borderRadius: 20 }}>
            Conductor
          </IonBadge>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 20 }}>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 18 }}>12</p>
              <p style={{ margin: 0, fontSize: 11, color: '#888' }}>Viajes</p>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 18 }}>2.4K</p>
              <p style={{ margin: 0, fontSize: 11, color: '#888' }}>km</p>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 18 }}>$1.2M</p>
              <p style={{ margin: 0, fontSize: 11, color: '#888' }}>del mes</p>
            </div>
          </div>
        </div>

        {/* Configuración */}
        <p style={{ fontWeight: 700, marginBottom: 8 }}>Configuración</p>
        <IonList style={{ background: 'transparent', padding: 0, marginBottom: 16 }}>
          {opciones.map((op, i) => (
            <IonItem key={i} button lines="none"
              style={{ '--background': '#fff', '--border-radius': '12px', marginBottom: 6 }}>
              <IonIcon icon={op.icon} slot="start" color="dark" />
              <IonLabel>
                <h3>{op.label}</h3>
                <p style={{ color: '#aaa', fontSize: 12 }}>{op.sub}</p>
              </IonLabel>
              <IonIcon icon={chevronForwardOutline} slot="end" color="medium" />
            </IonItem>
          ))}
        </IonList>

        {/* Más información */}
        <p style={{ fontWeight: 700, marginBottom: 8 }}>Más información</p>
        <IonList style={{ background: 'transparent', padding: 0, marginBottom: 20 }}>
          {masInfo.map((op, i) => (
            <IonItem key={i} button lines="none"
              style={{ '--background': '#fff', '--border-radius': '12px', marginBottom: 6 }}>
              <IonIcon icon={op.icon} slot="start" color="dark" />
              <IonLabel>
                <h3>{op.label}</h3>
                <p style={{ color: '#aaa', fontSize: 12 }}>{op.sub}</p>
              </IonLabel>
              <IonIcon icon={chevronForwardOutline} slot="end" color="medium" />
            </IonItem>
          ))}
        </IonList>

        {/* Cerrar sesión */}
        <IonButton
          expand="block"
          fill="outline"
          color="danger"
          style={{ marginBottom: 8 }}
        >
          <IonIcon icon={logOutOutline} slot="start" />
          Cerrar sesión
        </IonButton>

        <p style={{ textAlign: 'center', color: '#ccc', fontSize: 12, marginTop: 16 }}>
          TruckBook v1.0.0 – Entrega 2
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Cuenta;
