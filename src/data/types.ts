// Modelo de datos (versión universidad — todo local, sin backend)

export interface Gasto {
  id: string;
  placa: string;
  categoria: string;        // id de la categoría: "combustible", "peajes"...
  descripcion: string;
  monto: number;
  fecha: string;            // "YYYY-MM-DD"
  estado: 'pendiente' | 'pagado';
}

export interface Ingreso {
  id: string;
  placa: string;
  categoria: string;        // id de la categoría: "flete", "anticipo"...
  descripcion: string;
  monto: number;
  fecha: string;            // "YYYY-MM-DD"
  estado: 'pendiente' | 'confirmado';
  cantidad: number;         // fletes múltiples (x2, x3). Default 1
}

export interface Categoria {
  id: string;
  name: string;
  color: string;
  icon: string;             // src de la imagen .webp
}
