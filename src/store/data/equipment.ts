/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Item, ItemValue } from '@/common/Item/ItemCard';
import { apiUrl } from './api';
import { extensionDataPromise } from './extension';
import { rarityDataPromise, Rarity } from './rarity';

interface EquipmentDataItem {
  id: number;
  idrarity: number;
  idextension: number;
  name: string;
  numid: string;
  points: number;
  defaultaptitude: string;
  custom: 0 | 1;
  idimagefullequipment: number;
  idimage80equipment: number;
  idimage30equipment: number;
  coinvalues: string;
  aptitudelocale: string;
  lorelocale: string;
  authorsnote: string;
  defaultlore: string;
  released: boolean;
  collectable: boolean;
  lookingforbetterpic: boolean;
}

export type Equipment = Item & {
  rarity: Rarity;
  points: number;
};

export const equipmentDataPromise = fetch(`${apiUrl}/equipment?custom=include`)
  .then((res) => res.json() as Promise<EquipmentDataItem[]>)
  .then(async (data) => {
    const extensionData = await extensionDataPromise;
    const rarityData = await rarityDataPromise;
    const equipmentData = new Map<number, Equipment>();

    data.forEach((item) => {
      const extension = extensionData.get(item.idextension)!;
      const rarity = rarityData.get(item.idrarity)!;

      equipmentData.set(item.id, {
        type: ItemValue.Equipment,
        id: item.id,
        img: `gameicons/x80/${extension.short}/${item.numid}.jpg`,
        rarity,
        extension,
        numid: item.numid,
        name: item.name,
        fullname: `${extension.short}${item.numid} ${item.name}`,
        points: item.points,
        aptitude: item.defaultaptitude,
        custom: item.custom,
      });
    });
    return equipmentData;
  });
