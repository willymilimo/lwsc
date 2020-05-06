import Actions, { ActionI } from "../Actions";

export interface ServiceConstantsI {
  costPerLitre: number;
}

const initState: ServiceConstantsI = {
  costPerLitre: 1.5,
};

export default function (
  state = initState,
  action: ActionI<any>
): ServiceConstantsI {
  switch (action.type) {
    case Actions.SET_COST_PER_LITRE:
      state = {
        ...state,
        costPerLitre: action.payload,
      };
      break;
  }

  return state;
}
