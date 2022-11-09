import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { ShipItemsContext, ShipItemType, shipList } from "..";
import { onlyDisplay } from "../../../app";
import extensions from "../../../data/extension";
import factions from "../../../data/faction";
import IconButton from "../../commons/IconButton";
import Select from "../../commons/Inputs/Select";
import Search, { SearchItemType } from "../../commons/Search";
import ShipItem from "../ShipItem";
import './ShipSearch.css';

const selectFactions = Object.values(factions);
selectFactions.unshift({ id: -1, img: '', name: 'All factions' });
const selectFactionsOptions = selectFactions.map( faction => ({ value: faction.id.toString(), display: <><img src={ faction.img } />{ faction.name }</> }) )

const selectExtensions = Object.values(extensions);
selectExtensions.unshift({ id: -1, img: '', name: 'All extensions', short: '' });
const selectExtensionsOptions = selectExtensions.map( extension => ({ value: extension.id.toString(), display: <><img src={ extension.img } />{ extension.name }</> }) )

const ShipSearch = () => {
    if (onlyDisplay) return <></>;

    const [ factionFilter, setFactionFilter ] = useState(-1);
    const [ extensionFilter, setExtensionFilter ] = useState(-1);
    
    const shipItemsContext = useContext(ShipItemsContext);
    
    const selectItem = useCallback( (ship: ShipItemType) => {
        shipItemsContext.selectItemCallbacks.forEach( selectItemCallback => {
            selectItemCallback( ship );
        });
    }, []);

    const ships: SearchItemType[] = useMemo(() => shipList.map( ship => ({
        search_field: ship.fullname,
        element:
            <ShipItem
                data={ ship }
                actions={
                    <IconButton iconID="plus-square" onClick={ () => selectItem( ship ) } />
                }
            />
    })), []);

    const searchByFaction = useCallback((factionID: string) => {
        setFactionFilter(() => parseInt(factionID));
    }, []);

    const searchByExtension = useCallback((extensionID: string) => {
        setExtensionFilter(() => parseInt(extensionID));
    }, []);

    // TODO: cache output to reuse instead of recompute
    const filteredShips = (() => {
        if (factionFilter === -1 && extensionFilter === -1) {
            return ships;
        };
        const filteredShips = [];
        for (const index in ships) {
            if (
                (factionFilter === -1 || shipList[index].faction.id === factionFilter)
                &&
                (extensionFilter === -1 || shipList[index].extension.id === extensionFilter)
            ) {
                filteredShips.push(ships[index]);
            }
        }
        return filteredShips;
    })();

    return (
        <>
            <Search
                placeholder="Search by ship name or ID"
                additionalInputs={
                    <>
                        <Select
                            defaultSelectText="Select faction"
                            className="search_faction"
                            onOptionSelect={ searchByFaction }
                            optionsList={
                                selectFactionsOptions
                            }
                        />
                        <Select
                            defaultSelectText="Select extension"
                            className="search_extension"
                            onOptionSelect={ searchByExtension }
                            optionsList={
                                selectExtensionsOptions
                            }
                        />
                    </>
                }
                items={
                    filteredShips
                }
            />
        </>
    );
}

export default ShipSearch;