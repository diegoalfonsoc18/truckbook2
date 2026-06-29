import React, { useMemo } from 'react';
import { IonIcon } from '@ionic/react';
import { cubeOutline, peopleOutline, flameOutline } from 'ionicons/icons';
import { useData } from '../data/DataContext';
import { formatCompact } from '../data/format';

// Port web de src/Screens/Home/widgets/VehicleCard.tsx (RN).
// Calcula estadísticas del vehículo a partir de los fletes y el gasto de combustible.

// Precio del galón de ACPM (diésel) en COP. En el original lo provee usePrecioDiesel (Gemini);
// aquí es una constante porque la app es local.
const PRECIO_DIESEL_GALON = 10000;

interface Props {
  tipo: string;
  placa: string;
  img: string;
  onPress: () => void;
}

const VehicleCard: React.FC<Props> = ({ tipo, placa, img, onPress }) => {
  const { ingresos, gastos } = useData();

  const stats = useMemo(() => {
    const fletes = ingresos.filter((i) => i.categoria === 'flete');
    const totalViajes = fletes.reduce((sum, i) => sum + (i.cantidad ?? 1), 0);
    const totalIngresos = fletes.reduce((sum, i) => sum + (i.monto ?? 0) * (i.cantidad ?? 1), 0);

    const clientesSet = new Set<string>();
    for (const ing of fletes) {
      if (ing.descripcion) {
        const nombre = ing.descripcion.replace(/\[TEL:[^\]]*\]/g, '').split(' · ')[0]?.trim();
        if (nombre && nombre !== 'Flete') clientesSet.add(nombre);
      }
    }

    // Galones estimados del mes actual: gasto en combustible / precio del galón
    const now = new Date();
    const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const gastoCombustible = gastos
      .filter((g) => g.categoria === 'combustible' && (g.fecha ?? '').startsWith(mesActual))
      .reduce((sum, g) => sum + (g.monto ?? 0), 0);
    const galones = PRECIO_DIESEL_GALON > 0 ? Math.round(gastoCombustible / PRECIO_DIESEL_GALON) : 0;

    return { viajes: totalViajes, clientes: clientesSet.size, ingresos: totalIngresos, galones };
  }, [ingresos, gastos]);

  return (
    <div className="vehiculo-card" onClick={onPress}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: '#999' }}>vehículo activo</p>
          <h1 style={{ margin: '6px 0 8px', fontSize: 30, fontWeight: 800, color: '#1a1a1a' }}>{tipo}</h1>
          <span className="placa-chip" style={{ fontSize: 17, padding: '5px 16px' }}>{placa}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: 14, color: '#777', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
            <IonIcon icon={flameOutline} /> {stats.galones} gal
          </p>
          <img src={img} alt={tipo} style={{ width: 140, height: 'auto', marginTop: 4, display: 'block', marginLeft: 'auto' }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 16 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#666', fontSize: 14 }}>
          <IonIcon icon={cubeOutline} /> {stats.viajes} viajes
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#666', fontSize: 14 }}>
          <IonIcon icon={peopleOutline} /> {stats.clientes} clientes
        </span>
        <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: 15, color: '#1a1a1a' }}>
          Esta semana: {formatCompact(stats.ingresos)}
        </span>
      </div>
    </div>
  );
};

export default VehicleCard;
