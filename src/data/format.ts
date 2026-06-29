// Utilidades de formato y fechas (Colombia)

// "$ 200.000" — pesos colombianos sin decimales
export function formatCurrency(v: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(v);
}

// Versión compacta para tarjetas pequeñas: "$2.1M", "$150K"
export function formatCompact(n: number): string {
  const abs = Math.abs(n);
  const signo = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${signo}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${signo}$${Math.round(abs / 1_000)}K`;
  return `${signo}$${abs}`;
}

// "domingo, 28 de junio"
export function fechaLegible(d: string): string {
  return new Date(d + 'T12:00:00').toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

// Fecha de hoy en formato "YYYY-MM-DD"
export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Días transcurridos desde una fecha "YYYY-MM-DD"
export function diasDesde(fecha: string): number {
  if (!fecha) return 0;
  const d = new Date(fecha + 'T12:00:00').getTime();
  const now = new Date().getTime();
  return Math.max(0, Math.floor((now - d) / 86_400_000));
}

// Inicio de semana (lunes) en "YYYY-MM-DD"
export function inicioSemana(d = new Date()): string {
  const day = (d.getDay() + 6) % 7; // 0 = lunes
  const lunes = new Date(d);
  lunes.setDate(d.getDate() - day);
  return lunes.toISOString().slice(0, 10);
}
