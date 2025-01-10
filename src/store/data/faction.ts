import { apiUrl } from './api';

interface FactionDataItem {
  id: number;
  namelocale: string;
  nameimg: string;
  defaultname: string;
  idauthor: number;
  custom: 0 | 1;
  extIcon?: string;
}

export interface Faction {
  id: number;
  name: string;
  custom: 0 | 1;
  icon: string;
}

export const factionDataPromise = fetch(`${apiUrl}/faction?custom=include`)
  .then((res) => res.json() as Promise<FactionDataItem[]>)
  .then((data) => {
    const factionData = new Map<number, Faction>();
    data.forEach((faction) =>
      factionData.set(faction.id, {
        id: faction.id,
        name: faction.defaultname,
        custom: faction.custom,
        icon: `flag/flat/normal/${faction.nameimg}.png`,
      }),
    );
    return factionData;
  });
