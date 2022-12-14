import { ItemsContextType, ItemType } from "@/components/commons/Item";
import { ShipItemType } from "@/components/Ship";
import { crewData } from "@/data/crew";
import extensions, { ExtensionType } from "@/data/extension";
import factions, { FactionType } from "@/data/faction";
import { createContext } from "solid-js";
import './Crew.css';
import CrewDisplay from "./CrewDisplay";
import CrewSearch from "./CrewSearch";


export type CrewItemType = ItemType & {
}

export const crewDict: { [id: string]: CrewItemType } = {};
export const crewList = crewData.map<CrewItemType>(
    data => {
        const [ id, idfaction, idextension, name, numid, points, lookingforbetterpic ] = data;
        const faction = factions[idfaction] as FactionType;
        const extension = extensions[idextension] as ExtensionType;

        const crew: CrewItemType = {
            id,
            img: (!lookingforbetterpic ? `/public/img/gameicons/x80/${extension.short}/${numid}.jpg` : '/public/img/logos/crew.png'),
            altimg: '/public/img/logos/crew.png',
            faction,
            extension,
            numid,
            name,
            fullname: `${ extension.short }${ numid } ${ name }`,
            points
        };
        return crewDict[id] = crew;
    });


export const CrewItemsContext = createContext<ItemsContextType>({
    selectItemCallbacks: []
});

type CrewProps = {
    ship: ShipItemType
    remainingFleetPoints: number
}

const Crew = (props: CrewProps) => {
    
    return (
        <div class="main_container" id="crew_container">
            <CrewSearch factionID={ props.ship.faction.id.toString() } />
            <CrewDisplay ship={ props.ship } remainingFleetPoints={ props.remainingFleetPoints } />
        </div>
    );
}

export default Crew;