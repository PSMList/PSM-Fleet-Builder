import "./BuilderSearch.scss";

import { Component, createEffect, createSignal } from "solid-js";

import { FilterProps, Search, SearchItem } from "@/common/Search/Search";
import { isOwn } from "@/utils/config";
import { useDb } from "@/store/store";
import { ItemsType, Item } from "@/common/Item/ItemCard";

export interface BuilderSearchProps<T extends Item> {
  filters?: FilterProps<any>[];
  searchItem: Component<{ item: T }>;
  name: ItemsType;
  placeholder?: string;
}

export function BuilderSearch<T extends Item>(props: BuilderSearchProps<T>) {
  if (!isOwn) return;

  const { db } = useDb();

  const [items, setItems] = createSignal<SearchItem<any>[]>([]);

  createEffect(() => {
    const subType = db[props.name];

    if (!subType) return;
    const dbItems = Array.from(subType.values() as MapIterator<T>);

    setItems(() =>
      dbItems.map((item) => {
        return {
          item: <props.searchItem item={item} />,
          props: item,
        };
      }),
    );
  });

  return (
    <Search
      filters={props.filters}
      items={items()}
      placeholder={props.placeholder || `Search ${props.name} by name or ID`}
    />
  );
}
