import { AccountI } from "../../models/account";
import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";
import { NoAccessI, NotesI } from "../../models/access-description";

export interface AccessNotesReducerI {
  no_access: NoAccessI[];
  notes: NotesI[];
}

const initState: AccessNotesReducerI = { no_access: [], notes: [] };

export default function (
  state = initState,
  action: ActionI<AccessNotesReducerI | NoAccessI[] | NotesI[]>
): AccessNotesReducerI {
  let { type, payload } = action;

  switch (type) {
    case Actions.SET_ACCESS_NOTES:
      state = payload as AccessNotesReducerI;
      break;
    case Actions.SET_AN_ACCESS:
      payload = payload as NoAccessI[];
      state = { ...state, no_access: payload };
      break;
    case Actions.SET_AN_NOTES:
      payload = payload as NotesI[];
      state = { ...state, notes: payload };
      break;
  }

  if (
    [
      Actions.SET_ACCESS_NOTES,
      Actions.SET_AN_NOTES,
      Actions.SET_AN_ACCESS,
    ].includes(type)
  ) {
    AsyncStorage.setItem(Strings.ACCESS_NOTES_STORAGE, JSON.stringify(state));
  }

  return state;
}
