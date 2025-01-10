import { Icon } from "../Icon/Icon";
import { UseSort } from "../filters/sort";

export function useCostSort<T extends { points: number }>(): UseSort<T>[] {
  return [
    {
      id: "cost-sort-asc",
      display: (
        <span>
          <Icon id="coins" /> Cost <Icon id="sort-numeric-up" />
        </span>
      ),
      sort: (a, b) => {
        return a.props.points - b.props.points;
      },
    },
    {
      id: "cost-sort-desc",
      display: (
        <span>
          <Icon id="coins" /> Cost <Icon id="sort-numeric-down" />
        </span>
      ),
      sort: (a, b) => {
        return b.props.points - a.props.points;
      },
    },
  ];
}
