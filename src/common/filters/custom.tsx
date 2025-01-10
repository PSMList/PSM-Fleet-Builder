import { createSignal } from "solid-js";

import { Select } from "../Select/Select";
import { FilterProps } from "../Search/Search";
import { Item } from "../Item/ItemCard";

const Custom = {
  Both: "2",
  Official: "0",
  Custom: "1",
} as const;

export function useCustomFilter(): FilterProps<Item> {
  const [selectedCustomId, setSelectedCustomId] = createSignal<"0" | "1" | "2">(
    Custom.Both,
  );

  function customOptions() {
    return Object.entries(Custom).map(([display, id]) => ({ id, display }));
  }

  return {
    button: (
      <Select
        defaultSelectText="Select custom"
        class="search_custom"
        onOptionSelect={setSelectedCustomId}
        options={customOptions()}
      />
    ),
    pipe: (items) => {
      const _selectedCustomId = selectedCustomId();
      if (_selectedCustomId === Custom.Both) return items;

      const selectedCustom = parseInt(_selectedCustomId);

      return items.filter((item) => item.props.custom === selectedCustom);
    },
  };
}
