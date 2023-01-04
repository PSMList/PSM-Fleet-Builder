import { baseUrl } from "@/App";
import { ItemsContextType, ItemType } from "@/components/commons/Item";
import { ShipItemType } from "@/components/Ship";
import { crewData } from "@/data/crew";
import extensionsData, { ExtensionType } from "@/data/extension";
import factionsData, { FactionType } from "@/data/faction";
import raritiesData, { RarityType } from "@/data/rarity";
import { createContext } from "solid-js";
import './Crew.css';
import CrewDisplay from "./CrewDisplay";
import CrewSearch from "./CrewSearch";


export type CrewItemType = ItemType & {
}

export const crewDict: { [id: string]: CrewItemType } = {};
export const crewList = crewData.map<CrewItemType>(
    data => {
        const faction = factionsData[data.idfaction] as FactionType;
        const extension = extensionsData[data.idextension] as ExtensionType;
        const rarity = raritiesData[data.idrarity] as RarityType;

        const crew: CrewItemType = {
            id: data.id,
            img: (!data.lookingforbetterpic ? `${baseUrl}/img/gameicons/x80/${extension.short}/${data.numid}.jpg` : `${baseUrl}/img/logos/crew.png`),
            altimg: `${baseUrl}/img/logos/crew.png`,
            faction,
            rarity,
            extension,
            numid: data.numid,
            name: data.name,
            fullname: `${extension.short}${data.numid} ${name}`,
            points: data.points,
            defaultaptitude: data.defaultaptitude
        };
        return crewDict[data.id] = crew;
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