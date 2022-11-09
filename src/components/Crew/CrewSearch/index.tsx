import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { CrewItemsContext, CrewItemType, crewList } from "..";
import { onlyDisplay } from "../../../app";
import extensions from "../../../data/extension";
import factions from "../../../data/faction";
import IconButton from "../../commons/IconButton";
import Select from "../../commons/Inputs/Select";
import Search, { SearchItemType } from "../../commons/Search";
import CrewItem from "../CrewItem";
import './CrewSearch.css';

type CrewSearchProps = {
    factionID?: string
    extensionID?: string
}

const selectFactions = Object.values(factions);
selectFactions.unshift({ id: -1, img: '', name: 'All factions' });
const selectFactionsOptions = selectFactions.map( faction => ({ value: faction.id.toString(), display: <><img src={ faction.img } />{ faction.name }</> }) )

const selectExtensions = Object.values(extensions);
selectExtensions.unshift({ id: -1, img: '', name: 'All extensions', short: '' });
const selectExtensionsOptions = selectExtensions.map( extension => ({ value: extension.id.toString(), display: <><img src={ extension.img } />{ extension.name }</> }) )

const CrewSearch = ({ factionID = '-1', extensionID = '-1' }: CrewSearchProps) => {
    if (onlyDisplay) return <></>;

    const [ factionFilter, setFactionFilter ] = useState(-1);
    const [ extensionFilter, setExtensionFilter ] = useState(-1);
    
    const crewItemsContext = useContext(CrewItemsContext);
    
    const selectItem = useCallback( (crew: CrewItemType) => {
        crewItemsContext.selectItemCallbacks.forEach( selectItemCallback => {
            selectItemCallback( crew );
        });
    }, []);

    const crews: SearchItemType[] = useMemo(() => crewList.map( crew => ({
        search_field: crew.fullname,
        element:
            <CrewItem
                data={ crew }
                actions={
                    <IconButton iconID="plus-square" onClick={ () => selectItem( crew ) } />
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
    const filteredCrews = (() => {
        if (factionFilter === -1 && extensionFilter === -1) {
            return crews;
        };
        const filteredShips = [];
        for (const index in crews) {
            if (
                (factionFilter === -1 || crewList[index].faction.id === factionFilter)
                &&
                (extensionFilter === -1 || crewList[index].extension.id === extensionFilter)
            ) {
                filteredShips.push(crews[index]);
            }
        }
        return filteredShips;
    })();

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
                                selectFactionsOptions
                            }
                            defaultSelectOption={ factionID }
                        />
                        <Select
                            defaultSelectText="Select extension"
                            className="search_extension"
                            onOptionSelect={ searchByExtension }
                            optionsList={
                                selectExtensionsOptions
                            }
                            defaultSelectOption={ extensionID }
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