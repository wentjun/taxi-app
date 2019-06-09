import { Epic } from "redux-observable";
import { of } from 'rxjs';
import { switchMap, filter, map, catchError, debounceTime } from 'rxjs/operators';
import { ActionType, isActionOf } from 'typesafe-actions';

import * as actions from '../actions';
import { RootState } from '../reducers';
import { getTaxiList } from '../../shared/services/taxi-service';
type Action = ActionType<typeof actions>;

const getTaxiListEpic: Epic<Action, Action, RootState> = (action$, store) =>
  action$.pipe(
    filter(isActionOf(actions.setTaxiCount)),
    debounceTime(500),
    switchMap(action =>
      getTaxiList(action.payload.taxiCount).pipe(
        map(actions.updateTaxiLocations)
      ),
    )
  );

export default [
  getTaxiListEpic
];
