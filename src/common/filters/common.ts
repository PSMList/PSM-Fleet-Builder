import { useCollectionFilter } from './collection';
import { useCostSort } from '../sorts/cost';
import { useCustomFilter } from './custom';
import { useExtensionFilter } from './extension';
import { useRaritySort } from './rarity';

export function useCommonFilters() {
  const extensionFilter = useExtensionFilter();
  const customFilter = useCustomFilter();
  const collectionsFilter = useCollectionFilter();

  return [extensionFilter, customFilter, collectionsFilter];
}

export function useCommonSorts() {
  const costSort = useCostSort();
  const raritySort = useRaritySort();

  return [...costSort, ...raritySort];
}
