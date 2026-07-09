import { Item, ItemsType } from "@/common/Item/ItemCard";
import { ItemsProvider, useItems } from "@/common/Item/ItemsProvider";
import { Builder } from "@/common/Builder/Builder";
import { DisplayCard } from "@/common/Display/DisplayCard/DisplayCard";
import { SearchCard } from "@/common/Search/SearchCard/SearchCard";
import { AddItems } from "@/common/Display/actions";
import { useCommonSorts, useCommonFilters } from "@/common/filters/common";
import { useFactionFilter } from "@/common/filters/faction";
import { useItemTypeFilter } from "@/common/filters/harbor";
import { useSortAsFilter } from "@/common/filters/sort";
import { useShipSorts } from "@/common/sorts/ship";
import { useModal } from "@/common/Modal/ModalProvider";
import { IconButton } from "@/common/Icon/IconButton/IconButton";
import { ItemCards } from "../items/ItemCards";

export function AddTypedItems(props: { type: ItemsType }) {
  const commonSorts = useCommonSorts();
  const shipSorts = useShipSorts();

  const itemTypesFilter = useItemTypeFilter();
  const shipSortsFilter = useSortAsFilter([...commonSorts, ...shipSorts]);

  const factionFilter = useFactionFilter();
  const commonFilters = useCommonFilters();

  const allFilters = [
    itemTypesFilter,
    factionFilter,
    ...commonFilters,
    shipSortsFilter,
  ];

  function DisplaySubTypeItem(props: { item: Item }) {
    const Item = ItemCards[props.item.type];
    return <DisplayCard item={props.item} component={Item} />;
  }

  function SearchSubTypeItem(props: { item: Item }) {
    const Item = ItemCards[props.item.type];
    return <SearchCard item={props.item} component={Item} />;
  }

  const modal = useModal();
  const { items } = useItems();

  const onAddItems = () => {
    modal.show({
      id: `add-${props.type}`,
      title: `Add ${props.type}`,
      content: () => (
        <ItemsProvider items={items}>
          <Builder
            addItems={<AddItems type={props.type} />}
            type={props.type}
            filters={allFilters}
            displayItem={DisplaySubTypeItem}
            searchItem={SearchSubTypeItem}
          />
        </ItemsProvider>
      ),
      onClose: true,
    });
  };

  return (
    <IconButton id="search-plus" onClick={onAddItems} primary>
      Add {props.type}
    </IconButton>
  );
}
