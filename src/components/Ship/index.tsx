import { createContext } from 'preact';
import extensions, { ExtensionType } from '../../extensionData';
import factions, { FactionType } from '../../factionData';
import { shipData } from '../../shipData';
import { ItemsContextType, ItemType } from '../commons/Item';
import { CrewItemType } from '../Crew';
import FleetDisplay from './FleetDisplay';
import './Ship.css';
import ShipSearch from './ShipSearch';


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
        <>
            <div class="search_and_display" id="fleet_container">
                <ShipSearch />
                <FleetDisplay />
            </div>
        </>
    );
}

export default Ship;