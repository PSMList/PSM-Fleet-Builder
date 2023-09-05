import { apiUrl } from "./api";

type FactionDataItem = {
  id: number;
  namelocale: string;
  nameimg: string;
  datecrea: Date;
  datemodif: Date;
  defaultname: string;
  idauthor: number;
  custom: boolean;
};

export type FactionType = {
  id: number;
  defaultname: string;
  nameimg: string;
  custom: boolean;
};

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
      })
    );
    return factionData;
  });
