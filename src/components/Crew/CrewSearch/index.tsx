import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { CrewItemsContext, CrewItemType, crewList } from "..";
import factions from "../../../data/faction";
import Select from "../../commons/Inputs/Select";
import Search, { SearchItemType } from "../../commons/Search";
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
                    <button onClick={ () => selectItem( crew ) }><i class="fas fa-plus-square" /></button>
                }
            />
    })), []);

    const selectFactions = useMemo(() => {
        const factionsList = Object.values(factions);
        factionsList.unshift({ id: -1, img: '', name: 'All factions' });
        return factionsList;
    }, []);

    const [ filteredCrews, setFilteredCrews ] = useState(crews);
    
    const crewItemsContext = useContext(CrewItemsContext);
    
    const selectItem = useCallback( (crew: CrewItemType) => {
        crewItemsContext.selectItemCallbacks.forEach( selectItemCallback => {
            selectItemCallback( crew );
        });
    }, []);

    // TODO: cache searchByFaction output to reuse instead of recompute
    const searchByFaction = useCallback((value: string) => {
        const selectedFaction = parseInt(value);
        if (selectedFaction === -1 ) {
            return setFilteredCrews(() => crews);
        };
        
        setFilteredCrews(() => crews.filter( (_, index) => crewList[index].faction.id === selectedFaction));
    }, []);

    return (
        <>
            <Search
                placeholder="Search by crew name or ID"
                additionalInputs={
                    <>
                        <Select
                            defaultSelectText="Select faction"
                            className="search_faction"
                            onOptionSelect={ searchByFaction }
                            optionsList={
                                selectFactions.map( faction => ({ value: faction.id.toString(), display: <><img src={ faction.img } />{ faction.name }</> }) )
                            }
                            defaultSelectOption={ factionID.toString() }
                        />
                    </>
                }
                items={
                    filteredCrews
                }
            />
        </>
    );
}

export default CrewSearch;