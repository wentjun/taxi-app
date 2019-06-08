import { Epic } from "redux-observable";
import { from, of } from 'rxjs';
import { switchMap, filter, map, catchError } from 'rxjs/operators';
import { ActionType, isActionOf } from 'typesafe-actions';

import * as actions from '../actions';
import { RootState } from '../reducers';
import { getTaxiList } from '../../shared/services/Api';
type Action = ActionType<typeof actions>;

const getTaxiListEpic: Epic<Action, Action, RootState> = (action$, store) =>
  action$.pipe(
    /*
    mergeMap(response => response.json()),
    map(response => ({
        pickupEta: response.pickup_eta,
        drivers: response.drivers.map((driver: any) => ({
          driverId: driver.driver_id,
          location: driver.location
        }))
      })),
      */
  );

export default [
  getTaxiListEpic
];
