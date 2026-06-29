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
import {
  cubeOutline,
  peopleOutline,
  timeOutline,
  personCircleOutline,
  carOutline,
  checkmarkCircle,
  arrowUp,
  arrowDown,
} from "ionicons/icons";
import volquetaImg from "../assets/icon/volquetaFlete.webp";
import estacaImg from "../assets/icon/estacaFlete.webp";
import fuelIcon from "../assets/icon/fuel.webp";
import truckIcon from "../assets/icon/freight.webp";
import tollIcon from "../assets/icon/toll.webp";
import { useData } from "../data/DataContext";
import { inicioSemana, formatCompact } from "../data/format";

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

  const totalIngSemana = ingSemana.reduce(
    (a, i) => a + i.monto * (i.cantidad ?? 1),
    0,
  );
  const totalGasSemana = gasSemana.reduce((a, g) => a + g.monto, 0);
  const balanceSemana = totalIngSemana - totalGasSemana;
  const balPositivo = balanceSemana >= 0;

  // Viajes (fletes) y combustible de la semana
  const viajesSemana = ingSemana.filter((i) => i.categoria === "flete").length;
  const combustibleSemana = gasSemana
    .filter((g) => g.categoria === "combustible")
    .reduce((a, g) => a + g.monto, 0);
  const peajesSemana = gasSemana
    .filter((g) => g.categoria === "peajes")
    .reduce((a, g) => a + g.monto, 0);

  // Por cobrar = ingresos pendientes
  const porCobrar = useMemo(
    () => ingresos.filter((i) => i.estado === "pendiente"),
    [ingresos],
  );
  const totalPorCobrar = porCobrar.reduce(
    (a, i) => a + i.monto * (i.cantidad ?? 1),
    0,
  );

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
      <IonContent className="ion-padding tb-screen">
        {/* ===== Vehículo activo ===== */}
        <div className="vehiculo-card" onClick={() => setShowModal(true)}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 13, color: "#999" }}>
                vehículo activo
              </p>
              <h1
                style={{
                  margin: "6px 0 8px",
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#1a1a1a",
                }}
              >
                {vehiculoActivo.tipo}
              </h1>
              <span
                className="placa-chip"
                style={{ fontSize: 17, padding: "5px 16px" }}
              >
                {vehiculoActivo.placa}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 14, color: "#777" }}>
                ⛽ 118 gal
              </p>
              <img
                src={vehiculoActivo.img}
                alt={vehiculoActivo.tipo}
                style={{
                  width: 140,
                  height: "auto",
                  marginTop: 4,
                  display: "block",
                  marginLeft: "auto",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 16,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#666",
                fontSize: 14,
              }}
            >
              <IonIcon icon={cubeOutline} /> {viajesSemana} viajes
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#666",
                fontSize: 14,
              }}
            >
              <IonIcon icon={peopleOutline} /> {porCobrar.length} clientes
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontWeight: 800,
                fontSize: 15,
                color: "#1a1a1a",
              }}
            >
              Esta semana: {formatCompact(totalIngSemana)}
            </span>
          </div>
        </div>

        {/* ===== Balance semana + Por cobrar ===== */}
        <div className="home-duo">
          {/* Balance de la semana */}
          <div
            className="gauge-card"
            style={{ background: balPositivo ? "#e9f6ee" : "#fdecec" }}
          >
            <p style={{ margin: "4px 0", fontSize: 13, color: "#6b6b6b" }}>
              Balance de la semana
            </p>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: balPositivo ? "#16A34A" : "#EF4444",
              }}
            >
              {balPositivo ? "+" : ""}
              {formatCompact(balanceSemana)}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 14,
                fontSize: 13,
              }}
            >
              <span style={{ color: "#16A34A", fontWeight: 600 }}>
                <IonIcon icon={arrowUp} style={{ verticalAlign: "-2px" }} />{" "}
                {formatCompact(totalIngSemana)}
              </span>
              <span style={{ color: "#EF4444", fontWeight: 600 }}>
                <IonIcon icon={arrowDown} style={{ verticalAlign: "-2px" }} />{" "}
                {formatCompact(totalGasSemana)}
              </span>
            </div>
          </div>

          {/* Por cobrar */}
          <div className="cobrar-card">
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 700,
                color: "#8a2a2a",
              }}
            >
              Por cobrar
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                margin: "8px 0 12px",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#f7c9c9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IonIcon
                  icon={timeOutline}
                  style={{ fontSize: 22, color: "#c0392b" }}
                />
              </div>
              <span style={{ fontSize: 26, fontWeight: 800, color: "#e23b3b" }}>
                {formatCompact(totalPorCobrar)}
              </span>
            </div>
            {porCobrar.slice(0, 3).map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <IonIcon
                  icon={personCircleOutline}
                  style={{ fontSize: 20, color: "#c98a8a" }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "#3a3a3a",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.descripcion}
                </span>
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}
                >
                  {formatCompact(c.monto)}
                </span>
              </div>
            ))}
            {porCobrar.length === 0 && (
              <p style={{ margin: 0, fontSize: 12, color: "#b06a3a" }}>
                Todo cobrado 🎉
              </p>
            )}
            {porCobrar.length > 3 && (
              <p
                style={{
                  margin: "4px 0 0",
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#b06a3a",
                }}
              >
                +{porCobrar.length - 3} más
              </p>
            )}
          </div>
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

        {/* ===== Resumen total ===== */}
        <div className="top-clientes-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <IonIcon icon={peopleOutline} style={{ fontSize: 20 }} />
            <span style={{ fontSize: 19, fontWeight: 700 }}>Resumen total</span>
          </div>
          <div className="top-cliente-row" style={{ borderTop: "none" }}>
            <span style={{ color: "#bbb" }}>Ingresos totales</span>
            <span />
            <span />
            <span
              style={{
                minWidth: 70,
                textAlign: "right",
                fontSize: 17,
                fontWeight: 800,
                color: "#2dd36f",
              }}
            >
              {formatCompact(
                ingresos.reduce((a, i) => a + i.monto * (i.cantidad ?? 1), 0),
              )}
            </span>
          </div>
          <div className="top-cliente-row">
            <span style={{ color: "#bbb" }}>Gastos totales</span>
            <span />
            <span />
            <span
              style={{
                minWidth: 70,
                textAlign: "right",
                fontSize: 17,
                fontWeight: 800,
                color: "#eb445a",
              }}
            >
              {formatCompact(gastos.reduce((a, g) => a + g.monto, 0))}
            </span>
          </div>
        </div>

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
