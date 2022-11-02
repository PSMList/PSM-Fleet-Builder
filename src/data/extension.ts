export type ExtensionType = {
    id: number
    name: string
    short: string
    img: string
}

type ExtensionDataItem = [
    id: number,
    name: string,
    nameimg: string,
]

const extensionData: ExtensionDataItem[] = JSON.parse(
    `[[2,"Pirates of the Spanish Main","SM"],[3,"Pirates of the Crimson Coast","CC"],[4,"Pirates of the Revolution","RV"],[5,"Pirates of the Barbary Coast","BC"],[6,"Pirates of the South China Seas","SCS"],[7,"Pirates of the Davy Jones' Curse","DJC"],[8,"Pirates of the Mysterious Islands","MI"],[9,"Pirates of the Frozen North","FN"],[10,"Pirates at Ocean's Edge","OE"],[11,"Pirates of Carribean","CA"],[12,"Pirates of the Cursed Seas : Rise of Fiends","RF"],[13,"Pirates of the Cursed Seas : Fire and Steel","FS"],[14,"Pirates of the Savages Shores","SS"],[19,"Pirates of the Spanish Main Unlimited","SMU"],[20,"Pirates of the Revolution Unlimited","RVU"],[21,"Pirates of the Barbary Coast Unlimited","BCU"],[22,"Return to Savage Shores","RSS"]]`
);

const extensions: { [id: string]: ExtensionType } = {};
for (const extension of extensionData) {
    extensions[extension[0]] = {
        id: extension[0],
        name: extension[1],
        short: extension[2],
        img: `/public/img/logos/logo_${extension[2].replace(/(U)$/, '')}_o.png`
    }
}

export default extensions;