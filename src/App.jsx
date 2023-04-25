import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { AppRoutes } from './Routes';
import { SwitchRouteComponent } from './Components';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalToasterGenerator, MiddlewareHelper, SetGlobalRerender } from './Helpers';

const App = () => {
  const [render, setRender] = useState(false);

  SetGlobalRerender(setRender, render);

  useEffect(() => {
    let endpointReducer = '';

    localStorage.setItem('endPoint', endpointReducer);

    axios.defaults.baseURL = endpointReducer;

    if (localStorage.getItem('access_token')) {
      const access_token = localStorage.getItem('access_token');

      let localEndPoint = endpointReducer;

      if (endpointReducer.includes('https'))
        localEndPoint = endpointReducer.replace('https', 'wss');
      else localEndPoint = endpointReducer.replace('http', 'wss');

      const wsLink = `${localEndPoint}api/v1/products/ws?access_token=${access_token}`;

      // SetGlobalSocketReducer(new WebSocket(wsLink));
    }
  }, []);

  return (
    <Router>
      <Suspense fallback='...'>
        <GlobalToasterGenerator />
        <MiddlewareHelper />
      </Suspense>
      <SwitchRouteComponent routes={AppRoutes} />
    </Router>
  );
};

export default App;
