import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useContext, useEffect, useMemo, useState } from "preact/hooks";
import { ShipItemsContext, ShipItemType, shipList } from "..";
import factions from "../../../factionData";
import Search, { SearchItemType } from "../../commons/Search";
import Select from "../../commons/Inputs/Select";
import ShipItem from "../ShipItem";
import './ShipSearch.css';


const ShipSearch = () => {

    const ships: SearchItemType[] = useMemo(() => shipList.map( ship => ({
        search_field: ship.fullname,
        element:
            <ShipItem
                data={ ship }
                actions={
                    <button onClick={ () => selectItem( ship ) }><FontAwesomeIcon icon={ faSquarePlus } /></button>
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
        console.log(factions[selectedFaction]);
        
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