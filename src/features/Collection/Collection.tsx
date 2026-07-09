import "./Collection.scss";

import { For } from "solid-js";
import { produce } from "solid-js/store";

import { BuilderDisplay } from "@/common/Builder/BuilderDisplay/BuilderDisplay";
import { DisplayCard } from "@/common/Display/DisplayCard/DisplayCard";
import { Item, ITEMS_TYPES, ItemsTypesMap } from "@/common/Item/ItemCard";
import { ItemsProvider } from "@/common/Item/ItemsProvider";
import { useCollections } from "@/store/services/collection";
import { ItemCards } from "../items/ItemCards";
import { AddTypedItems } from "./actions";

export function CollectionBuilder() {
  const DisplaySubTypeItem = (props: { item: Item }) => {
    const Item = ItemCards[props.item.type];

    return <DisplayCard item={props.item} component={Item} />;
  };

  const { collection, setCollection } = useCollections();

  return (
    <For each={ITEMS_TYPES}>
      {(type) => {
        const items = collection.items.filter(
          (item) => item.type === ItemsTypesMap[type],
        );

        return (
          <div class="main_container" id={type}>
            <ItemsProvider
              items={items}
              onChange={(items) => {
                setCollection(
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
  );
}
