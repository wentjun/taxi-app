import { createAction } from 'typesafe-actions';

export const MAP_READY   = '[MAP] Set Map As Ready';
export const GET_TAXI_COUNT = '[Control] Get Taxi Count';

export const mapReadyAction = createAction(MAP_READY);
export const setTaxiCount = createAction(GET_TAXI_COUNT, resolve => (taxiCount: string) => resolve({ taxiCount }));
