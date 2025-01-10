import { apiUrl } from './api';

interface RarityDataItem {
  id: number;
  namelocale: string;
  defaultname: string;
  colorhex: string;
}

export interface Rarity {
  id: number;
  color: string;
}

export const rarityDataPromise = fetch(`${apiUrl}/rarity`)
  .then((res) => res.json() as Promise<RarityDataItem[]>)
  .then((data) => {
    const rarityData = new Map<number, Rarity>();
    data.forEach((rarity) =>
      rarityData.set(rarity.id, {
        id: rarity.id,
        color: rarity.colorhex,
      }),
    );
    return rarityData;
  });
