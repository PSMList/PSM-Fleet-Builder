import { baseUrl } from "@/App";

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

const factionsData: { [id: number]: FactionType } = {};
(await fetch('http://localhost:8080/api/faction').then( res => res.json() ) as FactionDataItem[])
    .forEach( faction => factionsData[faction.id] = {
        id: faction.id,
        defaultname: faction.defaultname,
        nameimg: faction.nameimg
    });

export default factionsData;