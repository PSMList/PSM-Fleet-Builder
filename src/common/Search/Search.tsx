import "./Search.scss";

import { For, JSX, Show, createEffect, createSignal, onMount } from "solid-js";

import { IconButton } from "@/common/Icon/IconButton/IconButton";
import { Input } from "../Input/Input";
import { CollapseProvider, useCollapse } from "../Collapse/CollapseProvider";
import { Item } from "../Item/ItemCard";
import { ItemList } from "../Item/ItemList";
import { Collapse } from "../Display/actions";
import {
  ExtractUnionTypes as ExtractUnion,
  Obj,
  UnionToIntersection,
} from "@/utils/types";
import { createStore } from "solid-js/store";

export interface SearchItem<T extends Obj> {
  item: () => JSX.Element;
  props: Item & T;
}

export type Filter<T extends Obj> = (items: SearchItem<T>[]) => SearchItem<T>[];

export type FilterProps<T extends Obj> = {
  button: JSX.Element;
  pipe: Filter<T>;
};

type ExtractFilterItems<U> = UnionToIntersection<
  U extends FilterProps<infer V> ? ExtractUnion<V> : never
>;

export type ExtractFilters<T> = T extends (infer U)[]
  ? ExtractFilterItems<U>
  : never;

export type SearchProps<
  T extends U & Item,
  U extends ExtractFilters<V>,
  V extends FilterProps<any>[],
> = {
  filters?: V;
  items: SearchItem<T>[];
  placeholder: string;
};

function _Search<
  T extends U,
  U extends ExtractFilters<V>,
  V extends FilterProps<any>[],
>(props: SearchProps<T, U, V>) {
  const [hideFilters, setHideFilters] = createSignal(true);
  const [collapsed] = useCollapse();
  const [searched, setSearched] = createSignal(false);
  const [searchedItems, setSearchedItems] = createStore<typeof props.items>([]);

  let inputElementRef!: HTMLInputElement;

  const searchPipe: Filter<T> = (items) => {
    const query = inputElementRef.value;

    if (query.length < 2) {
      inputElementRef.setCustomValidity(
        "Search query needs at least 2 characters.",
      );
      inputElementRef.reportValidity();

      return [];
    }

    inputElementRef.setCustomValidity("");

    const regex = new RegExp(query, "i");

    return (
      items
        .filter((item) => regex.test(item.props.fullname))
        // show official items first
        .sort((a, b) => a.props.custom - b.props.custom)
    );
  };

  function searchInItems() {
    setSearchedItems(() => searchPipe(props.items));
  }

  const pipeFilters: Filter<U>[] = [];
  const elementFilters: JSX.Element[] = [];

  for (const { pipe, button: element } of props.filters ?? []) {
    pipeFilters.push(pipe);
    elementFilters.push(element);
  }

  const [filteredItems, setFilteredItems] = createStore<typeof props.items>([]);

  createEffect(() => {
    let newItems = [...searchedItems];

    for (const pipe of pipeFilters) {
      newItems = pipe(newItems);

      if (!newItems.length) {
        break;
      }
    }

    setFilteredItems(() => newItems);
    setSearched(() => true);
  });

  onMount(() => {
    setSearched(() => false);
  });

  return (
    <div class="search_container whitebox">
      <div class="search_inputs">
        <Input
          type="text"
          ref={inputElementRef}
          class="search_input"
          placeholder={props.placeholder}
          onChange={searchInItems}
        />
        <IconButton
          id="search"
          title="Search"
          onClick={searchInItems}
          primary
        />
        <Collapse />
        <IconButton
          class="toggle_filters"
          id="filter"
          onClick={() => setHideFilters((previous) => !previous)}
        />
      </div>
      <div classList={{ search_filters: true, hide: hideFilters() }}>
        {elementFilters}
      </div>
      <ItemList
        collapsed={collapsed()}
        classList={{
          search_results: true,
          no_result: !filteredItems.length,
        }}
      >
        <For
          fallback={
            <Show
              when={searched()}
              fallback={
                <li>Enter any text in the search bar to show items.</li>
              }
            >
              <li>No item found.</li>
            </Show>
          }
          each={filteredItems}
        >
          {({ item }) => item()}
        </For>
      </ItemList>
    </div>
  );
}

export function Search<
  T extends U,
  U extends ExtractFilters<V>,
  V extends FilterProps<any>[],
>(props: SearchProps<T, U, V>) {
  return (
    <CollapseProvider>
      <_Search {...props} />
    </CollapseProvider>
  );
}
