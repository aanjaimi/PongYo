import React, { createContext, useReducer, useContext, useEffect } from "react";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/utils/user-utils";

type State = {
  user: User | null;
  auth_status: false | true | "otp" | "loading";
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
      return { ...state, authenicated: action.payload };
    default:
      return state;
  }
};

type StateProviderProps = { children: React.ReactNode };

const StateProvider = ({ children }: StateProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const value = { state, dispatch };
  const userQuery = useQuery({
    queryKey: ["users", "@me"],
    retry: false,
    queryFn: async () => {
      return getCurrentUser();
    },
    onSuccess(user) {
      // ! TODO: use dispatch & check why kan error!
      state.auth_status = user.totp.enabled && user.otpNeeded ? "otp" : true;
      state.user = user;
    },
    onError() {
      state.auth_status = false;
      state.user = null;
    },
  });

  useEffect(() => {
    if (userQuery.status === "loading") state.auth_status = "loading";
  }, [userQuery.status, state]);

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
