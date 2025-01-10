/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Item, ItemValue } from '@/common/Item/ItemCard';
import { apiUrl } from './api';
import { extensionDataPromise } from './extension';
import { Faction, factionDataPromise } from './faction';
import { rarityDataPromise, Rarity } from './rarity';

interface CrewDataItem {
  id: number;
  idfaction: number;
  idrarity: number;
  idextension: number;
  name: string;
  numid: string;
  points: number;
  defaultaptitude: string;
  aptitudelocale: string;
  temporarylinktxt: string;
  custom: 0 | 1;
  coinvalues: string;
  lorelocale: string;
  defaultlore: string;
  idimagefullcrew: string;
  idimage80crew: string;
  idimage30crew: string;
}

export type Crew = Item & {
  points: number;
  faction: Faction;
  rarity: Rarity;
  img: string;
};

export const crewDataPromise = fetch(`${apiUrl}/crew?custom=include`)
  .then((res) => res.json() as Promise<CrewDataItem[]>)
  .then(async (data) => {
    const extensionData = await extensionDataPromise;
    const factionData = await factionDataPromise;
    const rarityData = await rarityDataPromise;
    const crewData = new Map<number, Crew>();

    data.forEach((item) => {
      const faction = factionData.get(item.idfaction)!;
      const extension = extensionData.get(item.idextension)!;
      const rarity = rarityData.get(item.idrarity)!;

      const imgPath = `${item.custom ? 'custom' : 'gameicons'}/x80`;

      crewData.set(item.id, {
        type: ItemValue.Crew,
        id: item.id,
        img: `${imgPath}/${item.custom ? item.idimage80crew : `${extension.short}/${item.numid}.jpg`}`,
        faction,
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
    return crewData;
  });
