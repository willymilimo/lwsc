import { createRef, RefObject } from "react";
import { NavigationContainerRef } from "@react-navigation/native";

export const navigationRef:
  | RefObject<NavigationContainerRef>
  | null
  | undefined = createRef();

export function navigate(name: string, params?: any) {
  if (navigationRef !== null && navigationRef !== undefined)
    navigationRef.current?.navigate(name, params);
}

export function goBack() {
  if (navigationRef !== null && navigationRef !== undefined)
    navigationRef.current?.goBack();
}
