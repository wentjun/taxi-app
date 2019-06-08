import React, { CSSProperties } from 'react';
import mapboxgl from 'mapbox-gl';

export interface MapProps {
  mapReady: () => void;
  longitude: number;
  latitude: number;
  zoom: number;
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
    this.onLoaded = this.onLoaded.bind(this);
  }

  public componentDidMount() {
    this.props.mapReady();
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
    this.map.on('load', () => {
      /* Image: An image is loaded and added to the map. */
      this.map.loadImage('https://i.imgur.com/MK4NUzI.png', (error: any, image: any) => {
        if (error) {
          throw error;
        }
        this.map.addImage('custom-marker', image);
        /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
        this.map.addLayer({
          id: 'markers',
          type: 'symbol',
          /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: [-0.0964509, 51.5049375]
                  }
                }
              ]
            }
          },
          layout: {
            'icon-image': 'custom-marker'
          }
        });
      });
    });
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

  private onLoaded() {

  }
}

export default Map;
