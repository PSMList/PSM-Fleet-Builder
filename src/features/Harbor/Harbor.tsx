import "./Harbor.scss";

import { Builder } from "@/common/Builder/Builder";
import { useCommonSorts, useCommonFilters } from "@/common/filters/common";
import { useFactionFilter } from "@/common/filters/faction";
import { useItemTypeFilter } from "@/common/filters/harbor";
import { useSortAsFilter } from "@/common/filters/sort";
import { useShipSorts } from "@/common/sorts/ship";
import { DisplayCard } from "@/common/Display/DisplayCard/DisplayCard";
import { SearchCard } from "@/common/Search/SearchCard/SearchCard";
import { Item } from "@/common/Item/ItemCard";
import { ItemCards } from "../items/ItemCards";
import { AddItems } from "@/common/Display/actions";

export function Harbor() {
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

  return (
    <Builder
      addItems={<AddItems type="items" />}
      filters={allFilters}
      displayItem={DisplaySubTypeItem}
      searchItem={SearchSubTypeItem}
      type="items"
    />
  );
}
