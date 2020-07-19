import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";
import { StatementI } from "../../models/statement";

const initState: StatementI[] = [
  // new PaymentHistory({
  //   _id: 'asfasdfasdbasdfasdfad',
  //   payment_date: new Date(),
  //   payment_type: "Bill Payment",
  //   payment_description: "some descriptio of the payment",
  //   amount: 100,
  // }),
  // new PaymentHistory({
  //   _id: 'asfasdfasdbasdfabbbbcdfad',
  //   payment_date: new Date(),
  //   payment_type: "Bowser Payment",
  //   payment_description: "some descriptio of the payment",
  //   amount: 1500,
  // }),
];

export default function (
  state = initState,
  action: ActionI<any>
): StatementI[] {
  const { type, payload } = action;

  switch (type) {
    case Actions.SET_PAYMENT_HISTORY:
      state = payload;
      break;
    case Actions.ADD_PAYMENT_HISTORY:
      state = [...state, payload];
      break;
  }

  if (payload) {
    AsyncStorage.setItem(
      Strings.PAYMENT_HISTORY_STORAGE,
      JSON.stringify(state)
    );
  }

  return state;
}
