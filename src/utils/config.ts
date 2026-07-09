declare global {
  interface Window {
    fleetMaxpointsMin: number;
    fleetMaxpointsMax: number;
    fleetNameMinlength: number;
    fleetNameMaxlength: number;
    apiUrl: string;
    baseUrl: string;
    isOwn: boolean;
  }
}

export const slugname = location.pathname.match(/show\/(\w{10,16})/)?.[1] ?? '';
export const isOwn = window.isOwn;
export const apiUrl = window.apiUrl;
export const baseUrl = window.baseUrl;
export const baseImg = `${baseUrl}/img`;
export const baseSvg = `${baseImg}/svg`;
