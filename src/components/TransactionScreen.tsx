import React, { useMemo, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonModal,
  IonDatetime, IonAlert,
} from '@ionic/react';
import { Categoria } from '../data/types';
import { buscarCategoria } from '../data/categorias';
import { formatCurrency, fechaLegible, hoyISO } from '../data/format';

// Registro genérico que comparten Gastos e Ingresos
export interface Registro {
  id: string;
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
  cantidad?: number;
  activo: boolean;          // true = pagado/confirmado, false = pendiente
}

interface Props {
  titulo: string;                       // "Gastos" | "Ingresos"
  placa: string;
  categorias: Categoria[];
  registros: Registro[];                // ya filtrados por placa
  accent: string;                       // color de acento (rojo / verde)
  accentLight: string;                  // fondo claro del acento
  labelActivo: string;                  // "Pagado" | "Confirmado"
  labelInactivo: string;                // "Pendiente"
  pedirDescripcion?: boolean;           // mostrar campo descripción (ingresos)
  onAdd: (r: { categoria: string; descripcion: string; monto: number; fecha: string; activo: boolean }) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TransactionScreen: React.FC<Props> = ({
  titulo, placa, categorias, registros, accent, accentLight,
  labelActivo, labelInactivo, pedirDescripcion, onAdd, onDelete, onToggle,
}) => {
  const [selectedDate, setSelectedDate] = useState(hoyISO());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modal de "Agregar"
  const [catSel, setCatSel] = useState<Categoria | null>(null);
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activo, setActivo] = useState(false);

  // Eliminar
  const [aEliminar, setAEliminar] = useState<string | null>(null);

  const delDia = useMemo(
    () => registros.filter((r) => r.fecha === selectedDate),
    [registros, selectedDate]
  );

  const total = useMemo(
    () => delDia.reduce((acc, r) => acc + r.monto * (r.cantidad ?? 1), 0),
    [delDia]
  );

  const abrirModal = (cat: Categoria) => {
    setCatSel(cat);
    setMonto('');
    setDescripcion('');
    setActivo(false);
  };

  const guardar = () => {
    const valor = Number(monto);
    if (!catSel || isNaN(valor) || valor <= 0) return;
    onAdd({
      categoria: catSel.id,
      descripcion: descripcion.trim() || catSel.name,
      monto: valor,
      fecha: selectedDate,
      activo,
    });
    setCatSel(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="tb-header" style={{ padding: '8px 16px' }}>
            <h1 className="tb-title">{titulo}</h1>
            <span className="tb-plate">{placa}</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding tb-screen">
        {/* Selector de fecha */}
        <button className="tb-date-btn" onClick={() => setShowDatePicker(true)}>
          📅 {fechaLegible(selectedDate)} ⌄
        </button>

        {/* Total del día */}
        <div className="tb-summary-card">
          <div>
            <p className="tb-summary-label">Total del día</p>
            <div className="tb-summary-total" style={{ color: accent }}>{formatCurrency(total)}</div>
          </div>
          <div className="tb-count-badge" style={{ background: accentLight, color: accent }}>
            {delDia.length}
          </div>
        </div>

        {/* Grid de categorías */}
        <div className="tb-cat-grid">
          {categorias.map((cat) => (
            <button key={cat.id} className="tb-cat-item" onClick={() => abrirModal(cat)}>
              <span className="tb-cat-icon" style={{ background: cat.color + '22' }}>
                <img src={cat.icon} alt={cat.name} />
              </span>
              <span className="tb-cat-label">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Lista de registros */}
        <div className="tb-list-header">
          <h2 className="tb-list-title">Registros</h2>
          <span className="tb-list-badge">{delDia.length}</span>
        </div>

        {delDia.length === 0 && (
          <p className="tb-empty">Sin registros este día. Toca una categoría para agregar.</p>
        )}

        {delDia.map((r) => {
          const cat = buscarCategoria(categorias, r.categoria);
          const color = r.activo ? 'var(--tb-income)' : 'var(--tb-expense)';
          return (
            <div key={r.id} className="tb-row">
              <span className="tb-row-icon" style={{ background: cat.color + '22' }}>
                <img src={cat.icon} alt={cat.name} />
              </span>
              <div className="tb-row-info">
                <p className="tb-row-name">{r.descripcion}</p>
                <button className="tb-status" style={{ background: color + '1A' }} onClick={() => onToggle(r.id)}>
                  <span className="tb-status-dot" style={{ background: color }} />
                  <span style={{ color }}>{r.activo ? labelActivo : labelInactivo}</span>
                </button>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="tb-row-amount">{formatCurrency(r.monto * (r.cantidad ?? 1))}</div>
              </div>
              <button className="tb-row-del" onClick={() => setAEliminar(r.id)} aria-label="Eliminar">🗑️</button>
            </div>
          );
        })}
      </IonContent>

      {/* Date picker */}
      <IonModal className="tb-date-modal" isOpen={showDatePicker} onDidDismiss={() => setShowDatePicker(false)}
        breakpoints={[0, 0.6]} initialBreakpoint={0.6}>
        <IonContent>
          <div className="tb-date-modal-body">
            <IonDatetime
              presentation="date"
              value={selectedDate}
              onIonChange={(e) => {
                const v = e.detail.value;
                if (typeof v === 'string') setSelectedDate(v.slice(0, 10));
                setShowDatePicker(false);
              }}
            />
          </div>
        </IonContent>
      </IonModal>

      {/* Bottom sheet: agregar */}
      <IonModal isOpen={!!catSel} onDidDismiss={() => setCatSel(null)}
        breakpoints={[0, pedirDescripcion ? 0.6 : 0.5]} initialBreakpoint={pedirDescripcion ? 0.6 : 0.5}>
        <IonContent>
          <div className="tb-sheet">
            <div className="tb-sheet-handle" />
            <div className="tb-sheet-head">
              <div className="tb-sheet-icon" style={{ background: (catSel?.color ?? accent) + '22' }}>
                {catSel && <img src={catSel.icon} alt={catSel.name} />}
              </div>
              <h3 className="tb-sheet-title">{catSel?.name}</h3>
            </div>

            <div className="tb-field">
              <label className="tb-field-label">Monto (COP)</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                autoFocus
              />
            </div>

            {pedirDescripcion && (
              <div className="tb-field">
                <label className="tb-field-label">Cliente / descripción</label>
                <input
                  type="text"
                  className="tb-input-text"
                  placeholder="Ej: Oscar Sánchez"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
            )}

            <div className="tb-toggle">
              <button
                className={!activo ? 'active' : ''}
                style={!activo ? { background: 'var(--tb-expense)' } : undefined}
                onClick={() => setActivo(false)}
              >
                {labelInactivo}
              </button>
              <button
                className={activo ? 'active' : ''}
                style={activo ? { background: 'var(--tb-income)' } : undefined}
                onClick={() => setActivo(true)}
              >
                {labelActivo}
              </button>
            </div>

            <button className="tb-save-btn" style={{ background: accent }} onClick={guardar}>
              Guardar
            </button>
          </div>
        </IonContent>
      </IonModal>

      {/* Confirmar eliminar */}
      <IonAlert
        isOpen={!!aEliminar}
        onDidDismiss={() => setAEliminar(null)}
        header="Eliminar registro"
        message="¿Seguro que deseas eliminar este registro?"
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Eliminar', role: 'destructive', handler: () => { if (aEliminar) onDelete(aEliminar); } },
        ]}
      />
    </IonPage>
  );
};

export default TransactionScreen;
