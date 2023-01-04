import { baseUrl, onlyDisplay } from "@/App";
import IconButton from "@/components/commons/IconButton";
import Select from "@/components/commons/Inputs/Select";
import Search, { SearchItemType } from "@/components/commons/Search";
import { ShipItemsContext, ShipItemType, shipList } from "@/components/Ship";
import ShipItem from "@/components/Ship/ShipItem";
import extensionsData from "@/data/extension";
import factionsData from "@/data/faction";
import { createSignal, useContext } from "solid-js";
import './ShipSearch.css';

const selectFactions = Object.values(factionsData);
const selectFactionsOptions = selectFactions.map( faction => ({ value: faction.id.toString(), display: <span><img src={ /*@once*/`${baseUrl}/img/flag/search/${faction.nameimg}.png` } />{ /*@once*/faction.defaultname }</span> }) )
selectFactionsOptions.unshift({ value: '-1', display: <span><img />All factions</span> });

const selectExtensions = Object.values(extensionsData);
const selectExtensionsOptions = selectExtensions.map( extension => ({ value: extension.id.toString(), display: <span><img src={ /*@once*/`${baseUrl}/img/logos/logo_${extension.short.replace('U', '')}.png` } />{ /*@once*/extension.name }</span> }) )
selectExtensionsOptions.unshift({ value: '-1', display: <span><img />All expansions</span> });

const ShipSearch = () => {
    if (onlyDisplay) return <></>;

    const [ factionFilter, setFactionFilter ] = createSignal(-1);
    const [ extensionFilter, setExtensionFilter ] = createSignal(-1);
    
    const shipItemsContext = useContext(ShipItemsContext);
    
    const selectItem = (ship: ShipItemType) => {
        shipItemsContext.add( ship );
    }

    const ships: SearchItemType[] = shipList.map( ship => ({
        search_field: ship.fullname,
        element:
            <ShipItem
                data={ ship }
                actions={
                    <IconButton
                        iconID="plus-square"
                        onClick={ () => selectItem( ship ) }
                        title="Add crew"
                    />
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
                    defaultSelectText="Select expansion"
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