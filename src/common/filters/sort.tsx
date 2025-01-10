import { createSignal, JSX } from "solid-js";

import { Select } from "../Select/Select";
import { FilterProps, SearchItem } from "../Search/Search";
import { ExtractUnionTypes, Obj, UnionToIntersection } from "@/utils/types";
import { Icon } from "../Icon/Icon";

type SortPipe<T extends Obj> = (a: SearchItem<T>, b: SearchItem<T>) => number;

export type UseSort<T extends Obj> = {
  id: string;
  display: JSX.Element;
  sort: SortPipe<T>;
};

type ExtractSortTypes<U> = UnionToIntersection<
  U extends UseSort<infer V> ? ExtractUnionTypes<V> : never
>;

export type ExtractSorts<T> = T extends (infer U)[]
  ? ExtractSortTypes<U>
  : never;

export function useSortFilter<
  T extends ExtractSorts<U>,
  U extends UseSort<any>[] = any[],
>(sorts: U): FilterProps<T> {
  const [selectedSort, setSelectedSort] = createSignal("-1");

  const sortOptions = [
    {
      id: "-1",
      display: (
        <span>
          <Icon id="circle-xmark" />
          Default order
        </span>
      ),
      sort: () => 0,
    },
    ...sorts,
  ];

  return {
    button: (
      <Select
        defaultSelectText="Sort by"
        class="search_sort"
        onOptionSelect={setSelectedSort}
        options={sortOptions}
      />
    ),
    pipe: (items) => {
      const _selectedSort = selectedSort();

      if (_selectedSort === "-1") return items;

      const sortOption = sortOptions.find(
        (sortOption) => sortOption.id === _selectedSort,
      );

      if (!sortOption) return items;

      return items.sort(sortOption.sort);
    },
  };
}
