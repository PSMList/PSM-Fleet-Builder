import { createContext } from 'preact';
import { crewData } from '../../data/crew';
import extensions, { ExtensionType } from '../../data/extension';
import factions, { FactionType } from '../../data/faction';
import { ItemsContextType, ItemType } from '../commons/Item';
import { ShipItemType } from '../Ship';
import './Crew.css';
import CrewDisplay from './CrewDisplay';
import CrewSearch from './CrewSearch';


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

const Crew = ({ ship, remainingFleetPoints }: CrewProps) => {
    
    return (
        <>
            <div class="search_and_display" id="crew_container">
                <CrewSearch factionID={ ship.faction.id } />
                <CrewDisplay ship={ ship } remainingFleetPoints={ remainingFleetPoints } />
            </div>
        </>
    );
}

export default Crew;