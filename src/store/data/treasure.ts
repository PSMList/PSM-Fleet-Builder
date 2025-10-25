/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Item, ItemValue } from '@/common/Item/ItemCard';
import { apiUrl } from './api';
import { extensionDataPromise } from './extension';
import { rarityDataPromise, Rarity } from './rarity';

interface TreasureDataItem {
  id: number;
  idrarity: number;
  idextension: number;
  name: string;
  numid: string;
  points: number;
  defaultaptitude: string;
  custom: 0 | 1;
  released: 0 | 1;
  collectable: 0 | 1;
  idimagefulltreasure: string;
  idimage80treasure: string;
  idimage30treasure: string;
  coinvalues: string;
}

export type TreasureItem = Item & {
  rarity: Rarity;
  aptitude: string;
  points: number;
};

export const treasureDataPromise = fetch(`${apiUrl}/treasure?custom=include`)
  .then((res) => res.json() as Promise<TreasureDataItem[]>)
  .then(async (data) => {
    const extensionData = await extensionDataPromise;
    const rarityData = await rarityDataPromise;
    const treasureData = new Map<number, TreasureItem>();

    data.forEach((item) => {
      const extension = extensionData.get(item.idextension)!;
      const rarity = rarityData.get(item.idrarity)!;

      let imgPath = 'gameicons';
      let img = `${extension.short}/${item.numid}.jpg`;

      if (item.custom) {
        imgPath = 'custom/treasure';

        if (item.idimage80treasure) {
          img = `x80/${item.idimage80treasure}`;
        } else if (item.idimage30treasure) {
          img = `x30/${item.idimage30treasure}`;
        }
      }

      treasureData.set(item.id, {
        type: ItemValue.Treasure,
        id: item.id,
        rarity,
        extension,
        numid: item.numid,
        name: item.name,
        fullname: `${extension.short}${item.numid} ${item.name}`,
        aptitude: item.defaultaptitude,
        custom: item.custom,
        img: `${imgPath}/${img}`,
        points: item.points,
      });
    });
    return treasureData;
  });
