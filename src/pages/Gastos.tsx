import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonModal, IonButton, IonInput, IonItem, IonLabel,
  IonList, IonIcon, IonAlert
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';

interface Gasto {
  id: number;
  categoria: string;
  icono: string;
  monto: number;
  fecha: string;
  estado: 'Pendiente' | 'Pagado';
}

const categorias = [
  { label: 'Combustible', icono: '⛽' },
  { label: 'Peajes', icono: '🛣️' },
  { label: 'Comida', icono: '🍔' },
  { label: 'Hospedaje', icono: '🏨' },
  { label: 'Taller', icono: '🔧' },
  { label: 'Parqueo', icono: '🅿️' },
  { label: 'Otros', icono: '💸' },
];

const today = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

const Gastos: React.FC = () => {
  const [gastos, setGastos] = useState<Gasto[]>([
    { id: 1, categoria: 'Parqueo', icono: '🅿️', monto: 15000, fecha: today, estado: 'Pagado' },
    { id: 2, categoria: 'Comida', icono: '🍔', monto: 20000, fecha: today, estado: 'Pagado' },
    { id: 3, categoria: 'Peajes', icono: '🛣️', monto: 21500, fecha: today, estado: 'Pagado' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<{ label: string; icono: string } | null>(null);
  const [monto, setMonto] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [gastoAEliminar, setGastoAEliminar] = useState<number | null>(null);

  const total = gastos.reduce((acc, g) => acc + g.monto, 0);

  const abrirModal = (cat: { label: string; icono: string }) => {
    setCategoriaSeleccionada(cat);
    setMonto('');
    setShowModal(true);
  };

  const guardarGasto = () => {
    if (!monto || isNaN(Number(monto)) || !categoriaSeleccionada) return;
    const nuevo: Gasto = {
      id: Date.now(),
      categoria: categoriaSeleccionada.label,
      icono: categoriaSeleccionada.icono,
      monto: Number(monto),
      fecha: today,
      estado: 'Pendiente',
    };
    setGastos([...gastos, nuevo]);
    setShowModal(false);
  };

  const eliminarGasto = (id: number) => {
    setGastos(gastos.filter(g => g.id !== id));
  };

  const formatCOP = (n: number) =>
    '$ ' + n.toLocaleString('es-CO');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Gastos</span>
              <span className="placa-chip">EKA854</span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Fecha */}
        <p style={{ color: '#888', fontSize: 13, margin: '0 0 8px' }}>📅 {today}</p>

        {/* Total del día */}
        <div className="total-card">
          <p className="total-label">Total del día</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="total-amount" style={{ color: '#eb445a' }}>{formatCOP(total)}</span>
            <span style={{ background: '#eb445a', color: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {gastos.length}
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
        <h4 style={{ fontWeight: 700, margin: '16px 0 8px' }}>Registros <span style={{ color: '#aaa', fontWeight: 400 }}>{gastos.length}</span></h4>
        <IonList style={{ background: 'transparent', padding: 0 }}>
          {gastos.map((g) => (
            <IonItem key={g.id} className="registro-item" lines="none" style={{ '--background': '#fff', '--border-radius': '12px', marginBottom: 8 }}>
              <span slot="start" style={{ fontSize: 28 }}>{g.icono}</span>
              <IonLabel>
                <h3 style={{ fontWeight: 600 }}>{g.categoria}</h3>
                <p>
                  <span className={g.estado === 'Pagado' ? 'badge-pagado' : 'badge-pendiente'}>
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
                  onClick={() => { setGastoAEliminar(g.id); setShowDeleteAlert(true); }}
                >
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </div>
            </IonItem>
          ))}
        </IonList>
      </IonContent>

      {/* Modal agregar gasto */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} breakpoints={[0, 0.45]} initialBreakpoint={0.45}>
        <IonContent className="ion-padding">
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 48 }}>{categoriaSeleccionada?.icono}</span>
            <h3 style={{ margin: '8px 0', fontWeight: 700 }}>{categoriaSeleccionada?.label}</h3>
          </div>
          <IonItem style={{ '--background': '#f0f0f0', borderRadius: 12, marginBottom: 16 }}>
            <IonLabel position="stacked">Monto (COP)</IonLabel>
            <IonInput
              type="number"
              value={monto}
              placeholder="Ej: 50000"
              onIonInput={(e) => setMonto(String(e.detail.value))}
              style={{ fontSize: 24, fontWeight: 700 }}
            />
          </IonItem>
          <IonButton expand="block" onClick={guardarGasto} style={{ '--background': '#1a1a2e', '--color': '#FFE500', fontWeight: 700 }}>
            Guardar gasto
          </IonButton>
        </IonContent>
      </IonModal>

      {/* Alert eliminar */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Eliminar gasto"
        message="¿Estás seguro de que deseas eliminar este registro?"
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Eliminar', role: 'destructive', handler: () => { if (gastoAEliminar) eliminarGasto(gastoAEliminar); } }
        ]}
      />
    </IonPage>
  );
};

export default Gastos;
