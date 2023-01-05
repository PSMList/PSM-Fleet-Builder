import { ItemsContextType } from "@/components/commons/Item";
import { CrewType } from "@/data/crew";
import { ShipType } from "@/data/ship";
import { createContext } from "solid-js";
import './Crew.css';
import CrewDisplay from "./CrewDisplay";
import CrewSearch from "./CrewSearch";

export const CrewItemsContext = createContext<ItemsContextType<CrewType>>({
    add: () => {}
});

type CrewProps = {
    ship: ShipType
    remainingFleetPoints: number
}

const Crew = (props: CrewProps) => {
    
    return (
        <div class="main_container" id="crew_container">
            <CrewSearch defaultFactionID={ props.ship.faction.id.toString() } />
            <CrewDisplay ship={ props.ship } remainingFleetPoints={ props.remainingFleetPoints } />
        </div>
    );
}

export default Crew;