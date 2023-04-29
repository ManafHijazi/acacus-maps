import React, { Suspense, useState } from 'react';
import { AppRoutes } from './Routes';
import { SwitchRouteComponent } from './Components';
import { ThemeContext } from './Contexts/theme-context';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalToasterGenerator, MiddlewareHelper, SetGlobalRerender } from './Helpers';

const App = () => {
  const [theme, setTheme] = useState('light');
  const [render, setRender] = useState(false);

  SetGlobalRerender(setRender, render);

  return (
    <Router>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <div className={`theme-${theme}`}>
          <Suspense fallback='...'>
            <GlobalToasterGenerator />
            <MiddlewareHelper />
          </Suspense>
          <SwitchRouteComponent routes={AppRoutes} />
        </div>
      </ThemeContext.Provider>
    </Router>
  );
};

export default App;
