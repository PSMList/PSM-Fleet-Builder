import { createSignal } from "solid-js";

import { Select } from "../Select/Select";
import { FilterProps } from "../Search/Search";
import { ItemValue } from "../Item/ItemCard";

export function useItemTypeFilter(): FilterProps<{ type: ItemValue }> {
  const [selectedItemTypeId, setSelectedItemTypeId] = createSignal("-1");

  function itemTypeOptions() {
    const factions = Object.entries(ItemValue).filter(
      ([, value]) => typeof value === "string",
    );

    factions.unshift(["-1", "All types"]);

    return factions.map(([id, label]) => ({
      id,
      display: label,
    }));
  }

  return {
    button: (
      <Select
        defaultSelectText="Select item type"
        class="search_item_typr"
        onOptionSelect={setSelectedItemTypeId}
        options={itemTypeOptions()}
      />
    ),
    pipe: (items) => {
      const _selectedItemTypeId = selectedItemTypeId();
      if (_selectedItemTypeId === "-1") return items;

      const selectedItemType = parseInt(_selectedItemTypeId);

      return items.filter((item) => item.props.type === selectedItemType);
    },
  };
}
