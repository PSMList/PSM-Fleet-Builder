/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Item, ItemValue } from '@/common/Item/ItemCard';
import { apiUrl } from './api';
import { extensionDataPromise } from './extension';
import { Faction, factionDataPromise } from './faction';
import { rarityDataPromise, Rarity } from './rarity';
import { technicalshapeDataPromise } from './technicalshape';
import { shipShapeDataPromise, ShipType } from './shiptype';

interface ShipDataItem {
  id: number;
  idfaction: number;
  idrarity: number;
  idextension: number;
  idtype: number;
  name: string;
  numid: string;
  points: number;
  masts: number;
  cargo: number;
  basemove: string;
  cannons: string;
  aptitudelocale: string;
  lorelocale: string;
  defaultaptitude: string;
  defaultlore: string;
  temporarylinktxt: string;
  isfort: boolean;
  idtechnicalshape: number;
  custom: 0 | 1;
  released: 0 | 1;
  collectable: 0 | 1;
  idimagefullship: number;
  idimage80ship: number;
  idimage30ship: number;
}

export type Fort = Item & {
  rarity: Rarity;
  points: number;
  faction: Faction;
  cannons: string;
  technicalshape: string;
};

export type Ship = Fort & {
  basemove: string;
  masts: number;
  cargo: number;
  subType: ShipType;
};

const dataPromise = fetch(`${apiUrl}/ship?custom=include`)
  .then((res) => res.json() as Promise<ShipDataItem[]>)
  .then(async (data) => {
    const extensionData = await extensionDataPromise;
    const factionData = await factionDataPromise;
    const rarityData = await rarityDataPromise;
    const shipShapeData = await shipShapeDataPromise;
    const technicalshapeData = await technicalshapeDataPromise;
    const shipData = new Map<number, Ship>();
    const fortData = new Map<number, Fort>();

    data.forEach((item) => {
      const faction = factionData.get(item.idfaction)!;
      const extension = extensionData.get(item.idextension)!;
      const rarity = rarityData.get(item.idrarity)!;
      const technicalshape = technicalshapeData.get(item.idtechnicalshape)!;
      const subType = shipShapeData.get(item.idtype)!;

      const newItem = {
        type: ItemValue.Ship,
        id: item.id,
        img: `gameicons/x80/${extension.short}/${item.numid}.jpg`,
        faction,
        rarity,
        extension,
        numid: item.numid,
        name: item.name,
        fullname: `${extension.short}${item.numid} ${item.name}`,
        points: item.points,
        cannons: item.cannons,
        aptitude: item.defaultaptitude,
        custom: item.custom,
        technicalshape: technicalshape.name,
      };

      if (item.isfort) {
        fortData.set(item.id, newItem);
      } else {
        shipData.set(item.id, {
          ...newItem,
          masts: item.masts,
          cargo: item.cargo,
          basemove: item.basemove,
          subType,
        });
      }
    });

    return [shipData, fortData] as const;
  });

export const shipDataPromise = dataPromise.then(([shipData]) => shipData);
export const fortDataPromise = dataPromise.then(([, fortData]) => fortData);
