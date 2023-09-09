import { ItemType } from '@/components/commons/Item';
import { apiUrl } from './api';
import { CrewType } from './crew';
import { extensionDataPromise } from './extension';
import { factionDataPromise } from './faction';
import { rarityDataPromise } from './rarity';
import { technicalshapeDataPromise } from './technicalshape';

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
  datecrea: Date;
  datemodif: Date;
  released: boolean;
  collectable: boolean;
  lookingforbetterpic: boolean;
  idtechnicalshape: number;
  idauthor: number;
  custom: boolean;
}

export type ShipType = ItemType & {
  basemove: string;
  cannons: string;
  crew: CrewType[];
  masts: number;
  cargo: number;
  isfort: boolean;
};

export const shipDataPromise = fetch(`${apiUrl}/ship?custom=include`)
  .then((res) => res.json() as Promise<ShipDataItem[]>)
  .then(async (data) => {
    const factionData = await factionDataPromise;
    const extensionData = await extensionDataPromise;
    const rarityData = await rarityDataPromise;
    const technicalshapeData = await technicalshapeDataPromise;
    const shipData = new Map<number, ShipType>();

    data.forEach((item) => {
      const faction = factionData.get(item.idfaction)!;
      const extension = extensionData.get(item.idextension)!;
      const rarity = rarityData.get(item.idrarity)!;
      const technicalshape = technicalshapeData.get(item.idtechnicalshape)!;

      shipData.set(item.id, {
        id: item.id,
        img: `${window.baseUrl}/img/gameicons/x80/${extension.short}/${item.numid}.jpg`,
        altimg: `${window.baseUrl}/img/technicalshape/icon/${technicalshape.name}.jpg`,
        faction,
        rarity,
        extension,
        numid: item.numid,
        name: item.name,
        fullname: `${extension.short}${item.numid} ${item.name}`,
        points: item.points,
        cargo: item.cargo,
        masts: item.masts,
        basemove: item.basemove,
        cannons: item.cannons,
        defaultaptitude: item.defaultaptitude,
        isfort: item.isfort,
        crew: [],
        custom: item.custom,
      });
    });
    return shipData;
  });
