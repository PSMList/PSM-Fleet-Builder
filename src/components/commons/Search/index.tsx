import ValidationInput from "@/components/commons/Inputs/ValidationInput";
import Items from "@/components/commons/Items";
import { createSignal, For, JSX } from "solid-js";
import './Search.css';

export type SearchItemType = {
    search_field: string
    element: JSX.Element
}

type SearchProps = {
    additionalInputs?: JSX.Element
    placeholder: string
    items: SearchItemType[]
}

const defaultSearchQuery = new RegExp('', 'i');

const Search = (props: SearchProps) => {
    
    const [ searchQuery, setQuery ] = createSignal(defaultSearchQuery);
    
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

        for (const item of props.items) {
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
                { props.additionalInputs }
            </div>
            { content() }
        </div>
    )
}

export default Search;