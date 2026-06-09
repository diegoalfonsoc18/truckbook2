# TruckBook 2 – Entrega 2

Aplicación móvil para gestión financiera de conductores de carga en Colombia.

**Desarrollado con:** Ionic + React + TypeScript

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en navegador
npm start

# Build para producción
npm run build
```

## Funcionalidades implementadas

- ✅ Navegación por tabs (Home, Gastos, Ingresos, Reportes, Cuenta)
- ✅ Home: vehículo activo, modal cambio de vehículo, estado del vehículo
- ✅ Gastos: registro por categoría, total del día, eliminar registros
- ✅ Ingresos: registro por categoría, total del día, eliminar registros
- ✅ Reportes: gráfica comparativa, balance neto, filtros por período
- ✅ Cuenta: perfil del conductor, configuración

## Estructura del proyecto

```
src/
  pages/
    Home.tsx       - Panel del vehículo
    Gastos.tsx     - Control de egresos
    Ingresos.tsx   - Control de entradas
    Reportes.tsx   - Análisis financiero
    Cuenta.tsx     - Perfil y configuración
  theme/
    variables.css  - Variables de color TruckBook
  App.tsx          - Navegación principal
  index.tsx        - Punto de entrada
```

## Repositorio

GitHub: https://github.com/diegoalfonsoc18/truckbook2

## Autor

Diego Leonel Alfonso Castillo  
Politécnico Grancolombiano – Programación Móvil – 2026
