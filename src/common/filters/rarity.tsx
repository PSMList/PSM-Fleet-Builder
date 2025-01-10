import { Rarity } from "@/store/data/rarity";
import { Icon } from "../Icon/Icon";
import { SearchItem } from "../Search/Search";
import { UseSort } from "./sort";

export function useRaritySort<T extends { rarity?: Rarity }>(): UseSort<T>[] {
  return [
    {
      id: "rarity-sort-asc",
      display: (
        <span>
          <Icon id="star" color="#E4C51F" />
          Rarity
          <Icon id="sort-alpha-up" />
        </span>
      ),
      sort: (a: SearchItem<T>, b: SearchItem<T>) => {
        if (!a.props.rarity || !b.props.rarity) return 0;

        return a.props.rarity.color.localeCompare(b.props.rarity.color);
      },
    },
    {
      id: "rarity-sort-desc",
      display: (
        <span>
          <Icon id="star" color="#E4C51F" />
          Rarity
          <Icon id="sort-alpha-down" />
        </span>
      ),
      sort: (a: SearchItem<T>, b: SearchItem<T>) => {
        if (!a.props.rarity || !b.props.rarity) return 0;

        return b.props.rarity.color.localeCompare(a.props.rarity.color);
      },
    },
  ];
}
