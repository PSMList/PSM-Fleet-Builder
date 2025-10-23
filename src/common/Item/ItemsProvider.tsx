import { createContext, createEffect, ParentProps, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { Item } from "./ItemCard";

export interface ItemsContextType<T extends Item> {
  items: T[];
  add: (item: T) => void;
  remove: (item: T) => void;
  clear: () => void;
}

export const ItemsContext = createContext({} as ItemsContextType<any>);

type ItemsProviderProps<T> = ParentProps & {
  items?: T[];
  onChange?: (items: T[]) => void;
};

export function ItemsProvider<T extends Item>(props: ItemsProviderProps<T>) {
  const [items, setItems] = createStore<T[]>([]);

  createEffect(() => {
    // only update items if their reference changes (i.e. force update like API call)
    if (!props.items || props.items === items) return;

    setItems(props.items!);
  });

  function editItems(edit: (edit: T[]) => void) {
    setItems(
      produce((items) => {
        edit(items);

        props.onChange?.(items);
      }),
    );
  }

  return (
    <ItemsContext.Provider
      value={{
        items,
        add(item) {
          editItems((_items) => {
            _items.push(item);
          });
        },
        remove(item) {
          editItems((_items) => {
            const itemIndex = items.findIndex((_item) => _item === item);

            if (itemIndex === -1) return;

            _items.splice(itemIndex, 1);
          });
        },
        clear() {
          editItems((_items) => {
            _items.length = 0;
          });
        },
      }}
    >
      {props.children}
    </ItemsContext.Provider>
  );
}

export function useItems<T extends Item>() {
  const context = useContext(ItemsContext) as ItemsContextType<T>;

  if (!context) {
    throw new Error("useItems must be used within a ItemsProvider");
  }

  return context;
}
