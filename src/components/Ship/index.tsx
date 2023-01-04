import { baseUrl } from "@/App";
import { ItemsContextType, ItemType } from "@/components/commons/Item";
import { CrewItemType } from "@/components/Crew";
import extensionsData, { ExtensionType } from "@/data/extension";
import factionsData, { FactionType } from "@/data/faction";
import raritiesData, { RarityType } from "@/data/rarity";
import { shipData } from "@/data/ship";
import { createContext } from "solid-js";
import FleetDisplay from "./FleetDisplay";
import './Ship.css';
import ShipSearch from "./ShipSearch";


export type ShipItemType = ItemType & {
    basemove: string
    cannons: string
    crew: CrewItemType[]
    masts: number
    cargo: number
    isfort: boolean
    uuid: string
}

export const shipDict: { [id: string]: ShipItemType } = {};
export const shipList = shipData.map<ShipItemType>(
    data => {
        const faction = factionsData[data.idfaction] as FactionType;
        const extension = extensionsData[data.idextension] as ExtensionType;
        const rarity = raritiesData[data.idrarity] as RarityType;

        const ship: ShipItemType = {
            id: data.id,
            img: (!data.lookingforbetterpic ? `${baseUrl}/img/gameicons/x80/${extension.short}/${data.numid}.jpg` : '/public/img/logos/ship.png'),
            altimg: `${baseUrl}/img/logos/ship.png`,
            faction,
            rarity,
            extension,
            numid: data.numid,
            name: data.name,
            fullname: `${ extension.short }${ data.numid } ${ data.name }`,
            points: data.points,
            cargo: data.cargo,
            masts: data.masts,
            basemove: data.basemove,
            cannons: data.cannons,
            defaultaptitude: data.defaultaptitude,
            isfort: data.isfort,
            crew: [],
            uuid: ''
        };
        return shipDict[data.id] = ship;
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