import { baseUrl, onlyDisplay } from "@/App";
import IconButton from "@/components/commons/IconButton";
import Select from "@/components/commons/Inputs/Select";
import Search, { SearchItemType } from "@/components/commons/Search";
import { CrewItemsContext, CrewItemType, crewList } from "@/components/Crew";
import CrewItem from "@/components/Crew/CrewItem";
import extensionsData from "@/data/extension";
import factionsData from "@/data/faction";
import { createSignal, useContext } from "solid-js";
import './CrewSearch.css';

type CrewSearchProps = {
    factionID?: string
    extensionID?: string
}

const selectFactions = Object.values(factionsData);
const selectFactionsOptions = selectFactions.map( faction => ({ value: faction.id.toString(), display: <span><img src={ /*@once*/`${baseUrl}/img/flag/search/${faction.nameimg}.png` } />{ /*@once*/faction.defaultname }</span> }) )
selectFactionsOptions.unshift({ value: '-1', display: <span><img />All factions</span> });

const selectExtensions = Object.values(extensionsData);
const selectExtensionsOptions = selectExtensions.map( extension => ({ value: extension.id.toString(), display: <span><img src={ /*@once*/`${baseUrl}/img/logos/logo_${extension.short.replace('U', '')}.png` } />{ /*@once*/extension.name }</span> }) )
selectExtensionsOptions.unshift({ value: '-1', display: <span><img />All expansions</span> });

const CrewSearch = (props: CrewSearchProps) => {
    if (onlyDisplay) return <></>;

    const [ factionFilter, setFactionFilter ] = createSignal(-1);
    const [ extensionFilter, setExtensionFilter ] = createSignal(-1);
    
    const crewItemsContext = useContext(CrewItemsContext);
    
    const selectItem = (crew: CrewItemType) => {
        crewItemsContext.selectItemCallbacks.forEach( selectItemCallback => {
            selectItemCallback( crew );
        });
    };

    const crews: SearchItemType[] = crewList.map( crew => ({
        search_field: crew.fullname,
        element:
            <CrewItem
                data={ crew }
                actions={
                    <IconButton
                        iconID="plus-square"
                        onClick={ () => selectItem( crew ) }
                        title="Add crew"
                    />
                }
            />
    }));

    const searchByFaction = (factionID: string) => {
        setFactionFilter(() => parseInt(factionID));
    };

    const searchByExtension = (extensionID: string) => {
        setExtensionFilter(() => parseInt(extensionID));
    };

    const filteredCrews = () => {
        if (factionFilter() === -1 && extensionFilter() === -1) {
            return crews;
        };
        const filteredShips = [];
        for (const index in crews) {
            if (
                (factionFilter() === -1 || crewList[index].faction.id === factionFilter())
                &&
                (extensionFilter() === -1 || crewList[index].extension.id === extensionFilter())
            ) {
                filteredShips.push(crews[index]);
            }
        }
        return filteredShips;
    };

    return (
        <Search
            placeholder="Search by crew name or ID"
            additionalInputs={
                <>
                    <Select
                        defaultSelectText="Select faction"
                        class="search_faction"
                        onOptionSelect={ searchByFaction }
                        optionsList={
                            selectFactionsOptions
                        }
                        defaultSelectOption={ props.factionID || '-1' }
                    />
                    <Select
                        defaultSelectText="Select expansion"
                        class="search_extension"
                        onOptionSelect={ searchByExtension }
                        optionsList={
                            selectExtensionsOptions
                        }
                        defaultSelectOption={ props.extensionID || '-1' }
                    />
                </>
            }
            items={
                filteredCrews()
            }
        />
    );
}

export default CrewSearch;