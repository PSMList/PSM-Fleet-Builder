import "./Harbor.scss";

import { Builder } from "@/common/Builder/Builder";
import { useCommonSorts, useCommonFilters } from "@/common/filters/common";
import { useExtensionFilter } from "@/common/filters/extension";
import { useFactionFilter } from "@/common/filters/faction";
import { useItemTypeFilter } from "@/common/filters/harbor";
import { useSortFilter } from "@/common/filters/sort";
import { useShipSorts } from "@/common/sorts/ship";
import { DisplayCard } from "@/common/Display/DisplayCard/DisplayCard";
import { SearchCard } from "@/common/Search/SearchCard/SearchCard";
import { Item } from "@/common/Item/ItemCard";
import { ItemCards } from "../items/ItemCards";

export function Harbor() {
  const commonSorts = useCommonSorts();
  const shipSorts = useShipSorts();

  const itemTypesFilter = useItemTypeFilter();
  const shipSortsFilter = useSortFilter([...commonSorts, ...shipSorts]);

  const factionFilter = useFactionFilter();
  const extensionFilter = useExtensionFilter();
  const commonFilters = useCommonFilters();

  const allFilters = [
    itemTypesFilter,
    factionFilter,
    extensionFilter,
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
      filters={allFilters}
      displayItem={DisplaySubTypeItem}
      searchItem={SearchSubTypeItem}
      type="items"
    />
  );
}
