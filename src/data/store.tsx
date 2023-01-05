import { createContext, ParentComponent, useContext } from "solid-js";
import { DatabaseService } from "./DatabaseService";


export type RootState = {
    databaseService: ReturnType<typeof DatabaseService>
    // fleetDataService: ReturnType<typeof FleetDataService>
}

const rootState: RootState = {
    databaseService: DatabaseService(),
    // fleetDataService: FleetDataService()
}

const StoreContext = createContext<RootState>();

export const useStore = () => useContext(StoreContext)!

export const StoreProvider: ParentComponent = (props) => {
    return <StoreContext.Provider value={rootState}>{props.children}</StoreContext.Provider>
}