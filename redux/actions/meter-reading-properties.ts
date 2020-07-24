import Actions, { ActionI } from "../Actions";
import { MeterReadingPropertiesReducerI } from "../reducers/meter-reading-proerties";
import { PropertyI } from "../../models/meter-reading";

export const setMRProperties = (
  properties: MeterReadingPropertiesReducerI
): ActionI<MeterReadingPropertiesReducerI> => ({
  type: Actions.SET_MR_PROPERTY,
  payload: properties,
});

export const addMRProperty = (account: PropertyI): ActionI<PropertyI> => ({
  type: Actions.ADD_MR_PROPERTY,
  payload: account,
});

export const deleteMRProperty = (key: string): ActionI<string> => ({
  type: Actions.DELETE_MR_PROPERTY,
  payload: key,
});
