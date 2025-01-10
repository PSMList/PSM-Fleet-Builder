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
  custom: 0 | 1;
  searchsort: number;
  slugname: string;
  colorhex: string;
  imagebackground?: string;
  exticon?: string;
  colorhextextlore: string;
  colorhextextability: string;
  colorhextextname: string;
  parchmentmode: string;
  colorhextextfort: string;
}

export interface Extension {
  id: number;
  name: string;
  short: string;
  custom: 0 | 1;
  sort: number;
  bgColor: string;
  bg: string;
  icon: string;
}

export const extensionDataPromise = fetch(
  `${apiUrl}/extension?custom=include&icons`,
)
  .then((res) => res.json() as Promise<ExtensionDataItem[]>)
  .then((data) => {
    const extensionData = new Map<number, Extension>();

    data.forEach((extension) =>
      extensionData.set(extension.id, {
        id: extension.id,
        name: extension.name,
        short: extension.short,
        custom: extension.custom,
        sort: extension.searchsort,
        bgColor: extension.colorhex,
        bg: extension.custom
          ? extension.imagebackground
            ? `custom/expansion/background/${extension.imagebackground}`
            : ''
          : `bg_card/m/bg_${extension.short.replace(/U$/, '')}.png`,
        icon: extension.custom
          ? extension.exticon
            ? `custom/expansion/icon/${extension.exticon}`
            : 'logos/noimg.png'
          : `logos/logo_${extension.short.replace(/U$/, '')}_o.png`,
      }),
    );

    return extensionData;
  });
