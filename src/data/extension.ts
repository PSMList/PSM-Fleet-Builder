type ExtensionDataItem = {
    id: number
    name: string
    short: string
    shortwizkids: string
    shortcommunity: string
    nameimg: string
    releasedate: Date
    desclocale: string
    datecrea: Date
    datemodif: Date
    isfromwizkids: boolean
    idauthor: number
    custom: boolean
    searchsort: number
}

export type ExtensionType = {
    id: number
    name: string
    short: string
}

const extensionsData: { [id: number ]: ExtensionType } = {};
(await fetch('http://localhost:8080/api/extension').then( res => res.json() ) as ExtensionDataItem[])
    .forEach( extension => extensionsData[extension.id] = {
        id: extension.id,
        name: extension.name,
        short: extension.short,
    });

export default extensionsData;