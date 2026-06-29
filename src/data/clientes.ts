// Clasificación simple de cliente (reemplaza el hook async useClientType del original).
// Heurística por nombre: empresa vs persona.
export function esEmpresa(nombre: string): boolean {
  return /\b(s\.?a\.?s?|ltda|inc|corp|company|compañ[ií]a|transportes?|log[ií]stica|grupo|sociedad)\b/i.test(nombre);
}
