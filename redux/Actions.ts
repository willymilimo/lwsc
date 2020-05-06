export interface ActionI<T> {
  type: string;
  payload: T;
}

export default {
  SET_THEME_REDUCER: "SET_THEME_REDUCER",
  SET_THEME_NAME: "SET_THEME_NAME",
  SET_THEME: "SET_THEME",

  SET_NOTIFICATIONS: "SET_NOTIFICATIONS",
  ADD_NOTIFICATIONS: "ADD_NOTIFICATIONS",

  SET_ACCOUNTS: 'SET_ACCOUNTS',
  ADD_ACCOUNT: "SET_ACCOUNT",
  DELETE_ACCOUNT: "DELETE_ACCOUNT",

  SET_COST_PER_LITRE: 'SET_COST_PER_LITRE',
};
