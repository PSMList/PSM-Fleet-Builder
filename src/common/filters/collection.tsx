import { createEffect, createSignal } from "solid-js";

import { useCollections } from "@/store/store";
import { FilterProps } from "../Search/Search";
import { Item } from "../Item/ItemCard";
import { Option, Select } from "../Select/Select";

export function useCollectionFilter(): FilterProps<Item> {
  const { collections } = useCollections();

  const [selectedCollectionId, setSelectedCollectionId] =
    createSignal<string>("-1");

  const [collectionsOptions, setCollectionsOptions] = createSignal(
    [] as (Option & { items?: number[] })[],
  );

  createEffect(() => {
    const _collections = collections.map((collection) => ({
      id: collection.name.toLowerCase().replace(/\W/g, "").replace(/\s/g, "-"),
      display: collection.name,
      items: collection.items.map((item) => item.id),
    }));

    if (!_collections.length) return [];

    setCollectionsOptions([
      {
        id: "-1",
        display: "No collection",
        items: undefined,
      },
      {
        id: "all",
        display: "All collections",
        items: Array.from(
          new Set(_collections.flatMap((collection) => collection.items)),
        ),
      },
      ..._collections,
    ]);
  });

  return {
    button: (
      <>
        {collections.length && (
          <Select
            defaultSelectText="Select collection"
            class="search_collection"
            options={collectionsOptions()}
            onOptionSelect={setSelectedCollectionId}
          />
        )}
      </>
    ),
    pipe: (items) => {
      const _selectedCollectionId = selectedCollectionId();
      if (_selectedCollectionId === "-1") return items;

      const filteredItems = collectionsOptions().find(
        (collection) => collection.id === _selectedCollectionId,
      )?.items;

      if (!filteredItems) return items;

      return items.filter((item) => filteredItems.includes(item.props.id));
    },
  };
}
