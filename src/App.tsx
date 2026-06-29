import React from 'react';
import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonLabel, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

import Home from './pages/Home';
import Gastos from './pages/Gastos';
import Ingresos from './pages/Ingresos';
import Reportes from './pages/Reportes';
import Cuenta from './pages/Cuenta';
import { DataProvider } from './data/DataContext';
import {
  HomeOutline, HomeFill,
  GastosOutline, GastosFill,
  IngresosOutline, IngresosFill,
  ReportesOutline, ReportesFill,
  CuentaOutline, CuentaFill,
} from './components/TabIcons';

setupIonicReact();

// Renderiza outline + fill; el CSS muestra el fill cuando la pestaña está activa
const TabIcon: React.FC<{ Outline: React.FC<{ className?: string }>; Fill: React.FC<{ className?: string }> }> = ({ Outline, Fill }) => (
  <span className="tab-ico">
    <Outline className="ico-outline" />
    <Fill className="ico-fill" />
  </span>
);

const App: React.FC = () => (
  <IonApp>
    <DataProvider>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home" component={Home} />
          <Route exact path="/gastos" component={Gastos} />
          <Route exact path="/ingresos" component={Ingresos} />
          <Route exact path="/reportes" component={Reportes} />
          <Route exact path="/cuenta" component={Cuenta} />
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <TabIcon Outline={HomeOutline} Fill={HomeFill} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="gastos" href="/gastos">
            <TabIcon Outline={GastosOutline} Fill={GastosFill} />
            <IonLabel>Gastos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="ingresos" href="/ingresos">
            <TabIcon Outline={IngresosOutline} Fill={IngresosFill} />
            <IonLabel>Ingresos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="reportes" href="/reportes">
            <TabIcon Outline={ReportesOutline} Fill={ReportesFill} />
            <IonLabel>Reportes</IonLabel>
          </IonTabButton>
          <IonTabButton tab="cuenta" href="/cuenta">
            <TabIcon Outline={CuentaOutline} Fill={CuentaFill} />
            <IonLabel>Cuenta</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
    </DataProvider>
  </IonApp>
);

export default App;
