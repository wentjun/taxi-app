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

  public componentDidUpdate() {
    this.updateTaxiLocations();
  }

  public componentWillUnmount() {
    this.map.remove();
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
      this.loadTaxiMarkersLayer();
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
          id: 'currentLocationLayer',
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

  loadTaxiMarkersLayer() {
    this.map.loadImage(Symbols.taxiMarker, (error: any, image: HTMLElement) => {
        if (error) {
          throw error;
        }
        this.map.addImage('taxiMarker', image);

        this.map.addSource('taxiSource', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
        this.map.addLayer({
          id: 'taxiLayer',
          type: 'symbol',
          layout: {
            'icon-image': 'taxiMarker',
            'icon-size': 0.5
          },
          source: 'taxiSource'
        });
      });
  }

  updateTaxiLocations() {
    const getTaxiSource = this.map.getSource('taxiSource');
    const { taxiLocations } = this.props;

    if (taxiLocations && getTaxiSource) {
      // map to response to geojson object
      const res = taxiLocations.drivers.map(driver => {
        const { longitude, latitude, bearing } = driver.location;
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        }
      });
      const updatedGeoJson = {
        type: 'FeatureCollection',
        features: res
      };
      // update taxi layer with updated geojson object
      getTaxiSource.setData(updatedGeoJson);
    }
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
