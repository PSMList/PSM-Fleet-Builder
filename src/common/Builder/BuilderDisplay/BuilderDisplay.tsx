import "./BuilderDisplay.scss";

import { Component, JSX } from "solid-js";

import { Display } from "@/common/Display/Display";
import { useItems } from "@/common/Item/ItemsProvider";
import { CollapseProvider } from "@/common/Collapse/CollapseProvider";
import { Item } from "@/common/Item/ItemCard";

export interface BuilderDisplayProps<T extends Item> {
  actions?: JSX.Element;
  header?: JSX.Element;
  displayItem: Component<{ item: T }>;
  type: string;
}

export function BuilderDisplay<T extends Item>(props: BuilderDisplayProps<T>) {
  const { items } = useItems<T>();

  function _items() {
    return items.map((item) => <props.displayItem item={item} />);
  }

  return (
    <CollapseProvider defaultCollapse={false}>
      <Display
        name={props.type}
        header={props.header}
        actions={props.actions}
        items={_items()}
      />
    </CollapseProvider>
  );
}
