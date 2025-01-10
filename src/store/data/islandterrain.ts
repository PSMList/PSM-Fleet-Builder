import { Item } from '@/common/Item/ItemCard';
import { apiUrl } from './api';

interface IslandTerrainDataItem {
  id: number;
  name: string;
  nameimg: string;
  idimagefullislandterrain: string;
  idimage80islandterrain: string;
  rules: string;
  slugname: string;
  descshort: string;
  official: 0 | 1;
}

export type IslandTerrain = Omit<Item, 'numid' | 'extension' | 'type'>;

export const islandTerrainDataPromise = fetch(`${apiUrl}/island/terrain`)
  .then((res) => res.json() as Promise<IslandTerrainDataItem[]>)
  .then((data) => {
    const islandData = new Map<number, IslandTerrain>();
    data.forEach((island) =>
      islandData.set(island.id, {
        id: island.id,
        name: island.name,
        fullname: island.name,
        custom: island.official ? 0 : 1,
        img: `islands/terrain_icons/x80/${island.nameimg}.png`,
        aptitude: island.rules,
      }),
    );
    return islandData;
  });
