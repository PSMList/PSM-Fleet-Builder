export type FactionType = {
    id: number
    name: string
    img: string
}

type FactionDataItem = [
    id: number,
    defaultname: string,
    nameimg: string
]

const factionData: FactionDataItem[] = JSON.parse(
    `[[1,"Viking","viking"],[2,"Mercenary","mercenary"],[3,"France","france"],[4,"America","america"],[5,"Pirate","pirate"],[6,"England","england"],[7,"Spain","spain"],[8,"Jade Rebellion","jade"],[9,"Barbary Corsairs","corsairs"],[10,"Cursed","cursed"],[12,"Whitebeard's Raiders","whitebeardraiders"]]`
)

const factions: { [id: string]: FactionType } = {};
for (const faction of factionData) {
    factions[faction[0]] = {
        id: faction[0],
        name: faction[1],
        img: `/public/img/flag/search/${faction[2]}.png`
    }
}


export default factions;