import { ItemsContextType } from "@/components/commons/Item";
import { ShipType } from "@/data/ship";
import { createContext } from "solid-js";
import FleetDisplay from "./FleetDisplay";
import './Ship.css';
import ShipSearch from "./ShipSearch";

export const ShipItemsContext = createContext<ItemsContextType<ShipType>>({
    add: () => {}
});

const Ship = () => {
    
    return (
        <div class="main_container" id="fleet_container">
            <ShipSearch />
            <FleetDisplay />
        </div>
    );
}

export default Ship;