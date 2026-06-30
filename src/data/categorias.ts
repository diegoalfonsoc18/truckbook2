import { Categoria } from './types';

// Iconos (imágenes .webp añadidas al proyecto)
import fuel from '../assets/icon/fuel.webp';
import toll from '../assets/icon/toll.webp';
import food from '../assets/icon/food.webp';
import hotel from '../assets/icon/hotel.webp';
import mechanic from '../assets/icon/mechanic.webp';
import parking from '../assets/icon/parking.webp';
import otros from '../assets/icon/otros.webp';
import freight from '../assets/icon/freight.webp';
import box from '../assets/icon/mercancia/box.webp';
import advance from '../assets/icon/advance.webp';
import refund from '../assets/icon/refund.webp';
import factura from '../assets/icon/factura.webp';

export const GASTOS_CATEGORIAS: Categoria[] = [
  { id: 'combustible',   name: 'Combustible', color: '#FFB800', icon: fuel },
  { id: 'peajes',        name: 'Peajes',      color: '#00D9A5', icon: toll },
  { id: 'comida',        name: 'Comida',      color: '#FF6B6B', icon: food },
  { id: 'hospedaje',     name: 'Hospedaje',   color: '#6C5CE7', icon: hotel },
  { id: 'mantenimiento', name: 'Taller',      color: '#74B9FF', icon: mechanic },
  { id: 'parqueadero',   name: 'Parqueo',     color: '#FD79A8', icon: parking },
  { id: 'otros',         name: 'Otros',       color: '#636E72', icon: otros },
];

export const INGRESOS_CATEGORIAS: Categoria[] = [
  { id: 'flete',        name: 'Flete',     color: '#00D9A5', icon: freight },
  { id: 'mercancia',    name: 'Mercancía', color: '#FFA500', icon: box },
  { id: 'anticipo',     name: 'Anticipo',  color: '#74B9FF', icon: advance },
  { id: 'reembolso',    name: 'Reembolso', color: '#FD79A8', icon: refund },
  { id: 'otro',         name: 'Otro',      color: '#6C5CE7', icon: otros },
  { id: 'cuenta_cobro', name: 'Cobro',     color: '#E17055', icon: factura },
];

export function buscarCategoria(lista: Categoria[], id: string): Categoria {
  return lista.find((c) => c.id === id) ?? { id, name: id, color: '#636E72', icon: otros };
}
