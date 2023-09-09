import { apiUrl } from './api';

interface FactionDataItem {
  id: number;
  namelocale: string;
  nameimg: string;
  datecrea: Date;
  datemodif: Date;
  defaultname: string;
  idauthor: number;
  custom: boolean;
  extIcon?: string;
}

export interface FactionType {
  id: number;
  defaultname: string;
  nameimg: string;
  custom: boolean;
  icon: string;
}

export const factionDataPromise = fetch(`${apiUrl}/faction?custom=include`)
  .then((res) => res.json() as Promise<FactionDataItem[]>)
  .then((data) => {
    const factionData = new Map<number, FactionType>();
    data.forEach((faction) =>
      factionData.set(faction.id, {
        id: faction.id,
        defaultname: faction.defaultname,
        nameimg: faction.nameimg,
        custom: faction.custom,
        icon: `/img/flag/flat/normal/${faction.nameimg}.png`,
      })
    );
    return factionData;
  });
