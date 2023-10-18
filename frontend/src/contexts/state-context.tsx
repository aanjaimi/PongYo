import React, { createContext, useReducer, useContext } from "react";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/utils/user-utils";

type State = {
  user: User | null;
};

type Action = {
  type: "SET_USER";
  payload: User | null;
};

type Dispatch = (action: Action) => void;
const initialState: State = {
  user: null,
};

const StateContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const stateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

type StateProviderProps = { children: React.ReactNode };

const StateProvider = ({ children }: StateProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const value = { state, dispatch };
  useQuery({
    queryKey: ["users", "@me"],
    queryFn: async () => {
      return getCurrentUser();
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
