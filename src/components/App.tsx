import React, { CSSProperties } from 'react';

import Control from './control/control-container';
import Map from './map/map-container';

export interface AppProps {
  loading?: boolean;
}

class App extends React.Component<AppProps, {}> {
  render() {
    const style: CSSProperties = {
      display: 'flex',
      flexFlow: 'row wrap'
    };
    return (
      <div style={style}>
        <Control />
        <Map />
      </div>
    );
  }
}

export default App;
