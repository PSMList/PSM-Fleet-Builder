import { querySelector } from "@/utils/dom";
import { IconButton } from "@/common/Icon/IconButton/IconButton";
import { useCollapse } from "../Collapse/CollapseProvider";
import { useItems } from "../Item/ItemsProvider";
import { useModal } from "../Modal/ModalProvider";
import { isOwn } from "@/utils/config";
import { ItemsType } from "../Item/ItemCard";

export function Collapse() {
  const [collapsed, toggleCollapse] = useCollapse();

  return (
    <IconButton
      id={collapsed() ? "expand-arrows-alt" : "compress-arrows-alt"}
      title={collapsed() ? "Expand cards" : "Compress cards"}
      onClick={toggleCollapse}
    />
  );
}

interface AddItemsProps {
  type: ItemsType;
}

export function AddItems(props: AddItemsProps) {
  if (!isOwn) return;

  function scrollToDisplayBottom() {
    const search_container = querySelector(
      document,
      `#${props.type} > .search_container`,
    );

    if (!search_container) return;

    const input = querySelector(
      search_container,
      "& > .search_inputs > .search_input > input",
    );

    if (!input) return;

    search_container.scrollIntoView({ behavior: "smooth" });
    input.focus();
  }

  return (
    <IconButton id="search-plus" onClick={scrollToDisplayBottom} primary>
      Add {props.type}
    </IconButton>
  );
}

interface ClearProps {
  name: string;
}

export function Clear(props: ClearProps) {
  if (!isOwn) return;

  const { clear } = useItems();

  const modal = useModal();

  function clearItems() {
    modal.show({
      id: `clear-${props.name}`,
      title: `Are you will to clear these ${props.name}?`,
      prompt: true,
      onClose(result) {
        if (result) clear();
      },
    });
  }

  return (
    <IconButton
      id="eraser"
      onClick={clearItems}
      title={`Clear ${props.name}`}
    />
  );
}
