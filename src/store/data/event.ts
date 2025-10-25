import { Item, ItemValue } from '@/common/Item/ItemCard';
import { apiUrl } from './api';
import { extensionDataPromise } from './extension';
import { Rarity, rarityDataPromise } from './rarity';

interface EventDataItem {
  id: number;
  idextension: number;
  idrarity: number;
  name: string;
  numid: string;
  aptitude: string;
  slugname: string;
  points: number;
  idimagefullevent: number;
  idimage80event: number;
  idimage30event: number;
}

export type EventItem = Item & {
  points: number;
  rarity: Rarity;
};

export const eventDataPromise = fetch(`${apiUrl}/event?custom=include`)
  .then((res) => res.json() as Promise<EventDataItem[]>)
  .then(async (data) => {
    const eventData = new Map<number, EventItem>();
    const extensionData = await extensionDataPromise;
    const rarityData = await rarityDataPromise;

    data.forEach((event) => {
      const extension = extensionData.get(event.idextension)!;
      const rarity = rarityData.get(event.idrarity)!;

      eventData.set(event.id, {
        type: ItemValue.Event,
        id: event.id,
        extension,
        custom: extension.custom,
        name: event.name,
        numid: event.numid,
        fullname: `${extension.short}${event.numid} ${event.name}`,
        aptitude: event.aptitude,
        img: `gameicons/x80/${extension.short}/${event.numid}.jpg`,
        points: event.points,
        rarity,
      });
    });
    return eventData;
  });
