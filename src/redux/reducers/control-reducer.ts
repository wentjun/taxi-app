import { ActionType, getType } from 'typesafe-actions';

import * as actions from '../actions';

type Action = ActionType<typeof actions>;

export interface ControlState {
  readonly loading: boolean;
  readonly taxiCount: string;
}

const initialState = {
  loading: false,
  taxiCount: '5'
};

export const controlReducer = (state: ControlState = initialState, action: Action): ControlState => {

  switch (action.type) {

    case getType(actions.setTaxiCount):
      return {
        ...state,
        taxiCount: action.payload.taxiCount
      }

    default:
      return state;
  }
};
