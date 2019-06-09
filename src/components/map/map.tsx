import mapboxgl from 'mapbox-gl';
import React, { CSSProperties } from 'react';

import { TaxiResponse } from '../../shared/models/taxi-response';
import { Symbols } from './symbols';

export interface MapProps {
  mapReady: () => void;
  longitude: number;
  latitude: number;
  zoom: number;
  taxiLocations?: TaxiResponse;
}

interface MapState {
}

mapboxgl.accessToken = 'pk.eyJ1Ijoid2VudGp1biIsImEiOiJjandmODc5cngwcDJjNDNwYjhtOXZqejVtIn0.1l6XNJgy4pkY7TWEV58pVQ';

class Map extends React.Component<MapProps, MapState> {
  private mapContainer: any;
  private map: any;

  constructor(props: MapProps) {
    super(props);
  }

  public componentDidMount() {
    this.loadMap();
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

    this.map.on('load', () => {
      this.props.mapReady();
      this.loadCurrentPositionMarker();
    });
  }

  loadCurrentPositionMarker() {
    const { longitude, latitude } = this.props;
    this.map.loadImage(Symbols.currentPositionMarker, (error: any, image: HTMLElement) => {
        if (error) {
          throw error;
        }
        this.map.addImage('currentPositionMarker', image);
        this.map.addLayer({
          id: 'symbolsLayer',
          type: 'symbol',
          layout: {
            'icon-image': 'currentPositionMarker',
            'icon-size': 0.4
          },
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude]
                }
              }]
            }
          }
        });
      });
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
        const { longitude, latitude, bearing } = driver.location;
        const el = document.createElement('div');
        el.className = 'map__taxi-marker';
        el.setAttribute('style',
          `background-image: url(${require('./taxi.svg')});
           background-size: cover;
           width: 50px;
           height: 50px;
           border-radius: 50%;
           cursor: pointer;`);
        new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .addTo(this.map);
        // rotate taxi according to bearing. apply rotation after rendering as mapboxgl overwrites transform attribute with new values
        el.style.transform = el.style.transform + `rotate(${bearing}deg)`;
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
