import { IconButton } from "@/common/Icon/IconButton/IconButton";
import { Item } from "./ItemCard";
import { useItems } from "./ItemsProvider";
import { isOwn } from "@/utils/config";

type ItemProps<T extends Item> = {
  item: T;
};

export function AddItem<T extends Item>(props: ItemProps<T>) {
  const { add } = useItems();

  return <IconButton id="plus-square" onClick={() => add(props.item)} />;
}

export function DeleteItem<T extends Item>(props: ItemProps<T>) {
  if (!isOwn) return;

  const { remove } = useItems();

  return <IconButton id="trash" onClick={() => remove(props.item)} />;
}
