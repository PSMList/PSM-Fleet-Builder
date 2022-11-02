import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { ShipItemsContext, ShipItemType, shipList } from "..";
import factions from "../../../data/faction";
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

    const selectFactions = useMemo(() => {
        const factionsList = Object.values(factions);
        factionsList.unshift({ id: -1, img: '', name: 'All factions' });
        return factionsList;
    }, []);

    const [ filteredShips, setFilteredShips ] = useState(ships);
    
    const shipItemsContext = useContext(ShipItemsContext);
    
    const selectItem = useCallback( (ship: ShipItemType) => {
        shipItemsContext.selectItemCallbacks.forEach( selectItemCallback => {
            selectItemCallback( ship );
        });
    }, []);

    // TODO: cache searchByFaction output to reuse instead of recompute
    const searchByFaction = useCallback((value: string) => {
        const selectedFaction = parseInt(value);
        if (selectedFaction === -1 ) {
            return setFilteredShips(() => ships);
        };
        setFilteredShips(() => ships.filter( (_, index) => shipList[index].faction.id === selectedFaction));
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