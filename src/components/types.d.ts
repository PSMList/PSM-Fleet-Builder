import { SearchItemType } from "./commons/Search"

type OptionElement = {
    value: string,
    display: JSX.Element
}

export type SearchStore<T> = {
    elements: SearchItemType[]
    factionOptions: OptionElement[]
    extensionOptions: OptionElement[]
}