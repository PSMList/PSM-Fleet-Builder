import { onlyDisplay } from "@/App";
import IconButton from "@/components/commons/IconButton";
import Select from "@/components/commons/Inputs/Select";
import Search, { SearchItemType } from "@/components/commons/Search";
import { ShipItemsContext, ShipItemType, shipList } from "@/components/Ship";
import ShipItem from "@/components/Ship/ShipItem";
import extensions from "@/data/extension";
import factions from "@/data/faction";
import { createSignal, useContext } from "solid-js";
import './ShipSearch.css';

const selectFactions = Object.values(factions);
selectFactions.unshift({ id: -1, img: '', name: 'All factions' });
const selectFactionsOptions = selectFactions.map( faction => ({ value: faction.id.toString(), display: <span><img src={ /*@once*/faction.img } />{ /*@once*/faction.name }</span> }) )

const selectExtensions = Object.values(extensions);
selectExtensions.unshift({ id: -1, img: '', name: 'All extensions', short: '' });
const selectExtensionsOptions = selectExtensions.map( extension => ({ value: extension.id.toString(), display: <span><img src={ /*@once*/extension.img } />{ /*@once*/extension.name }</span> }) )

const ShipSearch = () => {
    if (onlyDisplay) return <></>;

    const [ factionFilter, setFactionFilter ] = createSignal(-1);
    const [ extensionFilter, setExtensionFilter ] = createSignal(-1);
    
    const shipItemsContext = useContext(ShipItemsContext);
    
    const selectItem = (ship: ShipItemType) => {
        shipItemsContext.selectItemCallbacks.forEach( selectItemCallback => {
            selectItemCallback( ship );
        });
    }

    const ships: SearchItemType[] = shipList.map( ship => ({
        search_field: ship.fullname,
        element:
            <ShipItem
                data={ ship }
                actions={
                    <IconButton iconID="plus-square" onClick={ () => selectItem( ship ) } />
                }
            />
    }));

    const searchByFaction = (factionID: string) => {
        setFactionFilter(() => parseInt(factionID));
    }

    const searchByExtension = (extensionID: string) => {
        setExtensionFilter(() => parseInt(extensionID));
    }

    const filteredShips = () => {
        if (factionFilter() === -1 && extensionFilter() === -1) {
            return ships;
        };
        const filteredShips = [];
        for (const index in ships) {
            if (
                (factionFilter() === -1 || shipList[index].faction.id === factionFilter())
                &&
                (extensionFilter() === -1 || shipList[index].extension.id === extensionFilter())
            ) {
                filteredShips.push(ships[index]);
            }
        }
        return filteredShips;
    };

    return (
        <Search
            placeholder="Search by ship name or ID"
            additionalInputs={<>
                <Select
                    defaultSelectText="Select faction"
                    class="search_faction"
                    onOptionSelect={ searchByFaction }
                    optionsList={
                        selectFactionsOptions
                    }
                />
                <Select
                    defaultSelectText="Select extension"
                    class="search_extension"
                    onOptionSelect={ searchByExtension }
                    optionsList={
                        selectExtensionsOptions
                    }
                />
            </>}
            items={filteredShips()}
        />
    );
}

export default ShipSearch;