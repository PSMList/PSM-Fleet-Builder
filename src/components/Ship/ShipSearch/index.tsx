import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useContext, useEffect, useMemo, useState } from "preact/hooks";
import { ShipItemsContext, ShipItemType, shipList } from "..";
import factions from "../../../factionData";
import Search, { SearchItemType } from "../../commons/Search";
import Select from "../../commons/Select";
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
    
    const shipItemsContext = useContext(ShipItemsContext);
    
    const selectItem = useCallback( (ship: ShipItemType) => {
        shipItemsContext.selectItemCallbacks.forEach( selectItemCallback => {
            selectItemCallback( ship );
        });
    }, []);

    return (
        <>
            <Search
                placeholder="Search by ship name or ID"
                items={
                    ships
                }
            />
        </>
    );
}

export default ShipSearch;