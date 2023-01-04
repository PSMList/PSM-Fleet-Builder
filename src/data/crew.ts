
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

export type CrewType = {
    id: number
    idfaction: number
    idrarity: number
    idextension: number
    name: string
    numid: string
    points: number
    defaultaptitude: string
    lookingforbetterpic: boolean
}

export const crewData: CrewType[] = (await fetch('http://localhost:8080/api/crew').then( res => res.json() ) as CrewDataItem[]);