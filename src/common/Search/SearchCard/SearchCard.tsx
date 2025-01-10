import { AddItem } from "@/common/Item/actions";
import { ExtendedCard, Item } from "@/common/Item/ItemCard";

export function SearchCard<T extends Item>(props: {
  component: ExtendedCard<T>;
  item: T;
}) {
  return (
    <props.component
      item={props.item}
      actions={<AddItem item={props.item} />}
    />
  );
}
