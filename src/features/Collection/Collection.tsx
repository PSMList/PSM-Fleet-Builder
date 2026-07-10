import "./Collection.scss";

import { createEffect, createMemo, For, Show } from "solid-js";
import { produce } from "solid-js/store";

import { BuilderDisplay } from "@/common/Builder/BuilderDisplay/BuilderDisplay";
import { DisplayCard } from "@/common/Display/DisplayCard/DisplayCard";
import { Item, ITEMS_TYPES, ItemsTypesMap } from "@/common/Item/ItemCard";
import { ItemsProvider } from "@/common/Item/ItemsProvider";
import { useCollections } from "@/store/services/collection";
import { slugname } from "@/utils/config";
import { ItemCards } from "../items/ItemCards";
import { AddTypedItems } from "./actions";

export function CollectionBuilder() {
  const DisplaySubTypeItem = (props: { item: Item }) => {
    const Item = ItemCards[props.item.type];

    return <DisplayCard item={props.item} component={Item} />;
  };

  const { collections, setCollections } = useCollections();

  const collection = createMemo(() =>
    collections.find((c) => c.slugname === slugname),
  );

  createEffect(() => {
    const current = collection();

    if (current) {
      document.body.querySelector("h1")!.innerText = current.name;
    }
  });

  return (
    <Show when={collection()}>
      {(collection) => (
        <For each={ITEMS_TYPES}>
          {(type) => {
            const items = collection().items.filter(
              (item) => item.type === ItemsTypesMap[type],
            );

            return (
              <div class="main_container" id={type}>
                <ItemsProvider
                  items={items}
                  onChange={(items) => {
                    setCollections(
                      (c) => c.slugname === slugname,
                      produce((_collection) => {
                        _collection.items = items;
                      }),
                    );
                  }}
                >
                  <BuilderDisplay
                    addItems={<AddTypedItems type={type} />}
                    displayItem={DisplaySubTypeItem}
                    type={type}
                    collapsed
                  />
                </ItemsProvider>
              </div>
            );
          }}
        </For>
      )}
    </Show>
  );
}
