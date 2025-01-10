import { DeleteItem } from "@/common/Item/actions";
import { ExtendedCard, Item } from "@/common/Item/ItemCard";

export function DisplayCard<T extends Item>(props: {
  component: ExtendedCard<T>;
  item: T;
}) {
  return (
    <props.component
      item={props.item}
      actions={<DeleteItem item={props.item} />}
    />
  );
}
