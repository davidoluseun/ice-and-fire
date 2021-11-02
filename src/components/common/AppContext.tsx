import * as React from "react";

type AppProviderProps = {
  children: React.ReactNode;
};

type appStateTypes = {
  books: BookTypes[];
  nextUrl: string;
  characters: CharacterTypes[];
};

type AppActionTypes =
  | { type: "FETCH_INIT"; payload: appStateTypes }
  | { type: "FETCH_NEXT_BOOKS"; payload: appStateTypes };

type AppContextTypes = {
  appState: appStateTypes;
  appDispatch: React.Dispatch<any>;
};

const initialState: appStateTypes = {
  books: [],
  nextUrl: "",
  characters: [],
};

export const AppContext = React.createContext({} as AppContextTypes);

export const AppProvider = ({ children }: AppProviderProps) => {
  const appReducer = (state: appStateTypes, action: AppActionTypes) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          books: action.payload.books,
          nextUrl: action.payload.nextUrl,
          characters: action.payload.characters,
        };

      case "FETCH_NEXT_BOOKS":
        return {
          ...state,
          books: action.payload.books,
          nextUrl: action.payload.nextUrl,
        };

      default:
        return state;
    }
  };

  const [appState, appDispatch] = React.useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ appState, appDispatch }}>
      {children}
    </AppContext.Provider>
  );
};
