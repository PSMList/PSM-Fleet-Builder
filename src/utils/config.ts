declare global {
  interface Window {
    fleetMaxpointsMin: number;
    fleetMaxpointsMax: number;
    fleetNameMinlength: number;
    fleetNameMaxlength: number;
    baseUrl: string;
    isOwn: boolean;
  }
}

export const slugname = location.pathname.match(/show\/(\w{10,16})/)?.[1] ?? '';
export const onlyDisplay = !window.isOwn;
export const baseUrl = window.baseUrl;
export const baseImg = `${baseUrl}/img`;
export const baseSvg = `${baseImg}/svg`;
