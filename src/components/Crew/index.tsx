import { ItemsContextType } from "@/components/commons/Item";
import { CrewType } from "@/data/crew";
import { ShipType } from "@/data/ship";
import { StoreProvider } from "@/data/store";
import { createContext, ParentComponent } from "solid-js";
import './Crew.css';
import CrewDisplay from "./CrewDisplay";
import CrewSearch from "./CrewSearch";

export const CrewItemsContext = createContext<ItemsContextType<CrewType>>({
    add: () => {}
});

const CrewItemsProvider: ParentComponent = (props) => {
    return <CrewItemsContext.Provider value={{} as any}>{props.children}</CrewItemsContext.Provider>
}

type CrewProps = {
    ship: ShipType
    remainingFleetPoints: number
}

const Crew = (props: CrewProps) => {
    return (
        <div class="main_container" id="crew_container">
            <StoreProvider>
                <CrewItemsProvider>
                    <CrewSearch defaultFactionID={ props.ship.faction.id.toString() } />
                    <CrewDisplay ship={ props.ship } remainingFleetPoints={ props.remainingFleetPoints } />
                </CrewItemsProvider>
            </StoreProvider>
        </div>
    );
}

export default Crew;