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

export const factionDataPromise = fetch('http://localhost:8080/api/faction')
    .then( res => res.json() as Promise<FactionDataItem[]> )
    .then( data => {
        const factionData = new Map<number, FactionType>();
        data.forEach( faction =>
            factionData.set(faction.id, {
                id: faction.id,
                defaultname: faction.defaultname,
                nameimg: faction.nameimg
            })
        );
        return factionData;
    });