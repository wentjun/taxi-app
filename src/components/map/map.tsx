import mapboxgl from 'mapbox-gl';
import React, { CSSProperties } from 'react';

interface Props {

}

interface State {
  lat: number;
  lng: number;
  zoom: number;
}

mapboxgl.accessToken = 'pk.eyJ1Ijoid2VudGp1biIsImEiOiJjandmODc5cngwcDJjNDNwYjhtOXZqejVtIn0.1l6XNJgy4pkY7TWEV58pVQ';

class Map extends React.Component<Props, State> {
  private mapContainer: any;
  private map: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      lat: 51.5049375,
      lng: -0.0964509,
      zoom: 15
    };
  }

  public componentDidMount() {
    const { lng, lat, zoom } = this.state;
    this.map = new mapboxgl.Map({
      center: [lng, lat],
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom
    });

    this.map.on('move', () => {
      const { lat, lng } = this.map.getCenter();
      this.setState({
        lat: Number(lat.toFixed(4)),
        lng: Number(lng.toFixed(4)),
        zoom: Number(this.map.getZoom().toFixed(2))
      });
    });
  }

  public componentWillUnmount() {
    this.map.remove();
  }

  public render() {
    const style: CSSProperties = {
      bottom: 0,
      position: 'absolute',
      top: 0,
      width: '100%'
    };
    return(
      <div>
        <div ref={el => this.mapContainer = el} style={style} />
      </div>
    );
  }
}

export default Map;
