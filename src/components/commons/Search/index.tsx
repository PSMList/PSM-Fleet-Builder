import { baseUrl } from "@/App";
import ValidationInput from "@/components/commons/Inputs/ValidationInput";
import Items from "@/components/commons/Items";
import { useStore } from "@/data/store";
import { createMemo, createSignal, For, JSX } from "solid-js";
import Select from "../Inputs/Select";
import { ItemType } from "../Item";
import './Search.css';

export type SearchItemType = {
    search_field: string
    element: JSX.Element
    item: ItemType
}

type SearchProps = {
    additionalInputs?: JSX.Element
    placeholder: string
    items: SearchItemType[]
    defaultFactionID?: string
    defaultExtensionID?: string
}

const defaultSearchQuery = new RegExp('', 'i');

const Search = (props: SearchProps) => {
    
    const [ searchQuery, setQuery ] = createSignal(defaultSearchQuery);

    const [ factionFilter, setFactionFilter ] = createSignal(-1);
    const [ extensionFilter, setExtensionFilter ] = createSignal(-1);

    const { database } = useStore().databaseService;

    const factionOptions = createMemo(() => {
        const _factions = Array.from(database.factions.values());
        const _factionOptions = _factions.map( faction => ({
            value: faction.id.toString(),
            display: <span>
                <img src={ `${baseUrl}/img/flag/search/${faction.nameimg}.png` } />{ faction.defaultname }
            </span>
        }));
        _factionOptions.unshift({
            value: '-1',
            display: <span>
                <img />All factions
            </span>
        });

        return _factionOptions;
    });

    const extensionOptions = createMemo(() => {
        const _extensions = Array.from(database.extensions.values());
        console.log(_extensions);
        
        const _extensionOptions = _extensions.map( extension => ({
            value: extension.id.toString(),
            display: <span>
                <img src={ `${baseUrl}/img/logos/logo_${extension.short.replace('U', '')}.png` } />{ extension.name }
            </span>
        }));
        _extensionOptions.unshift({
            value: '-1',
            display: <span>
                <img />All expansions
            </span>
        });

        return _extensionOptions;
    })

    const searchByFaction = (factionID: string) => {
        setFactionFilter(() => parseInt(factionID));
    }

    const searchByExtension = (extensionID: string) => {
        setExtensionFilter(() => parseInt(extensionID));
    }

    const selectItems = createMemo(() => {
        const _factionFilter = factionFilter();
        const _extensionFilter = extensionFilter();

        if (_factionFilter === -1 && _extensionFilter === -1) {
            return props.items;
        }

        return props.items.filter( element => 
            (_factionFilter === -1 || element.item.faction.id === _factionFilter)
            &&
            (_extensionFilter === -1 || element.item.extension.id === _extensionFilter)
        );
    });
    
    const searchInItems = (value: string) => {
        setQuery(() => new RegExp(value, 'i'));
    }

    const content = () => {
        const _searchQuery = searchQuery();
        if (_searchQuery === defaultSearchQuery) {
            return <h3 class="search_info">
                Enter any text in the search bar to show items.
                <br />
                (leave blank and click search to show all)
            </h3>
        }

        const filteredItems: JSX.Element[] = [];

        for (const item of selectItems()) {
            if ( _searchQuery.test( item.search_field ) ) {
                filteredItems.push( item.element );
            }
        }

        if ( !filteredItems.length) {
            return <h3 class="search_info">No matching item.</h3>
        }

        return (
            <Items class="search_results">
                <For each={ filteredItems }>
                    {
                        filteredItem => filteredItem
                    }
                </For>
            </Items>
        );
    }

    return (
        <div class="search_container whitebox">
            <div class="search_inputs">
                <ValidationInput
                    type="text"
                    class="search_input"
                    placeholder={ props.placeholder }
                    onValidate={ searchInItems }
                    validationIcon="search"
                />
                <Select
                    defaultSelectText="Select faction"
                    class="search_faction"
                    onOptionSelect={ searchByFaction }
                    optionsList={
                        factionOptions()
                    }
                    defaultSelectOption={props.defaultFactionID}
                />
                <Select
                    defaultSelectText="Select expansion"
                    class="search_extension"
                    onOptionSelect={ searchByExtension }
                    optionsList={
                        extensionOptions()
                    }
                    defaultSelectOption={props.defaultExtensionID}
                />
                { props.additionalInputs }
            </div>
            { content() }
        </div>
    )
}

export default Search;