import React from 'react';
import TransactionScreen, { Registro } from '../components/TransactionScreen';
import { GASTOS_CATEGORIAS } from '../data/categorias';
import { useData } from '../data/DataContext';

const Gastos: React.FC = () => {
  const { placa, gastos, addGasto, deleteGasto, toggleGasto } = useData();

  const registros: Registro[] = gastos.map((g) => ({
    id: g.id,
    categoria: g.categoria,
    descripcion: g.descripcion,
    monto: g.monto,
    fecha: g.fecha,
    activo: g.estado === 'pagado',
  }));

  return (
    <TransactionScreen
      titulo="Gastos"
      placa={placa}
      categorias={GASTOS_CATEGORIAS}
      registros={registros}
      accent="var(--tb-expense)"
      accentLight="var(--tb-expense-light)"
      labelActivo="Pagado"
      labelInactivo="Pendiente"
      onAdd={(r) =>
        addGasto({
          categoria: r.categoria,
          descripcion: r.descripcion,
          monto: r.monto,
          fecha: r.fecha,
          estado: r.activo ? 'pagado' : 'pendiente',
        })
      }
      onDelete={deleteGasto}
      onToggle={toggleGasto}
    />
  );
};

export default Gastos;
