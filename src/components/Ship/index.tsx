import { createContext } from "solid-js";
import extensions, { ExtensionType } from "@/data/extension";
import factions, { FactionType } from "@/data/faction";
import { shipData } from "@/data/ship";
import { ItemsContextType, ItemType } from "@/components/commons/Item";
import { CrewItemType } from "@/components/Crew";
import FleetDisplay from "./FleetDisplay";
import './Ship.css';
import ShipSearch from "./ShipSearch";


export type ShipItemType = ItemType & {
    crew: CrewItemType[]
    cargo: number
    masts: number
}

export const shipDict: { [id: string]: ShipItemType } = {};
export const shipList = shipData.map<ShipItemType>(
    data => {
        const [ id, idfaction, idextension, name, numid, points, masts, cargo, lookingforbetterpic ] = data;
        const faction = factions[idfaction] as FactionType;
        const extension = extensions[idextension] as ExtensionType;

        const ship: ShipItemType = {
            id,
            img: (!lookingforbetterpic ? `/public/img/gameicons/x80/${extension.short}/${numid}.jpg` : '/public/img/logos/ship.png'),
            altimg: '/public/img/logos/ship.png',
            faction,
            extension,
            numid,
            name,
            fullname: `${ extension.short }${ numid } ${ name }`,
            points,
            masts,
            cargo,
            crew: []
        };
        return shipDict[id] = ship;
    });


export const ShipItemsContext = createContext<ItemsContextType>({
    selectItemCallbacks: []
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