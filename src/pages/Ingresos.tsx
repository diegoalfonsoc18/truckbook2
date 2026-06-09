import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonModal, IonButton, IonInput, IonItem, IonLabel,
  IonList, IonIcon, IonAlert
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';

interface Ingreso {
  id: number;
  categoria: string;
  icono: string;
  monto: number;
  cliente: string;
  estado: 'Confirmado' | 'Por cobrar';
}

const categorias = [
  { label: 'Flete', icono: '📦' },
  { label: 'Anticipo', icono: '💵' },
  { label: 'Reembolso', icono: '💰' },
  { label: 'Otro', icono: '🪙' },
  { label: 'Cobro', icono: '🧾' },
];

const today = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

const Ingresos: React.FC = () => {
  const [ingresos, setIngresos] = useState<Ingreso[]>([
    { id: 1, categoria: 'Flete', icono: '📦', monto: 450000, cliente: 'Manuel Morales', estado: 'Por cobrar' },
    { id: 2, categoria: 'Flete', icono: '📦', monto: 250000, cliente: 'Luis Fernando Puerta', estado: 'Confirmado' },
    { id: 3, categoria: 'Flete', icono: '📦', monto: 750000, cliente: 'Edwin Duarte', estado: 'Por cobrar' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<{ label: string; icono: string } | null>(null);
  const [monto, setMonto] = useState('');
  const [cliente, setCliente] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [ingresoAEliminar, setIngresoAEliminar] = useState<number | null>(null);

  const total = ingresos.reduce((acc, g) => acc + g.monto, 0);

  const abrirModal = (cat: { label: string; icono: string }) => {
    setCategoriaSeleccionada(cat);
    setMonto('');
    setCliente('');
    setShowModal(true);
  };

  const guardarIngreso = () => {
    if (!monto || isNaN(Number(monto)) || !categoriaSeleccionada) return;
    const nuevo: Ingreso = {
      id: Date.now(),
      categoria: categoriaSeleccionada.label,
      icono: categoriaSeleccionada.icono,
      monto: Number(monto),
      cliente: cliente || 'Sin nombre',
      estado: 'Por cobrar',
    };
    setIngresos([...ingresos, nuevo]);
    setShowModal(false);
  };

  const eliminarIngreso = (id: number) => {
    setIngresos(ingresos.filter(g => g.id !== id));
  };

  const formatCOP = (n: number) => '$ ' + n.toLocaleString('es-CO');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Ingresos</span>
              <span className="placa-chip">EKA854</span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <p style={{ color: '#888', fontSize: 13, margin: '0 0 8px' }}>📅 {today}</p>

        {/* Total del día */}
        <div className="total-card">
          <p className="total-label">Total del día</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="total-amount" style={{ color: '#2dd36f' }}>{formatCOP(total)}</span>
            <span style={{ background: '#2dd36f', color: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {ingresos.length}
            </span>
          </div>
        </div>

        {/* Categorías */}
        <h4 style={{ fontWeight: 700, margin: '16px 0 8px' }}>Categorías</h4>
        <div className="categoria-grid">
          {categorias.map((cat, i) => (
            <button key={i} className="categoria-btn" onClick={() => abrirModal(cat)}>
              <span className="categoria-icon">{cat.icono}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Lista de registros */}
        <h4 style={{ fontWeight: 700, margin: '16px 0 8px' }}>Registros <span style={{ color: '#aaa', fontWeight: 400 }}>{ingresos.length}</span></h4>
        <IonList style={{ background: 'transparent', padding: 0 }}>
          {ingresos.map((g) => (
            <IonItem key={g.id} className="registro-item" lines="none" style={{ '--background': '#fff', '--border-radius': '12px', marginBottom: 8 }}>
              <span slot="start" style={{ fontSize: 28 }}>{g.icono}</span>
              <IonLabel>
                <h3 style={{ fontWeight: 600 }}>{g.cliente} · {g.categoria}</h3>
                <p>
                  <span className={g.estado === 'Confirmado' ? 'badge-pagado' : 'badge-cobrar'}>
                    {g.estado}
                  </span>
                </p>
              </IonLabel>
              <div slot="end" style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, margin: 0 }}>{formatCOP(g.monto)}</p>
                <IonButton
                  fill="clear"
                  size="small"
                  color="danger"
                  onClick={() => { setIngresoAEliminar(g.id); setShowDeleteAlert(true); }}
                >
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </div>
            </IonItem>
          ))}
        </IonList>
      </IonContent>

      {/* Modal agregar ingreso */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} breakpoints={[0, 0.55]} initialBreakpoint={0.55}>
        <IonContent className="ion-padding">
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 48 }}>{categoriaSeleccionada?.icono}</span>
            <h3 style={{ margin: '8px 0', fontWeight: 700 }}>{categoriaSeleccionada?.label}</h3>
          </div>
          <IonItem style={{ '--background': '#f0f0f0', borderRadius: 12, marginBottom: 12 }}>
            <IonLabel position="stacked">Monto (COP)</IonLabel>
            <IonInput
              type="number"
              value={monto}
              placeholder="Ej: 500000"
              onIonInput={(e) => setMonto(String(e.detail.value))}
              style={{ fontSize: 24, fontWeight: 700 }}
            />
          </IonItem>
          <IonItem style={{ '--background': '#f0f0f0', borderRadius: 12, marginBottom: 16 }}>
            <IonLabel position="stacked">Cliente / descripción</IonLabel>
            <IonInput
              type="text"
              value={cliente}
              placeholder="Ej: Oscar Sánchez"
              onIonInput={(e) => setCliente(String(e.detail.value))}
            />
          </IonItem>
          <IonButton expand="block" onClick={guardarIngreso} style={{ '--background': '#1a1a2e', '--color': '#FFE500', fontWeight: 700 }}>
            Registrar ingreso
          </IonButton>
        </IonContent>
      </IonModal>

      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Eliminar ingreso"
        message="¿Estás seguro de que deseas eliminar este registro?"
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Eliminar', role: 'destructive', handler: () => { if (ingresoAEliminar) eliminarIngreso(ingresoAEliminar); } }
        ]}
      />
    </IonPage>
  );
};

export default Ingresos;
