import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonIcon, IonModal, IonList, IonItem, IonLabel
} from '@ionic/react';
import {
  cubeOutline, peopleOutline, timeOutline, personCircleOutline,
  carOutline, checkmarkCircle, arrowUp, arrowDown
} from 'ionicons/icons';
import volquetaImg from '../assets/icon/volquetaFlete.webp';
import estacaImg from '../assets/icon/estacaFlete.webp';

interface Vehiculo {
  placa: string;
  tipo: string;
  estado: string;
  img: string;
}

const vehiculos: Vehiculo[] = [
  { placa: 'EKA854', tipo: 'Volqueta', estado: 'Activo', img: volquetaImg },
  { placa: 'TRK001', tipo: 'Tractomula', estado: 'Activo', img: estacaImg },
  { placa: 'CMN332', tipo: 'Camión', estado: 'Inactivo', img: estacaImg },
];

// Datos de ejemplo (luego vendrán de Supabase)
const porCobrar = [
  { nombre: 'Yohan Gonzales', monto: '$650K' },
  { nombre: 'German Eduardo...', monto: '$180K' },
  { nombre: 'Gerucho', monto: '$1.0M' },
];

const actividad = [
  { emoji: '⛽', label: 'Combustible', valor: '$150K', trend: '↓ 83% vs sem. ant.', trendColor: '#2dd36f', nota1: 'Últ: $150K', nota2: 'Hace 3 días' },
  { emoji: '🗺️', label: 'Viajes', valor: '3 viajes', trend: '↓ 75% vs sem. ant.', trendColor: '#eb445a', nota1: 'Prom: $333K', nota2: 'Hace 2 días' },
  { emoji: '🚧', label: 'Peajes', valor: '$0', trend: 'Sin peajes', trendColor: '#2dd36f', nota1: 'Sin registro', nota2: '' },
];

const topClientes = [
  { rank: 1, nombre: 'Efrain Alvarado', ruta: 'Buenos Aires-San Sebastián', viajes: 8, total: '$2.0M' },
  { rank: 2, nombre: 'Gerucho', ruta: 'Buenos aires-Manta', viajes: 3, total: '$1.4M' },
];

const Home: React.FC = () => {
  const [vehiculoActivo, setVehiculoActivo] = useState<Vehiculo>(vehiculos[0]);
  const [showModal, setShowModal] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>TruckBook</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* ===== Vehículo activo ===== */}
        <div className="vehiculo-card" onClick={() => setShowModal(true)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: '#999' }}>vehículo activo</p>
              <h1 style={{ margin: '6px 0 8px', fontSize: 30, fontWeight: 800, color: '#1a1a1a' }}>
                {vehiculoActivo.tipo}
              </h1>
              <span className="placa-chip" style={{ fontSize: 17, padding: '5px 16px' }}>
                {vehiculoActivo.placa}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: 14, color: '#777' }}>⛽ 118 gal</p>
              <img
                src={vehiculoActivo.img}
                alt={vehiculoActivo.tipo}
                style={{ width: 140, height: 'auto', marginTop: 4, display: 'block', marginLeft: 'auto' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#666', fontSize: 14 }}>
              <IonIcon icon={cubeOutline} /> 17 viajes
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#666', fontSize: 14 }}>
              <IonIcon icon={peopleOutline} /> 10 clientes
            </span>
            <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: 15, color: '#1a1a1a' }}>
              Esta semana: $8.6M
            </span>
          </div>
        </div>

        {/* ===== Medidor + Por cobrar ===== */}
        <div className="home-duo">
          {/* Medidor de equilibrio */}
          <div className="gauge-card">
            <svg viewBox="0 0 200 130" width="100%" style={{ display: 'block' }}>
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#eb445a" />
                  <stop offset="55%" stopColor="#ff7a3c" />
                  <stop offset="100%" stopColor="#ffc409" />
                </linearGradient>
              </defs>
              {/* Tramo dashed (lado derecho) */}
              <path d="M 67 29.3 A 78 78 0 0 1 178 100" fill="none"
                stroke="#9bbfa6" strokeWidth="5" strokeLinecap="round" strokeDasharray="1.5 9" />
              {/* Tramo de color (lado izquierdo) */}
              <path d="M 22 100 A 78 78 0 0 1 67 29.3" fill="none"
                stroke="url(#gaugeGrad)" strokeWidth="11" strokeLinecap="round" />
              {/* Punto/indicador */}
              <circle cx="67" cy="29.3" r="9" fill="#ffc409" opacity="0.35" />
              <circle cx="67" cy="29.3" r="5" fill="#ffd84d" />
            </svg>
            <div style={{ marginTop: -34 }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: '#2dd36f' }}>0</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0a500' }}>Equilibrio</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 13 }}>
              <span style={{ color: '#2dd36f', fontWeight: 600 }}>
                <IonIcon icon={arrowUp} style={{ verticalAlign: '-2px' }} /> 0
              </span>
              <span style={{ color: '#eb445a', fontWeight: 600 }}>
                <IonIcon icon={arrowDown} style={{ verticalAlign: '-2px' }} /> 0
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#8aa593' }}>Semana 850K</p>
          </div>

          {/* Por cobrar */}
          <div className="cobrar-card">
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#8a2a2a' }}>Por cobrar</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0 12px' }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%', background: '#f7c9c9',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <IonIcon icon={timeOutline} style={{ fontSize: 22, color: '#c0392b' }} />
              </div>
              <span style={{ fontSize: 30, fontWeight: 800, color: '#e23b3b' }}>$4.6M</span>
            </div>
            {porCobrar.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <IonIcon icon={personCircleOutline} style={{ fontSize: 20, color: '#c98a8a' }} />
                <span style={{ fontSize: 13, color: '#3a3a3a', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.nombre}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{c.monto}</span>
              </div>
            ))}
            <p style={{ margin: '4px 0 0', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#b06a3a' }}>
              +9 más
            </p>
          </div>
        </div>

        {/* ===== Actividad semanal ===== */}
        <h2 style={{ margin: '22px 0 12px', fontSize: 26, fontWeight: 800, color: '#1a1a1a' }}>
          Actividad semanal
        </h2>
        <div className="actividad-scroll">
          {actividad.map((a, i) => (
            <div key={i} className="actividad-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 26 }}>{a.emoji}</span>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{a.label}</span>
              </div>
              <p style={{ margin: '12px 0 6px', fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>{a.valor}</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: a.trendColor }}>{a.trend}</p>
              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '12px 0 8px' }} />
              <p style={{ margin: 0, fontSize: 13, color: '#999' }}>{a.nota1}</p>
              {a.nota2 && <p style={{ margin: 0, fontSize: 13, color: '#999' }}>{a.nota2}</p>}
            </div>
          ))}
        </div>

        {/* ===== Top Clientes ===== */}
        <div className="top-clientes-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <IonIcon icon={peopleOutline} style={{ fontSize: 20 }} />
            <span style={{ fontSize: 19, fontWeight: 700 }}>Top Clientes</span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 14,
            fontSize: 12, color: '#888', textTransform: 'none', paddingBottom: 8
          }}>
            <span style={{ width: 36 }}>Cliente</span>
            <span></span>
            <span>Viajes</span>
            <span style={{ minWidth: 56, textAlign: 'right' }}>Total</span>
          </div>
          {topClientes.map((c) => {
            const oro = c.rank === 1;
            return (
              <div key={c.rank} className="top-cliente-row">
                <div className="rank-badge" style={{
                  border: `2px solid ${oro ? '#c9a227' : '#555'}`,
                  background: oro ? 'rgba(201,162,39,0.18)' : 'rgba(255,255,255,0.06)',
                  color: oro ? '#e8c45a' : '#bbb'
                }}>
                  {c.rank}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{c.nombre}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 13, color: '#888' }}>{c.ruta}</p>
                </div>
                <span style={{ fontSize: 17, fontWeight: 700 }}>{c.viajes}</span>
                <span style={{
                  minWidth: 56, textAlign: 'right', fontSize: 17, fontWeight: 800,
                  color: oro ? '#f0b400' : '#fff'
                }}>
                  {c.total}
                </span>
              </div>
            );
          })}
        </div>

        {/* ===== Modal cambio de vehículo ===== */}
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
