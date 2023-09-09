import { apiUrl } from "./api";

type TechnicalShapeDataItem = {
  id: number;
  name: string;
  masts: number;
  custom: boolean;
};

export type TechnicalShapeType = {
  id: number;
  name: string;
};

export const technicalshapeDataPromise = fetch(`${apiUrl}/technicalshape`)
  .then((res) => res.json() as Promise<TechnicalShapeDataItem[]>)
  .then((data) => {
    const technicalshapeData = new Map<number, TechnicalShapeType>();
    data.forEach((technicalshape) =>
      technicalshapeData.set(technicalshape.id, {
        id: technicalshape.id,
        name: technicalshape.name,
      })
    );
    return technicalshapeData;
  });
