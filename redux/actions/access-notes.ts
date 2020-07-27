import Actions, { ActionI } from "../Actions";
import { AccessNotesReducerI } from "../reducers/access-notes";
import { NotesI, NoAccessI } from "../../models/access-description";

export const setAccessNotes = (
  accessNotes: AccessNotesReducerI
): ActionI<AccessNotesReducerI> => ({
  type: Actions.SET_ACCESS_NOTES,
  payload: accessNotes,
});

export const setANNotes = (notes: NotesI[]): ActionI<NotesI[]> => ({
  type: Actions.SET_AN_NOTES,
  payload: notes,
});

export const setANAccess = (access: NoAccessI[]): ActionI<NoAccessI[]> => ({
  type: Actions.SET_AN_ACCESS,
  payload: access,
});
