import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";
import { PropertyI } from "../../models/meter-reading";

export interface MeterReadingPropertiesReducerI {
  [key: string]: PropertyI[];
}

const initState: MeterReadingPropertiesReducerI = {};

export default function (
    state = initState,
    action: ActionI<MeterReadingPropertiesReducerI | PropertyI | string>
  ): MeterReadingPropertiesReducerI {
    let { type, payload } = action;
  
    switch (type) {
      case Actions.SET_MR_PROPERTY:
        state = payload as MeterReadingPropertiesReducerI;
        break;
      case Actions.ADD_MR_PROPERTY:
        payload = payload as PropertyI;
        const item = state[payload.BOOK_NO];
        state = { ...state, [payload.BOOK_NO]: [...item, payload] };
        break;
      case Actions.DELETE_MR_PROPERTY:
        payload = payload as string;
        delete state[payload];
        break;
    }
  
    // if (
    //   [
    //     Actions.SET_MR_PROPERTY,
    //     Actions.ADD_MR_PROPERTY,
    //     Actions.DELETE_MR_PROPERTY,
    //   ].includes(type)
    // ) {
    //   AsyncStorage.setItem(Strings.MR_PROPERTY_STORAGE, JSON.stringify(state));
    // }
  
    return state;
  }
