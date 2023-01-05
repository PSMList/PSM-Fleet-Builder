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

export const extensionDataPromise = fetch('http://localhost:8080/api/extension')
    .then( res => res.json() as Promise<ExtensionDataItem[]> )
    .then( data => {
        const extensionData = new Map<number, ExtensionType>();
        data.forEach( extension =>
            extensionData.set(extension.id, {
                id: extension.id,
                name: extension.name,
                short: extension.short,
            })
        );
        return extensionData;
    });