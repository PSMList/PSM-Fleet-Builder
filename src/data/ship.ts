import { ItemType } from "@/components/commons/Item"
import { apiUrl } from "./api"
import { CrewType } from "./crew"
import { extensionDataPromise } from "./extension"
import { factionDataPromise } from "./faction"
import { rarityDataPromise } from "./rarity"

type ShipDataItem = {
    id: number
    idfaction: number
    idrarity: number
    idextension: number
    idtype: number
    name: string
    numid: string
    points: number
    masts: number
    cargo: number
    basemove: string
    cannons: string
    aptitudelocale: string
    lorelocale: string
    defaultaptitude: string
    defaultlore: string
    temporarylinktxt: string
    isfort: boolean
    datecrea: Date
    datemodif: Date
    released: boolean
    collectable: boolean
    lookingforbetterpic: boolean
    idtechnicalshape: number
    idauthor: number
}

export type ShipType = ItemType & {
    basemove: string
    cannons: string
    crew: CrewType[]
    masts: number
    cargo: number
    isfort: boolean
    uuid: string
}

export const shipDataPromise = fetch(`${apiUrl}/ship`)
    .then( res => res.json() as Promise<ShipDataItem[]> )
    .then( async data => {
        const factionData = await factionDataPromise;
        const extensionData = await extensionDataPromise;
        const rarityData = await rarityDataPromise;
        const shipData = new Map<number, ShipType>();

        data.forEach( item => {
            if (!item.released) return;

            const faction = factionData.get(item.idfaction)!;
            const extension = extensionData.get(item.idextension)!;
            const rarity = rarityData.get(item.idrarity)!;

            shipData.set(item.id, {
                id: item.id,
                img: (!item.lookingforbetterpic ? `${window.baseUrl}/img/gameicons/x80/${extension.short}/${item.numid}.jpg` : '/public/img/logos/ship.png'),
                altimg: `${window.baseUrl}/img/logos/ship.png`,
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
                uuid: ''
            });
        });
        return shipData;
    });