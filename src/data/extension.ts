import { apiUrl } from './api';

interface ExtensionDataItem {
  id: number;
  name: string;
  short: string;
  shortwizkids: string;
  shortcommunity: string;
  nameimg: string;
  releasedate: Date;
  desclocale: string;
  datecrea: Date;
  datemodif: Date;
  isfromwizkids: boolean;
  idauthor: number;
  custom: 0 | 1;
  searchsort: number;
  colorhex: string;
  imagebackground?: string;
  exticon?: string;
}

export interface ExtensionType {
  id: number;
  name: string;
  short: string;
  colorhex: string;
  custom: boolean;
  searchsort: number;
  bg: string;
  icon: string;
}

export const extensionDataPromise = fetch(`${apiUrl}/extension?custom=include`)
  .then((res) => res.json() as Promise<ExtensionDataItem[]>)
  .then((data) => {
    const extensionData = new Map<number, ExtensionType>();
    data.forEach((extension) =>
      extensionData.set(extension.id, {
        id: extension.id,
        name: extension.name,
        short: extension.short,
        colorhex: extension.colorhex,
        custom: !!extension.custom,
        searchsort: extension.searchsort,
        bg: extension.custom
          ? extension.imagebackground
            ? `img/custom/expansion/background/${extension.imagebackground}`
            : ''
          : `img/bg_card/m/bg_${extension.short.replace(/U$/, '')}.png`,
        icon: extension.custom
          ? extension.exticon
            ? `img/custom/expansion/icon/${extension.exticon}`
            : ''
          : `img/logos/logo_${extension.short.replace(/U$/, '')}_o.png`,
      })
    );
    return extensionData;
  });
