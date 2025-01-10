import { Ship } from "@/store/data/ship";
import { UseSort } from "../filters/sort";
import { Icon } from "../Icon/Icon";
import { baseSvg } from "@/utils/config";

export function useShipSorts<T extends Ship>(): UseSort<T>[] {
  // cargo and masts
  return [
    {
      id: "cargo-sort-asc",
      display: (
        <span>
          <img src={`${baseSvg}/masts_nobg.svg`} />
          Cargo
          <Icon id="sort-numeric-up" />
        </span>
      ),
      sort: (a, b) => a.props.cargo - b.props.cargo,
    },
    {
      id: "cargo-sort-desc",
      display: (
        <span>
          <img src={`${baseSvg}/masts_nobg.svg`} />
          Cargo
          <Icon id="sort-numeric-down" />
        </span>
      ),
      sort: (a, b) => b.props.cargo - a.props.cargo,
    },
    {
      id: "masts-sort-asc",
      display: (
        <span>
          <img src={`${baseSvg}/cargo_nobg.svg`} />
          Masts
          <Icon id="sort-numeric-up" />
        </span>
      ),
      sort: (a, b) => a.props.masts - b.props.masts,
    },
    {
      id: "masts-sort-desc",
      display: (
        <span>
          <img src={`${baseSvg}/cargo_nobg.svg`} />
          Masts
          <Icon id="sort-numeric-down" />
        </span>
      ),
      sort: (a, b) => b.props.masts - a.props.masts,
    },
  ];
}
