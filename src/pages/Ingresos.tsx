import React from 'react';
import TransactionScreen, { Registro } from '../components/TransactionScreen';
import { INGRESOS_CATEGORIAS } from '../data/categorias';
import { useData } from '../data/DataContext';

const Ingresos: React.FC = () => {
  const { placa, ingresos, addIngreso, deleteIngreso, toggleIngreso } = useData();

  const registros: Registro[] = ingresos.map((i) => ({
    id: i.id,
    categoria: i.categoria,
    descripcion: i.descripcion,
    monto: i.monto,
    fecha: i.fecha,
    cantidad: i.cantidad,
    activo: i.estado === 'confirmado',
  }));

  return (
    <TransactionScreen
      titulo="Ingresos"
      placa={placa}
      categorias={INGRESOS_CATEGORIAS}
      registros={registros}
      accent="var(--tb-income)"
      accentLight="var(--tb-income-light)"
      labelActivo="Confirmado"
      labelInactivo="Por cobrar"
      pedirDescripcion
      onAdd={(r) =>
        addIngreso({
          categoria: r.categoria,
          descripcion: r.descripcion,
          monto: r.monto,
          fecha: r.fecha,
          estado: r.activo ? 'confirmado' : 'pendiente',
          cantidad: 1,
        })
      }
      onDelete={deleteIngreso}
      onToggle={toggleIngreso}
    />
  );
};

export default Ingresos;
