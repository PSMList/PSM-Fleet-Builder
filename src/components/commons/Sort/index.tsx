import { createEffect, createSignal, JSX } from "solid-js";
import Icon from "../Icon";

export enum SortState {
    NoSort,
    SortUp,
    SortDown
}

type SortStateType = {
    state: SortState
    title: string
    iconID: string
    next: SortStateType
}

type SortProps = {
    class: string
    onClick: (sortState: SortStateType) => void
    children: JSX.Element
}

export const SortUp: SortStateType = {
    state: SortState.SortUp,
    title: 'Sort up',
    iconID: 'sort-up',
    next: null as unknown as SortStateType,
}

export const SortDown: SortStateType = {
    state: SortState.SortDown,
    title: 'Sort down',
    iconID: 'sort-down',
    next: SortUp,
}

export const NoSort: SortStateType = {
    state: SortState.NoSort,
    title: 'No sort',
    iconID: 'sort',
    next: SortDown,
}

SortUp.next = NoSort;

const Sort = (props: SortProps) => {
    const [ sortState, setSortState ] = createSignal(NoSort);

    createEffect(() => {
        props.onClick(sortState());
    });

    return (
        <span
            class={ `filter ${props.class}` }
            onClick={ () => setSortState(prevSortState => prevSortState.next) }
        >
            <Icon iconID={ sortState().iconID } />
            { props.children }
        </span>
    );
};

export default Sort;