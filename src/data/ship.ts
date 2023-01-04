
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

export type ShipType = {
    id: number
    idfaction: number
    idrarity: number
    idextension: number
    name: string
    numid: string
    points: number
    masts: number
    cargo: number
    basemove: string
    cannons: string
    defaultaptitude: string
    isfort: boolean
    lookingforbetterpic: boolean
}

export const shipData: ShipType[] = (await fetch('http://localhost:8080/api/ship').then( res => res.json() ) as ShipDataItem[]);