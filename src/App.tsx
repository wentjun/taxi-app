import { Provider } from 'react-redux';
import React, { CSSProperties } from 'react';

import logo from './logo.svg';
import Control from './components/control/control';
import Map from './components/map/map';
import store from './redux/store'
import './App.css';

const App: React.FC = () => {
  const style: CSSProperties = {
    display: 'flex',
    flexFlow: 'row wrap'
    // width: '100vw'
  };
  return (
    <Provider store={store}>
      <div style={style}>
        <Control />
        <Map />
      </div>
    </Provider>
  );
}

export default App;
