import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { ShipItemsContext, ShipItemType, shipList } from "..";
import factions from "../../../data/faction";
import extensions from "../../../data/extension";
import IconButton from "../../commons/IconButton";
import Select from "../../commons/Inputs/Select";
import Search, { SearchItemType } from "../../commons/Search";
import ShipItem from "../ShipItem";
import './ShipSearch.css';

const ShipSearch = () => {

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

    const [ filteredShips, setFilteredShips ] = useState(ships);
    
    const shipItemsContext = useContext(ShipItemsContext);
    
    const selectItem = useCallback( (ship: ShipItemType) => {
        shipItemsContext.selectItemCallbacks.forEach( selectItemCallback => {
            selectItemCallback( ship );
        });
    }, []);

    const selectFactions = useMemo(() => {
        const factionsList = Object.values(factions);
        factionsList.unshift({ id: -1, img: '', name: 'All factions' });
        return factionsList;
    }, []);

    // TODO: cache searchByFaction output to reuse instead of recompute
    const searchByFaction = useCallback((value: string) => {
        const selectedFaction = parseInt(value);
        if (selectedFaction === -1 ) {
            return setFilteredShips(() => ships);
        };
        setFilteredShips(() => ships.filter( (_, index) => shipList[index].faction.id === selectedFaction));
    }, []);

    const selectExtensions = useMemo(() => {
        const extensionsList = Object.values(extensions);
        extensionsList.unshift({ id: -1, img: '', name: 'All extensions', short: '' });
        return extensionsList;
    }, []);

    // TODO: cache searchByExtension output to reuse instead of recompute
    const searchByExtension = useCallback((value: string) => {
        const selectedExtension = parseInt(value);
        if (selectedExtension === -1 ) {
            return setFilteredShips(() => ships);
        };
        setFilteredShips(() => ships.filter( (_, index) => shipList[index].extension.id === selectedExtension));
    }, []);

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
                                selectFactions.map( faction => ({ value: faction.id.toString(), display: <><img src={ faction.img } />{ faction.name }</> }) )
                            }
                        />
                        <Select
                            defaultSelectText="Select extension"
                            className="search_extension"
                            onOptionSelect={ searchByExtension }
                            optionsList={
                                selectExtensions.map( extension => ({ value: extension.id.toString(), display: <><img src={ extension.img } />{ extension.name }</> }) )
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