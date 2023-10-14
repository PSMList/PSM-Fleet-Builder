/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ItemType } from '@/components/commons/Item';
import { apiUrl } from './api';
import { extensionDataPromise } from './extension';
import { rarityDataPromise } from './rarity';
import { baseUrl } from '@/App';

interface EquipmentDataItem {
  id: number;
  idrarity: number;
  idextension: number;
  name: string;
  numid: string;
  points: number;
  defaultaptitude: string;
  custom: 0 | 1;
}

export type EquipmentType = ItemType & {
  points: number;
};

export const equipmentDataPromise = fetch(`${apiUrl}/equipment?custom=include`)
  .then((res) => res.json() as Promise<EquipmentDataItem[]>)
  .then(async (data) => {
    const extensionData = await extensionDataPromise;
    const rarityData = await rarityDataPromise;
    const equipmentData = new Map<number, EquipmentType>();

    data.forEach((item) => {
      const extension = extensionData.get(item.idextension)!;
      const rarity = rarityData.get(item.idrarity)!;

      equipmentData.set(item.id, {
        id: item.id,
        img: `${baseUrl}/img/gameicons/x80/${extension.short}/${item.numid}.jpg`,
        altimg: `${baseUrl}/img/gameicons/x80/notfound.jpg`,
        rarity,
        extension,
        numid: item.numid,
        name: item.name,
        fullname: `${extension.short}${item.numid} ${item.name}`,
        points: item.points,
        defaultaptitude: item.defaultaptitude,
        custom: !!item.custom,
      });
    });
    return equipmentData;
  });
