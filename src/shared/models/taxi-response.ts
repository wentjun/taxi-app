export interface TaxiResponse {
  drivers: Driver[];
  pickupEta: number;
}

interface Driver {
  driverId: string;
  location: Location;
}

interface Location {
  bearing: number;
  latitude: number;
  longitude: number;
}
