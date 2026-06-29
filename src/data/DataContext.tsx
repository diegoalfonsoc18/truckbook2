import React, { createContext, useContext, useEffect, useState } from 'react';
import { Gasto, Ingreso } from './types';
import { hoyISO } from './format';

// Placa fija para la demo
export const PLACA_ACTUAL = 'EKA854';

const LS_GASTOS = 'tb_gastos';
const LS_INGRESOS = 'tb_ingresos';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ---- Datos de ejemplo (solo la primera vez) ----
function seedGastos(): Gasto[] {
  const f = hoyISO();
  return [
    { id: uid(), placa: PLACA_ACTUAL, categoria: 'parqueadero', descripcion: 'Parqueadero centro', monto: 15000, fecha: f, estado: 'pagado' },
    { id: uid(), placa: PLACA_ACTUAL, categoria: 'comida', descripcion: 'Almuerzo', monto: 20000, fecha: f, estado: 'pagado' },
    { id: uid(), placa: PLACA_ACTUAL, categoria: 'peajes', descripcion: 'Peaje', monto: 21500, fecha: f, estado: 'pagado' },
    { id: uid(), placa: PLACA_ACTUAL, categoria: 'combustible', descripcion: 'Tanqueo', monto: 150000, fecha: f, estado: 'pendiente' },
  ];
}

function seedIngresos(): Ingreso[] {
  const f = hoyISO();
  return [
    { id: uid(), placa: PLACA_ACTUAL, categoria: 'flete', descripcion: 'Manuel Morales', monto: 450000, fecha: f, estado: 'pendiente', cantidad: 1 },
    { id: uid(), placa: PLACA_ACTUAL, categoria: 'flete', descripcion: 'Luis Fernando Puerta', monto: 250000, fecha: f, estado: 'confirmado', cantidad: 1 },
    { id: uid(), placa: PLACA_ACTUAL, categoria: 'flete', descripcion: 'Edwin Duarte', monto: 750000, fecha: f, estado: 'pendiente', cantidad: 1 },
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
  gastos: Gasto[];
  ingresos: Ingreso[];
  addGasto: (g: Omit<Gasto, 'id' | 'placa'>) => void;
  addIngreso: (i: Omit<Ingreso, 'id' | 'placa'>) => void;
  deleteGasto: (id: string) => void;
  deleteIngreso: (id: string) => void;
  toggleGasto: (id: string) => void;
  toggleIngreso: (id: string) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gastos, setGastos] = useState<Gasto[]>(() => load(LS_GASTOS, seedGastos));
  const [ingresos, setIngresos] = useState<Ingreso[]>(() => load(LS_INGRESOS, seedIngresos));

  useEffect(() => {
    localStorage.setItem(LS_GASTOS, JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem(LS_INGRESOS, JSON.stringify(ingresos));
  }, [ingresos]);

  const addGasto: DataContextValue['addGasto'] = (g) =>
    setGastos((prev) => [{ ...g, id: uid(), placa: PLACA_ACTUAL }, ...prev]);

  const addIngreso: DataContextValue['addIngreso'] = (i) =>
    setIngresos((prev) => [{ ...i, id: uid(), placa: PLACA_ACTUAL }, ...prev]);

  const deleteGasto = (id: string) => setGastos((prev) => prev.filter((g) => g.id !== id));
  const deleteIngreso = (id: string) => setIngresos((prev) => prev.filter((i) => i.id !== id));

  const toggleGasto = (id: string) =>
    setGastos((prev) =>
      prev.map((g) => (g.id === id ? { ...g, estado: g.estado === 'pagado' ? 'pendiente' : 'pagado' } : g))
    );

  const toggleIngreso = (id: string) =>
    setIngresos((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, estado: i.estado === 'confirmado' ? 'pendiente' : 'confirmado' } : i
      )
    );

  return (
    <DataContext.Provider
      value={{
        placa: PLACA_ACTUAL,
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
