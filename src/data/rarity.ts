import { baseUrl } from "@/App";

type RarityDataItem = {
    id: number
    namelocale: string
    defaultname: string
    colorhex: string
}

export type RarityType = {
    id: number
    colorhex: string
}

const raritiesData: { [id: number]: RarityType } = {};
(await fetch('http://localhost:8080/api/rarity').then( res => res.json() ) as RarityDataItem[])
    .forEach( rarity => raritiesData[rarity.id] = {
        id: rarity.id,
        colorhex: rarity.colorhex,
    });

export default raritiesData;