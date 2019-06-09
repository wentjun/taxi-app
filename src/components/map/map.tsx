import React, { CSSProperties } from 'react';
import mapboxgl from 'mapbox-gl';

import { TaxiResponse } from '../../shared/models/taxi-response';

export interface MapProps {
  mapReady: () => void;
  longitude: number;
  latitude: number;
  zoom: number;
  taxiLocations?: TaxiResponse;
}

interface MapState {
  lat: number;
  lng: number;
  zoom: number;
}

mapboxgl.accessToken = 'pk.eyJ1Ijoid2VudGp1biIsImEiOiJjandmODc5cngwcDJjNDNwYjhtOXZqejVtIn0.1l6XNJgy4pkY7TWEV58pVQ';

class Map extends React.Component<MapProps, MapState> {
  private mapContainer: any;
  private map: any;

  constructor(props: MapProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.mapReady();
    this.loadMap();
    this.loadCurrentPositionMarker();
  }

  loadMap() {
    const { longitude, latitude, zoom } = this.props;
    this.map = new mapboxgl.Map({
      center: [longitude, latitude],
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom
    });

    // Add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('move', () => {
      const { lat, lng } = this.map.getCenter();
      this.setState({
        lat: Number(lat.toFixed(4)),
        lng: Number(lng.toFixed(4)),
        zoom: Number(this.map.getZoom().toFixed(2))
      });
    });
  }

  loadCurrentPositionMarker() {
    const { longitude, latitude } = this.props;
    const el = document.createElement('div');
    el.className = 'marker';
    el.setAttribute('style', `background-image: url(${require('./marker-editor.svg')});background-size: cover;width: 50px;height: 50px;border-radius: 50%;cursor: pointer;`);
    new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .addTo(this.map);
  }

  public componentDidUpdate() {
    this.updateTaxiLocations();
  }

  updateTaxiLocations() {
    const { taxiLocations } = this.props;
    // remove existing markers
    document.querySelectorAll('.map__taxi-marker').forEach(el => el.remove());
    // add new markers
    if (taxiLocations) {
      taxiLocations.drivers.map(driver => {
        const { longitude, latitude } = driver.location;
        const el = document.createElement('div');
        el.className = 'map__taxi-marker';
        el.setAttribute('style', `background-image: url(${require('./taxi-urban-transport.svg')});background-size: cover;width: 50px;height: 50px;border-radius: 50%;cursor: pointer;`);
        new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .addTo(this.map);
      });
    }
  }

  public componentWillUnmount() {
    this.map.remove();
  }

  public render() {
    const wrapperStyle: CSSProperties = {
      width: '75vw'
    };
    const style: CSSProperties = {
      bottom: 0,
      position: 'absolute',
      top: 0,
      width: 'inherit'
    };
    return(
      <div style={wrapperStyle}>
        <div ref={el => this.mapContainer = el} style={style} />
      </div>
    );
  }
}

export default Map;
