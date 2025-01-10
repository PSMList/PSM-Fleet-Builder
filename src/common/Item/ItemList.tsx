import "./ItemList.scss";

import { JSX, splitProps } from "solid-js";

type ItemListProps = { collapsed?: boolean } & JSX.IntrinsicAttributes &
  JSX.HTMLAttributes<HTMLUListElement>;

export function ItemList(props: ItemListProps) {
  const [localProps, ulProps] = splitProps(props, [
    "class",
    "classList",
    "collapsed",
  ]);

  return (
    <ul
      {...ulProps}
      classList={{
        items: true,
        expanded: !localProps.collapsed,
        collapsed: localProps.collapsed,
        [localProps.class ?? ""]: true,
        ...localProps.classList,
      }}
    >
      {props.children}
    </ul>
  );
}
