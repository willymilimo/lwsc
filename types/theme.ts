// export enum ThemeType {
//   blue = "blue",
//   white = "white",
// }

export interface ThemeType {
  appBarColor: string;
  textColor: string;
  backgroundColor: string;
  activeTintColor: string;
  inactiveTintColor: string;
}

export interface ThemeReducer {
  name: string;
  theme: ThemeType;
}
