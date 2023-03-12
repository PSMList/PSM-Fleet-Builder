import { apiUrl } from "./api"

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
    colorhex: string
}

export type ExtensionType = {
    id: number
    name: string
    short: string
    colorhex: string
    custom: boolean
    releasedate: Date
}

export const extensionDataPromise = fetch(`${apiUrl}/extension`)
    .then( res => res.json() as Promise<ExtensionDataItem[]> )
    .then( data => {
        const extensionData = new Map<number, ExtensionType>();
        data.forEach( extension =>
            extensionData.set(extension.id, {
                id: extension.id,
                name: extension.name,
                short: extension.short,
                colorhex: extension.colorhex,
                custom: extension.custom,
                releasedate: extension.releasedate
            })
        );
        return extensionData;
    });