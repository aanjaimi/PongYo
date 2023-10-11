import React, { createContext, useReducer, useContext } from "react";


// import type { User } from "@/types/user";
// import type { Achievements } from "@/types/achievement";
import type { Socket } from "socket.io-client";
import { type } from "os";
import io from 'socket.io-client';
import { User } from "@/types/user";

type State = {
  user: User | null;
  // achievement: Achievements[] | [];
  socket: Socket;
  opp : User | null;
};
type Action = {
  type: "SET_USER";
  payload: User | null;
// } | {
//   type: "SET_ACHIEVEMENT";
  // payload: Achievements[] | [];
} | {
  type: "SET_SOCKET";
  payload: Socket | null;
}| {
    type: "SET_OPP";
    payload: User | null;
};

type Dispatch = (action: Action) => void;
const Cookies = require('js-cookie');
const token = Cookies.get('auth-token');
const initialState: State = {
  // set user to its initial value
  user: null,
  // achievement: [],
  socket: io('http://localhost:5000/game', {
    autoConnect: false,
    extraHeaders: {
      Auth: `${token}`,
    },
    
  }),
  opp: null,
};

const StateContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const stateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    // case "SET_ACHIEVEMENT":
    //   return { ...state, achievement: action.payload };
    case "SET_SOCKET":
      return { ...state, socket: action.payload };
    case "SET_OPP":
      return { ...state, opp: action.payload };
    default:
      return state;
  }
};

type StateProviderProps = { children: React.ReactNode };

const StateProvider = ({ children }: StateProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const value = { state, dispatch };
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