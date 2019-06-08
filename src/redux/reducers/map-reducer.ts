import { ActionType, getType } from 'typesafe-actions';

import * as actions from '../actions';

type Action = ActionType<typeof actions>;

export interface MapState {
  readonly ready: boolean;
  readonly latitude: number;
  readonly longtitude: number;
  readonly zoom: number;
}

const initialState = {
  ready: false,
  latitude: 51.5049375,
  longtitude: -0.0964509,
  zoom: 15
};

export const mapReducer = (state: MapState = initialState, action: Action): MapState => {

  switch (action.type) {

    case getType(actions.mapReadyAction):
      return {
        ...state,
        ready: true
      };

    default:
      return state;
  }
};
