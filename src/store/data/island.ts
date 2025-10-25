import { Item, ItemValue } from '@/common/Item/ItemCard';
import { apiUrl } from './api';
import { extensionDataPromise } from './extension';

interface IslandDataItem {
  id: number;
  idextension: number;
  numid: string;
  slugname: string;
  custom: 0 | 1;
  extIcon?: string;
  idimageheadsislandxl: string;
  idimagetailsislandxl: string;
  idimageheadsislandm: string;
  idimagetailsislandm: string;
  idimageiconisland: string;
  hasterrain: string;
  oncardtext: string;
  notes: string;
  island_terrain_id_1?: number;
  island_terrain_id_2?: number;
}

export type IslandItem = Item & {
  slugname: string;
};

export const islandDataPromise = fetch(`${apiUrl}/island?custom=include`)
  .then((res) => res.json() as Promise<IslandDataItem[]>)
  .then(async (data) => {
    const islandData = new Map<number, IslandItem>();
    const extensionData = await extensionDataPromise;

    data.forEach((island) => {
      const extension = extensionData.get(island.idextension)!;

      const imgPath = `islands/${island.custom ? 'custom' : 'official'}/icon`;
      const name = `${extension.short}${island.numid}`;

      islandData.set(island.id, {
        type: ItemValue.Island,
        id: island.id,
        extension,
        custom: island.custom,
        name,
        numid: island.numid,
        fullname: name,
        aptitude: island.oncardtext,
        img: `${imgPath}/${island.extIcon}`,
        slugname: island.slugname,
      });
    });
    return islandData;
  });
