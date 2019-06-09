import { Epic } from 'redux-observable';
import { of } from 'rxjs';
import { switchMap, filter, debounceTime, mergeMap } from 'rxjs/operators';
import { ActionType, isActionOf } from 'typesafe-actions';

import * as actions from '../actions';
import { getTaxiList } from '../../shared/services/taxi-service';
import { RootState } from '../reducers';
import { TaxiResponse } from '../../shared/models/taxi-response';

type Action = ActionType<typeof actions>;

const mapReadyEpic: Epic<Action, Action, RootState> = (action$, store) =>
  action$.pipe(
    filter(isActionOf(actions.mapReady)),
    switchMap(() =>
      getTaxiList(store.value.map.longitude, store.value.map.latitude, store.value.control.taxiCount).pipe(
        mergeMap((response: TaxiResponse) => {
          if (response.error) {
            return of(actions.updateTaxiLocationsError(response.error));
          } else {
            return ([actions.updateTaxiLocations(response), actions.getTaxiEta(response.pickupEta)]);
          }
        })
    ))
  );

const updateCurrentLocationEpic: Epic<Action, Action, RootState> = (action$, store) =>
  action$.pipe(
    filter(isActionOf(actions.updateCurrentLocation)),
    debounceTime(500),
    switchMap(action =>
      getTaxiList(action.payload.longitude, action.payload.latitude, store.value.control.taxiCount).pipe(
        mergeMap((response: TaxiResponse) => {
          if (response.error) {
            return of(actions.updateTaxiLocationsError(response.error));
          } else {
            return ([actions.updateTaxiLocations(response), actions.getTaxiEta(response.pickupEta)]);
          }
        })
      )
    )
  );

const getTaxiListEpic: Epic<Action, Action, RootState> = (action$, store) =>
  action$.pipe(
    filter(isActionOf(actions.setTaxiCount)),
    debounceTime(500),
    switchMap(action =>
      getTaxiList(store.value.map.longitude, store.value.map.latitude, action.payload.taxiCount).pipe(
        mergeMap((response: TaxiResponse) => {
          if (response.error) {
            return of(actions.updateTaxiLocationsError(response.error));
          } else {
            return ([actions.updateTaxiLocations(response), actions.getTaxiEta(response.pickupEta)]);
          }
        })
      )
    )
  );

export default [
  mapReadyEpic, getTaxiListEpic, updateCurrentLocationEpic
];
