import { createAction } from 'typesafe-actions';
import { TaxiResponse } from '../../shared/models/taxi-response';

export const MAP_READY   = '[Map] Set Map As Ready';
export const MAP_UPDATE_TAXI_LOCATIONS   = '[Map] Update Taxi Locations';
export const CONTROL_SET_TAXI_COUNT = '[Control] Set Taxi Count';
export const CONTROL_GET_TAXI_ETA = '[Control] Get Taxi ETA';

export const mapReady = createAction(MAP_READY);
export const updateTaxiLocations = createAction(MAP_UPDATE_TAXI_LOCATIONS, resolve => (taxiLocations: TaxiResponse) => resolve(taxiLocations));
export const setTaxiCount = createAction(CONTROL_SET_TAXI_COUNT, resolve => (taxiCount: string) => resolve({ taxiCount }));
export const getTaxiEta = createAction(CONTROL_GET_TAXI_ETA, resolve => (pickupEta: number) => resolve({ pickupEta }));
