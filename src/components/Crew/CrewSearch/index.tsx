import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createRef } from "preact";
import { useCallback, useContext, useEffect, useMemo, useState } from "preact/hooks";
import { CrewItemsContext, CrewItemType, crewList } from "..";
import factions from "../../../factionData";
import Search, { SearchItemType } from "../../commons/Search";
import Select from "../../commons/Select";
import CrewItem from "../CrewItem";
import './CrewSearch.css';

type CrewSearchProps = {
    factionID: number
}

const CrewSearch = ({ factionID }: CrewSearchProps) => {

    const crews: SearchItemType[] = useMemo(() => crewList.map( crew => ({
        search_field: crew.fullname,
        element:
            <CrewItem
                data={ crew }
                actions={
                    <button onClick={ () => selectItem( crew ) }><FontAwesomeIcon icon={ faSquarePlus } /></button>
                }
            />
    })), []);
    
    const crewItemsContext = useContext(CrewItemsContext);
    
    const selectItem = useCallback( (crew: CrewItemType) => {
        crewItemsContext.selectItemCallbacks.forEach( selectItemCallback => {
            selectItemCallback( crew );
        });
    }, []);

    return (
        <>
            <Search
                placeholder="Search by crew name or ID"
                items={
                    crews
                }
            />
        </>
    );
}

export default CrewSearch;