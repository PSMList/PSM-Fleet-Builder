/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ItemType } from '@/components/commons/Item';
import { apiUrl } from './api';
import { extensionDataPromise } from './extension';
import { FactionType, factionDataPromise } from './faction';
import { rarityDataPromise } from './rarity';
import { baseUrl } from '@/App';

interface CrewDataItem {
  id: number;
  idfaction: number;
  idrarity: number;
  idextension: number;
  name: string;
  numid: string;
  points: number;
  defaultaptitude: string;
  temporarylinktxt: string;
  custom: 0 | 1;
}

export type CrewType = ItemType & {
  points: number;
  faction: FactionType;
};

export const crewDataPromise = fetch(`${apiUrl}/crew?custom=include`)
  .then((res) => res.json() as Promise<CrewDataItem[]>)
  .then(async (data) => {
    const extensionData = await extensionDataPromise;
    const factionData = await factionDataPromise;
    const rarityData = await rarityDataPromise;
    const crewData = new Map<number, CrewType>();

    data.forEach((item) => {
      const faction = factionData.get(item.idfaction)!;
      const extension = extensionData.get(item.idextension)!;
      const rarity = rarityData.get(item.idrarity)!;

      crewData.set(item.id, {
        id: item.id,
        img: `${baseUrl}/img/gameicons/x80/${extension.short}/${item.numid}.jpg`,
        altimg: `${baseUrl}/img/logos/crew.png`,
        faction,
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
    return crewData;
  });
