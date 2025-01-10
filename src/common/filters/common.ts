import { useCollectionFilter } from './collection';
import { useCostSort } from '../sorts/cost';
import { useCustomFilter } from './custom';
import { useExtensionFilter } from './extension';
import { useFactionFilter } from './faction';
import { useRaritySort } from './rarity';

export function useCommonFilters() {
  const customFilter = useCustomFilter();
  const collectionsFilter = useCollectionFilter();

  return [customFilter, collectionsFilter];
}

export function useExtensionFilters() {
  const extensionFilter = useExtensionFilter();
  const commonFilters = useCommonFilters();

  return [extensionFilter, ...commonFilters];
}

export function useFactionFilters() {
  const factionsFilter = useFactionFilter();
  const extensionFilter = useExtensionFilters();

  return [factionsFilter, ...extensionFilter];
}

export function useCommonSorts() {
  const costSort = useCostSort();
  const raritySort = useRaritySort();

  return [...costSort, ...raritySort];
}
