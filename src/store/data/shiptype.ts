/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { apiUrl } from './api';

interface ShipShapeDataItem {
  id: number;
  defaultname: string;
  nameimg: string;
}

export type ShipType = {
  id: number;
  name: string;
  nameimg: string;
};

export const shipShapeDataPromise = fetch(`${apiUrl}/shiptype`)
  .then((res) => res.json() as Promise<ShipShapeDataItem[]>)
  .then(async (data) => {
    const shipShapeData = new Map<number, ShipType>();

    data.forEach((item) => {
      shipShapeData.set(item.id, {
        id: item.id,
        name: item.defaultname,
        nameimg: item.nameimg,
      });
    });
    return shipShapeData;
  });
