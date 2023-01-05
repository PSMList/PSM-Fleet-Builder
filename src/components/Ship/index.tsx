import { ItemsContextType } from "@/components/commons/Item";
import { ShipType } from "@/data/ship";
import { StoreProvider } from "@/data/store";
import { createContext, ParentComponent } from "solid-js";
import FleetDisplay from "./FleetDisplay";
import './Ship.css';
import ShipSearch from "./ShipSearch";

export const ShipItemsContext = createContext<ItemsContextType<ShipType>>({
    add: () => {}
});

const ShipItemsProvider: ParentComponent = (props) => {
    return <ShipItemsContext.Provider value={{} as any}>{props.children}</ShipItemsContext.Provider>
}

const Ship = () => {
    
    return (
        <div class="main_container" id="fleet_container">
            <StoreProvider>
                <ShipItemsProvider>
                    <ShipSearch />
                    <FleetDisplay />
                </ShipItemsProvider>
            </StoreProvider>
        </div>
    );
}

export default Ship;