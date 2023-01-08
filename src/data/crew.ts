import { ItemType } from "@/components/commons/Item"
import { apiUrl } from "./api"
import { extensionDataPromise } from "./extension"
import { factionDataPromise } from "./faction"
import { rarityDataPromise } from "./rarity"

type CrewDataItem = {
    id: number
    idfaction: number
    idrarity: number
    idextension: number
    name: string
    numid: string
    points: number
    defaultaptitude: string
    defaultlore: string
    temporarylinktxt: string
    datecrea: Date
    datemodif: Date
    released: boolean
    collectable: boolean
    lookingforbetterpic: boolean
    idauthor: number
}

export type CrewType = ItemType & {
}

export const crewDataPromise = fetch(`${apiUrl}/crew`)
    .then( res => res.json() as Promise<CrewDataItem[]> )
    .then( async data => {
        const factionData = await factionDataPromise;
        const extensionData = await extensionDataPromise;
        const rarityData = await rarityDataPromise;
        const crewData = new Map<number, CrewType>();

        data.forEach( item => {
            const faction = factionData.get(item.idfaction)!;
            const extension = extensionData.get(item.idextension)!;
            const rarity = rarityData.get(item.idrarity)!;

            crewData.set(item.id, {
                id: item.id,
                img: (!item.lookingforbetterpic ? `${window.baseUrl}/img/gameicons/x80/${extension.short}/${item.numid}.jpg` : '/public/img/logos/crew.png'),
                altimg: `${window.baseUrl}/img/logos/crew.png`,
                faction,
                rarity,
                extension,
                numid: item.numid,
                name: item.name,
                fullname: `${extension.short}${item.numid} ${item.name}`,
                points: item.points,
                defaultaptitude: item.defaultaptitude
            });
        });
        return crewData;
    });