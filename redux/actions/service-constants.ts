import Actions, { ActionI } from "../Actions";

export const setCostPerLitre = (costPerLitre: number): ActionI<number> => ({
  type: Actions.SET_COST_PER_LITRE,
  payload: costPerLitre,
});
