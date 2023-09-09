import { createContext, ParentComponent, useContext } from "solid-js";
import { DatabaseService } from "./DatabaseService";

export interface RootState {
  databaseService: ReturnType<typeof DatabaseService>;
}

const rootState: RootState = {
  databaseService: DatabaseService(),
};

const StoreContext = createContext<RootState>();

export const useStore = () => useContext(StoreContext)!;

export const StoreProvider: ParentComponent = (props) => {
  return (
    <StoreContext.Provider value={rootState}>
      {props.children}
    </StoreContext.Provider>
  );
};
