import React, { createContext, useReducer, useContext, useEffect } from "react";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/utils/user-utils";

type State = {
  user: User | null;
  auth_status: false | true | "otp" | 'authenticated';
};

type Action =
  | {
      type: "SET_USER";
      payload: User | null;
    }
  | {
      type: "SET_AUTH";
      payload: State["auth_status"];
    };

type Dispatch = (action: Action) => void;
const initialState: State = {
  user: null,
  auth_status: true,
};

const StateContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const stateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_AUTH":
      return { ...state, auth_status: action.payload };
    default:
      return { ...state };
  }
};

type StateProviderProps = { children: React.ReactNode };

const StateProvider = ({ children }: StateProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const value = { state, dispatch };
  useQuery({
    queryKey: ["users", "@me"],
    retry: false,
    queryFn: async () => {
      return getCurrentUser();
    },
    onSuccess(user) {
      dispatch({ type: "SET_USER", payload: user });
      dispatch({
        type: "SET_AUTH",
        payload: user.totp.enabled && user.otpNeeded ? "otp" : 'authenticated'
      });
    },
    onError() {
      dispatch({ type: "SET_AUTH", payload: false });
      dispatch({ type: "SET_USER", payload: null });
    },
  });

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

const useStateContext = () => {
  const context = useContext(StateContext);

  if (context) return context;

  throw new Error(`useStateContext must be used within a StateContextProvider`);
};

export { StateProvider, useStateContext };
