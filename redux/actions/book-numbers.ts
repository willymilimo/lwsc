import Actions, { ActionI } from "../Actions";
import { BookNumberReducerI } from "../reducers/book-number";
import { BookNumberI } from "../../models/meter-reading";

export const setBookNumbers = (
  bookNumbers: BookNumberReducerI
): ActionI<BookNumberReducerI> => ({
  type: Actions.SET_BILL_GROUP,
  payload: bookNumbers,
});

export const addBookNumber = (account: BookNumberI): ActionI<BookNumberI> => ({
  type: Actions.ADD_BOOK_NUMBER,
  payload: account,
});

export const deleteBookNumber = (key: string): ActionI<string> => ({
  type: Actions.DELETE_BOOK_NUMBER,
  payload: key,
});
