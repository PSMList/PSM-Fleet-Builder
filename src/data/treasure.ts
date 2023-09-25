/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ItemType } from '@/components/commons/Item';
import { apiUrl } from './api';
import { extensionDataPromise } from './extension';
import { rarityDataPromise } from './rarity';

interface TreasureDataItem {
  id: number;
  idrarity: number;
  idextension: number;
  name: string;
  numid: string;
  points: number;
  defaultaptitude: string;
  custom: 0 | 1;
}

export type TreasureType = ItemType;

export const treasureDataPromise = fetch(`${apiUrl}/treasure?custom=include`)
  .then((res) => res.json() as Promise<TreasureDataItem[]>)
  .then(async (data) => {
    const extensionData = await extensionDataPromise;
    const rarityData = await rarityDataPromise;
    const treasureData = new Map<number, TreasureType>();

    data.forEach((item) => {
      const extension = extensionData.get(item.idextension)!;
      const rarity = rarityData.get(item.idrarity)!;

      treasureData.set(item.id, {
        id: item.id,
        img: `${window.baseUrl}/img/gameicons/x80/${extension.short}/${item.numid}.jpg`,
        altimg: `${window.baseUrl}/img/gameicons/x80/notfound.jpg`,
        rarity,
        extension,
        numid: item.numid,
        name: item.name,
        fullname: `${extension.short}${item.numid} ${item.name}`,
        defaultaptitude: item.defaultaptitude,
        custom: !!item.custom,
      });
    });
    return treasureData;
  });
