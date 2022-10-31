import { useState } from "preact/hooks";
import { JSX } from 'preact/jsx-runtime';
import Items from '../Items';
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
const defaultSearchQueryString = defaultSearchQuery.toString();

let lastCall: number | undefined;

const Search = ({ placeholder, items, additionalInputs }: SearchProps) => {
    
    const [ searchQuery, setQuery ] = useState(defaultSearchQuery);
    
    const searchInItems = (event: Event) => {
        // throttle for 1.5s
        clearTimeout(lastCall);
        lastCall = setTimeout(() => {
            setQuery(() => new RegExp((event.target as HTMLInputElement).value, 'i'));
        }, 1500);
    }

    const content = (() => {
        if (searchQuery.toString() === defaultSearchQueryString) {
            return <h3 class="search_info">Enter any text in the search bar to show items.</h3>
        }

        const filteredItems: JSX.Element[] = [];
        for (const item of items) {
            if ( searchQuery.test( item.search_field ) ) {
                filteredItems.push( item.element );
            }
        }

        if ( !filteredItems.length) {
            return <h3 class="search_info">No matching item.</h3>
        }

        return (
            <Items class="search_results">
                { filteredItems }
            </Items>
        );
    })();

    return (
        <div class="search_container whitebox">
            <div class="search_inputs">
                <input
                    type="text"
                    class="search_input"
                    placeholder={ placeholder }
                    onChange={ searchInItems }
                />
                { additionalInputs }
            </div>
            { content }
        </div>
    )
}

export default Search;