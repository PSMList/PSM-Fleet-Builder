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

export const rarityDataPromise = fetch('http://localhost:8080/api/rarity')
    .then( res => res.json() as Promise<RarityDataItem[]> )
    .then( data => {
        const rarityData = new Map<number, RarityType>();
        data.forEach( rarity =>
            rarityData.set(rarity.id, {
                id: rarity.id,
                colorhex: rarity.colorhex,
            })
        );
        return rarityData;
    });