import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Gasto, Ingreso } from './types';
import { hoyISO } from './format';

// Placa por defecto al iniciar
export const PLACA_DEFAULT = 'EKA854';
// Alias retrocompatible
export const PLACA_ACTUAL = PLACA_DEFAULT;

// Versionamos las claves para re-sembrar con datos multi-vehículo
const LS_GASTOS = 'tb_gastos_v2';
const LS_INGRESOS = 'tb_ingresos_v2';
const LS_PLACA = 'tb_placa';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ---- Datos de ejemplo por vehículo (solo la primera vez) ----
function seedGastos(): Gasto[] {
  const f = hoyISO();
  const g = (placa: string, categoria: string, descripcion: string, monto: number, estado: 'pendiente' | 'pagado'): Gasto =>
    ({ id: uid(), placa, categoria, descripcion, monto, fecha: f, estado });
  return [
    // EKA854 (Volqueta)
    g('EKA854', 'parqueadero', 'Parqueadero centro', 15000, 'pagado'),
    g('EKA854', 'comida', 'Almuerzo', 20000, 'pagado'),
    g('EKA854', 'peajes', 'Peaje', 21500, 'pagado'),
    g('EKA854', 'combustible', 'Tanqueo', 150000, 'pendiente'),
    // TRK001 (Tractomula)
    g('TRK001', 'combustible', 'Tanqueo ruta', 320000, 'pagado'),
    g('TRK001', 'comida', 'Comida en ruta', 35000, 'pendiente'),
    g('TRK001', 'peajes', 'Peajes ruta', 64000, 'pagado'),
    // CMN332 sin datos (estado vacío)
  ];
}

function seedIngresos(): Ingreso[] {
  const f = hoyISO();
  const i = (placa: string, descripcion: string, monto: number, estado: 'pendiente' | 'confirmado'): Ingreso =>
    ({ id: uid(), placa, categoria: 'flete', descripcion, monto, fecha: f, estado, cantidad: 1 });
  return [
    // EKA854
    i('EKA854', 'Manuel Morales', 450000, 'pendiente'),
    i('EKA854', 'Luis Fernando Puerta', 250000, 'confirmado'),
    i('EKA854', 'Edwin Duarte', 750000, 'pendiente'),
    // TRK001
    i('TRK001', 'Transportes del Valle', 1200000, 'confirmado'),
    i('TRK001', 'Efraín Alvarado', 800000, 'pendiente'),
    // CMN332 sin datos
  ];
}

function load<T>(key: string, seed: () => T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
  } catch {
    /* ignore */
  }
  const data = seed();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

interface DataContextValue {
  placa: string;
  setPlaca: (placa: string) => void;
  gastos: Gasto[];      // filtrados por la placa activa
  ingresos: Ingreso[];  // filtrados por la placa activa
  addGasto: (g: Omit<Gasto, 'id' | 'placa'>) => void;
  addIngreso: (i: Omit<Ingreso, 'id' | 'placa'>) => void;
  deleteGasto: (id: string) => void;
  deleteIngreso: (id: string) => void;
  toggleGasto: (id: string) => void;
  toggleIngreso: (id: string) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allGastos, setAllGastos] = useState<Gasto[]>(() => load(LS_GASTOS, seedGastos));
  const [allIngresos, setAllIngresos] = useState<Ingreso[]>(() => load(LS_INGRESOS, seedIngresos));
  const [placa, setPlacaState] = useState<string>(() => localStorage.getItem(LS_PLACA) || PLACA_DEFAULT);

  useEffect(() => { localStorage.setItem(LS_GASTOS, JSON.stringify(allGastos)); }, [allGastos]);
  useEffect(() => { localStorage.setItem(LS_INGRESOS, JSON.stringify(allIngresos)); }, [allIngresos]);
  useEffect(() => { localStorage.setItem(LS_PLACA, placa); }, [placa]);

  // Datos de la placa activa
  const gastos = useMemo(() => allGastos.filter((g) => g.placa === placa), [allGastos, placa]);
  const ingresos = useMemo(() => allIngresos.filter((i) => i.placa === placa), [allIngresos, placa]);

  const addGasto: DataContextValue['addGasto'] = (g) =>
    setAllGastos((prev) => [{ ...g, id: uid(), placa }, ...prev]);

  const addIngreso: DataContextValue['addIngreso'] = (i) =>
    setAllIngresos((prev) => [{ ...i, id: uid(), placa }, ...prev]);

  const deleteGasto = (id: string) => setAllGastos((prev) => prev.filter((g) => g.id !== id));
  const deleteIngreso = (id: string) => setAllIngresos((prev) => prev.filter((i) => i.id !== id));

  const toggleGasto = (id: string) =>
    setAllGastos((prev) =>
      prev.map((g) => (g.id === id ? { ...g, estado: g.estado === 'pagado' ? 'pendiente' : 'pagado' } : g))
    );

  const toggleIngreso = (id: string) =>
    setAllIngresos((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, estado: i.estado === 'confirmado' ? 'pendiente' : 'confirmado' } : i
      )
    );

  return (
    <DataContext.Provider
      value={{
        placa,
        setPlaca: setPlacaState,
        gastos,
        ingresos,
        addGasto,
        addIngreso,
        deleteGasto,
        deleteIngreso,
        toggleGasto,
        toggleIngreso,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>');
  return ctx;
}
