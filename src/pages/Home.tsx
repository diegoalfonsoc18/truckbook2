import React, { useMemo, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { carOutline, checkmarkCircle } from "ionicons/icons";
import volquetaImg from "../assets/icon/volquetaFlete.webp";
import estacaImg from "../assets/icon/estacaFlete.webp";
import fuelIcon from "../assets/icon/fuel.webp";
import truckIcon from "../assets/icon/freight.webp";
import tollIcon from "../assets/icon/toll.webp";
import { useData } from "../data/DataContext";
import { inicioSemana, formatCompact } from "../data/format";
import VehicleCard from "../components/VehicleCard";
import WidgetClientes from "../components/WidgetClientes";
import WidgetResumen from "../components/WidgetResumen";
import WidgetInsightIA from "../components/WidgetInsightIA";

interface Vehiculo {
  placa: string;
  tipo: string;
  estado: string;
  img: string;
}

const vehiculos: Vehiculo[] = [
  { placa: "EKA854", tipo: "Volqueta", estado: "Activo", img: volquetaImg },
  { placa: "TRK001", tipo: "Tractomula", estado: "Activo", img: estacaImg },
  { placa: "CMN332", tipo: "Camión", estado: "Inactivo", img: estacaImg },
];

const Home: React.FC = () => {
  const { gastos, ingresos } = useData();
  const [vehiculoActivo, setVehiculoActivo] = useState<Vehiculo>(vehiculos[0]);
  const [showModal, setShowModal] = useState(false);

  // ===== Cálculos de la semana =====
  const lunes = inicioSemana();
  const enSemana = (f: string) => f >= lunes;

  const ingSemana = useMemo(
    () => ingresos.filter((i) => enSemana(i.fecha)),
    [ingresos, lunes],
  );
  const gasSemana = useMemo(
    () => gastos.filter((g) => enSemana(g.fecha)),
    [gastos, lunes],
  );

  // Viajes (fletes) y combustible de la semana
  const viajesSemana = ingSemana.filter((i) => i.categoria === "flete").length;
  const combustibleSemana = gasSemana
    .filter((g) => g.categoria === "combustible")
    .reduce((a, g) => a + g.monto, 0);
  const peajesSemana = gasSemana
    .filter((g) => g.categoria === "peajes")
    .reduce((a, g) => a + g.monto, 0);

  const actividad = [
    {
      icon: fuelIcon,
      label: "Combustible",
      valor: formatCompact(combustibleSemana),
      nota: "Esta semana",
    },
    {
      icon: truckIcon,
      label: "Viajes",
      valor: `${viajesSemana} ${viajesSemana === 1 ? "viaje" : "viajes"}`,
      nota: "Esta semana",
    },
    {
      icon: tollIcon,
      label: "Peajes",
      valor: formatCompact(peajesSemana),
      nota: peajesSemana ? "Esta semana" : "Sin peajes",
    },
  ];

  return (
    <IonPage>
      <IonContent
        className="ion-padding tb-screen"
        style={{ '--padding-top': 'calc(var(--ion-safe-area-top, 0px) + 16px)' } as React.CSSProperties}
      >
        {/* ===== Vehículo activo ===== */}
        <VehicleCard
          tipo={vehiculoActivo.tipo}
          placa={vehiculoActivo.placa}
          img={vehiculoActivo.img}
          onPress={() => setShowModal(true)}
        />

        {/* ===== Resumen + Por cobrar ===== */}
        <div className="home-duo">
          <WidgetResumen />
          <WidgetInsightIA />
        </div>

        {/* ===== Actividad semanal ===== */}
        <h2
          style={{
            margin: "22px 0 12px",
            fontSize: 26,
            fontWeight: 800,
            color: "#1a1a1a",
          }}
        >
          Actividad semanal
        </h2>
        <div className="actividad-scroll">
          {actividad.map((a, i) => (
            <div key={i} className="actividad-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img
                  src={a.icon}
                  alt={a.label}
                  style={{ width: 28, height: 28, objectFit: "contain" }}
                />
                <span style={{ fontSize: 18, fontWeight: 700 }}>{a.label}</span>
              </div>
              <p
                style={{
                  margin: "12px 0 6px",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#1a1a1a",
                }}
              >
                {a.valor}
              </p>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #eee",
                  margin: "12px 0 8px",
                }}
              />
              <p style={{ margin: 0, fontSize: 13, color: "#999" }}>{a.nota}</p>
            </div>
          ))}
        </div>

        {/* ===== Top Clientes ===== */}
        <WidgetClientes />

        {/* ===== Modal cambio de vehículo ===== */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          breakpoints={[0, 0.5]}
          initialBreakpoint={0.5}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Seleccionar vehículo</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {vehiculos.map((v, i) => (
                <IonItem
                  key={i}
                  button
                  onClick={() => {
                    setVehiculoActivo(v);
                    setShowModal(false);
                  }}
                >
                  <IonIcon icon={carOutline} slot="start" />
                  <IonLabel>
                    <h3>{v.tipo}</h3>
                    <p>
                      <span className="placa-chip">{v.placa}</span>
                    </p>
                  </IonLabel>
                  {vehiculoActivo.placa === v.placa && (
                    <IonIcon
                      icon={checkmarkCircle}
                      slot="end"
                      color="success"
                    />
                  )}
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
