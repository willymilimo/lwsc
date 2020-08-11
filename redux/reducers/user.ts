import Actions, { ActionI } from "../Actions";
import Strings from "../../constants/Strings";
import { AsyncStorage } from "react-native";

export interface UserReducerI {
  manNumber: string;
  username: string;
  authToken: string;
  createdAt: number;
}

const initState: UserReducerI = {
  manNumber: "",
  username: "",
  authToken: "",
  createdAt: 0,
};

export default function (
  state: UserReducerI = initState,
  action: ActionI<string | UserReducerI>
): UserReducerI {
  const { type, payload } = action;

  switch (type) {
    case Actions.SET_USER_REDUCER:
      state = payload as UserReducerI;
      break;

    case Actions.SET_MAN_NUMBER:
      state = {
        ...state,
        manNumber: payload as string,
      };
      break;

    case Actions.UNSET_MAN_NUMBER:
      state = {
        ...state,
        manNumber: "",
      };
      break;
      
    case Actions.SET_USERNAME:
      state = {
        ...state,
        username: payload as string,
      };
      break;

    case Actions.UNSET_USERNAME:
      state = {
        ...state,
        username: "",
      };
      break;

    case Actions.SET_USER_TOKEN:
      state = {
        ...state,
        authToken: payload as string,
      };
      break;

    case Actions.DELETE_USER_TOKEN:
      state = {
        ...state,
        authToken: "",
      };
      break;
  }

  if (
    [
      Actions.SET_USERNAME,
      Actions.UNSET_USERNAME,
      Actions.SET_MAN_NUMBER,
      Actions.UNSET_MAN_NUMBER,
      Actions.SET_USER_TOKEN,
      Actions.DELETE_USER_TOKEN,
    ].includes(type)
  ) {
    AsyncStorage.setItem(Strings.USER_STORAGE, JSON.stringify(state));
  }

  return state;
}
