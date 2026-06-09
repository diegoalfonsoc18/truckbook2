import React from 'react';
import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonIcon, IonLabel, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { homeOutline, walletOutline, cashOutline, statsChartOutline, personCircleOutline } from 'ionicons/icons';

import Home from './pages/Home';
import Gastos from './pages/Gastos';
import Ingresos from './pages/Ingresos';
import Reportes from './pages/Reportes';
import Cuenta from './pages/Cuenta';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
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
            <IonIcon icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="gastos" href="/gastos">
            <IonIcon icon={walletOutline} />
            <IonLabel>Gastos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="ingresos" href="/ingresos">
            <IonIcon icon={cashOutline} />
            <IonLabel>Ingresos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="reportes" href="/reportes">
            <IonIcon icon={statsChartOutline} />
            <IonLabel>Reportes</IonLabel>
          </IonTabButton>
          <IonTabButton tab="cuenta" href="/cuenta">
            <IonIcon icon={personCircleOutline} />
            <IonLabel>Cuenta</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
