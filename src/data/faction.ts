import { apiUrl } from "./api"

type FactionDataItem = {
    id: number
    namelocale: string
    nameimg: string
    datecrea: Date
    datemodif: Date
    defaultname: string
    idauthor: number
    custom: boolean
}

export type FactionType = {
    id: number
    defaultname: string
    nameimg: string
}

export const factionDataPromise = fetch(`${apiUrl}/faction`)
    .then( res => res.json() as Promise<FactionDataItem[]> )
    .then( data => {
        const factionData = new Map<number, FactionType>();
        data.forEach( faction => {
            if (faction.custom) return;

            return factionData.set(faction.id, {
                id: faction.id,
                defaultname: faction.defaultname,
                nameimg: faction.nameimg
            });
        });
        return factionData;
    });