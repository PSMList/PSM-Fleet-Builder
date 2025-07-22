import { createSignal } from "solid-js";

import { useDb } from "@/store/store";
import { Select } from "../Select/Select";
import { baseImg } from "@/utils/config";
import { FilterProps } from "../Search/Search";
import { Faction } from "@/store/data/faction";
import { LazyImg } from "../LazyImg/LazyImg";

export function useFactionFilter(): FilterProps<{ faction?: Faction }> {
  const { db } = useDb();

  const [selectedFactionId, setSelectedFactionId] = createSignal("-1");

  function factionsOptions() {
    const factions = Array.from(db.factions.values());

    factions.unshift({
      id: -1,
      name: "All factions",
      icon: "",
    } as Faction);

    return factions.map((faction) => ({
      id: faction.id.toString(),
      display: (
        <span>
          <LazyImg
            class="faction"
            src={faction.icon ? `${baseImg}/${faction.icon}` : undefined}
            alt=""
            width="24px"
            height="15px"
          />
          {faction.name}
        </span>
      ),
    }));
  }

  return {
    button: (
      <Select
        defaultSelectText="Select faction"
        class="search_faction"
        onOptionSelect={setSelectedFactionId}
        options={factionsOptions()}
      />
    ),
    pipe: (items) => {
      const _selectedFactionId = selectedFactionId();
      if (_selectedFactionId === "-1") return items;

      const selectedFaction = parseInt(_selectedFactionId);

      return items.filter((item) => item.props.faction?.id === selectedFaction);
    },
  };
}
